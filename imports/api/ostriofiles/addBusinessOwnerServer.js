import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { FilesCollection } from 'meteor/ostrio:files';
import stream from 'stream';

import S3 from 'aws-sdk/clients/s3'; // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

    import {S3Details} from '/imports/api/s3Details.js';
    var s3Data =  S3Details.findOne({});

    if(s3Data)
    {
        // Example: S3='{"s3":{"key": "xxx", "secret": "xxx", "bucket": "xxx", "region": "xxx""}}' meteor
        process.env.S3='{"s3":{"key": "'+ s3Data.key+'", "secret": "'+ s3Data.secret+'", "bucket": "'+ s3Data.bucket +'", "region": "'+s3Data.region+'"}}' ;
            // S3 = Meteor.s3Details.findOne({});
        if (process.env.S3) {
            Meteor.settings.s3 = JSON.parse(process.env.S3).s3;
            // console.log(Meteor.settings.s3);
            const s3Conf = Meteor.settings.s3 || {};
            const bound = Meteor.bindEnvironment((callback) => {
                return callback();
            });

            // Check settings existence in `Meteor.settings`
            // This is the best practice for app security
            if (s3Conf && s3Conf.key && s3Conf.secret && s3Conf.bucket && s3Conf.region) {
                // Create a new S3 object
                //s3Conf.secret,
                //s3Conf.key,
                //s3Conf.region,
                const s3 = new S3({
                    secretAccessKey     : s3Conf.secret, 
                    accessKeyId         : s3Conf.key,                      
                    region              : s3Conf.region,                                
                    // sslEnabled: true, // optional
                    httpOptions: {
                        timeout : 60000,
                        agent   : false
                    }
                });

                // console.log('s3: ', s3);
                // Declare the Meteor file collection on the Server
                export const BusinessOwnerImages = new FilesCollection({
                  debug: true,
                  collectionName: 'BusinessOwnerImages',
                  allowClientCode: false, // Disallow remove files from Client
                  onBeforeUpload: function (file) {
                    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
                    if (file.size <= 1024 * 1024 * 3 && /png|jpe?g/i.test(file.extension)) {
                      return true;
                    }
                    return 'Please upload image, with size equal or less than 3 MB';
                  },

                    // Start moving files to AWS:S3
                    // after fully received by the Meteor server
                    onAfterUpload(fileRef) {
                        // Run through each of the uploaded file
                        // console.log("fileRef2: ", fileRef);
                        _.each(fileRef.versions, (vRef, version) => {
                            // We use Random.id() instead of real file's _id
                            // to secure files from reverse engineering on the AWS client
                            const filePath = 'files/' + (Random.id()) + '-' + version + '.' + fileRef.extension;
                            // console.log("filePath: ", filePath);

                            // Create the AWS:S3 object.
                            // Feel free to change the storage class from, see the documentation,
                            // `STANDARD_IA` is the best deal for low access files.
                            // Key is the file name we are creating on AWS:S3, so it will be like files/XXXXXXXXXXXXXXXXX-original.XXXX
                            // Body is the file stream we are sending to AWS
                            s3.putObject({
                                // ServerSideEncryption: 'AES256', // Optional
                                StorageClass : 'STANDARD',
                                Bucket       : s3Conf.bucket,         //s3Conf.bucket,
                                Key          : filePath,
                                Body         : fs.createReadStream(vRef.path),
                                ContentType  : vRef.type,
                            }, (error) => {
                                // console.log("error: ", error);
                                bound(() => {
                                    if (error) {
                                        console.error(error);
                                    } else {
                                        // Update FilesCollection with link to the file at AWS
                                        const upd = { $set: {} };
                                        upd['$set']['versions.' + version + '.meta.pipePath'] = filePath;
                                        console.log("upd: ", upd);

                                        this.collection.update({
                                            _id: fileRef._id
                                        }, upd, (updError) => {
                                            if (updError) {
                                                // console.log("updError: ", updError);
                                                console.error(updError);
                                            } else {
                                                // Unlink original files from FS after successful upload to AWS:S3
                                                // console.log("unlink: ", fileRef._id);
                                                this.unlink(this.collection.findOne(fileRef._id), version);
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    },


                    // Intercept access to the file
                    // And redirect request to AWS:S3
                    interceptDownload(http, fileRef, version) {
                        // console.log('interceptDownload');
                        let path;

                        if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
                            path = fileRef.versions[version].meta.pipePath;
                        }

                        if (path) {
                            // console.log('path ',path);
                            // If file is successfully moved to AWS:S3
                            // We will pipe request to AWS:S3
                            // So, original link will stay always secure

                            // To force ?play and ?download parameters
                            // and to keep original file name, content-type,
                            // content-disposition, chunked "streaming" and cache-control
                            // we're using low-level .serve() method
                            const opts = {
                                Bucket: s3Conf.bucket,
                                Key: path
                            };

                            if (http.request.headers.range) {
                                const vRef  = fileRef.versions[version];
                                let range   = _.clone(http.request.headers.range);
                                const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
                                const start = parseInt(array[1]);
                                let end = parseInt(array[2]);
                                if (isNaN(end)) {
                                    // Request data from AWS:S3 by small chunks
                                    end = (start + this.chunkSize) - 1;
                                    if (end >= vRef.size) {
                                        end = vRef.size - 1;
                                    }
                                }
                                opts.Range = `bytes=${start}-${end}`;
                                http.request.headers.range = `bytes=${start}-${end}`;
                            }

                            const fileColl = this;
                            s3.getObject(opts, function(error) {
                                if (error) {
                                    console.error(error);
                                    if (!http.response.finished) {
                                        http.response.end();
                                    }
                                } else {
                                    // console.log(opts);
                                    if (http.request.headers.range && this.httpResponse.headers['content-range']) {
                                        // Set proper range header in according to what is returned from AWS:S3
                                        http.request.headers.range = this.httpResponse.headers['content-range'].split('/')[0].replace('bytes ', 'bytes=');
                                    }

                                    const dataStream = new stream.PassThrough();
                                    // console.warn('fileColl ',fileColl);
                                    fileColl.serve(http, fileRef, fileRef.versions[version], version, dataStream);
                                    dataStream.end(this.data.Body);
                                }
                            });

                            return true;
                        }
                        // While file is not yet uploaded to AWS:S3
                        // It will be served file from FS
                        return false;
                    }
                });

                // Intercept FilesCollection's remove method to remove file from AWS:S3
                const _origRemove = BusinessOwnerImages.remove;
                BusinessOwnerImages.remove = function(search) {
                    const cursor = this.collection.find(search);
                    cursor.forEach((fileRef) => {
                        _.each(fileRef.versions, (vRef) => {
                            if (vRef && vRef.meta && vRef.meta.pipePath) {
                                // Remove the object from AWS:S3 first, then we will call the original FilesCollection remove
                                s3.deleteObject({
                                    Bucket: s3Conf.bucket,
                                    Key: vRef.meta.pipePath,
                                }, (error) => {
                                    bound(() => {
                                        if (error) {
                                            console.error(error);
                                        }
                                    });
                                });
                            }
                        });
                    });

                    //remove original file from database
                    _origRemove.call(this, search);
                };

            } else {
                throw new Meteor.Error(401, 'Missing Meteor file settings');
            }
        }

    }




