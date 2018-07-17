import { Business } from '/imports/api/businessMaster.js';
// import { BusinessImgUploadS3 } from '../cfsjs/businessImage.js';
import { BusinessImage } from '/imports/videoUploadserver/businessImageServer.js';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';

SearchSource.defineSource('sidebarBusinessBanners', (searchText, options)=> {
    //searchText = "city|area|categories OR text to search"
    var splitData = searchText.split('|');
    var searchResult = '';
    var selector = '';
    var option ='';
    var uniqueCategoryArr = [];
    var busBannerList = [];


    var searchCity      = splitData[0];
    var searchArea      = splitData[1];
    var searchCatg      = splitData[2];
    var searchString    = splitData[2];

    if(searchCity == 'undefined'){
        searchCity = 'Pune';
    }

    if(searchArea == 'undefined' || searchArea == 'All Areas'){
        var areaSelector = {};
    } else {
        var areaSelector = { "businessArea" : searchArea };
    }

    if(searchCatg == 'undefined'){
        var catgSelector =  {};
    } else {
        var categRegExp = buildRegExp(searchCatg);
        if(categRegExp){
            var catgSelector = {
                                    $or:[
                                            {allCategories : categRegExp},
                                            {alltags       : categRegExp},
                                        ]
                                };
        }
    }

    if(searchString == 'undefined'){
        var textSelector =  {};
    } else {
        var textRegExp = buildRegExp(searchString);
        var textSelector = {};
        textSelector["$or"] = [];
        textSelector["$or"].push({"businessTitle" : textRegExp});
        textSelector["$or"].push({"businessTag" : textRegExp});
        textSelector["$or"].push({"businesscategories" : textRegExp});
    }
    // options = { sort: { businessTitle:1}, limit: 20 };
    options = { sort: { businessTitle:1}};

    var selector = {}; 
    selector["$and"] = [];
    selector["$and"].push(textSelector);
    selector["$and"].push({"businessCity":searchCity}); 
    selector["$and"].push({"status" : "active"}); 
    selector["$and"].push(areaSelector);
    // selector["$and"].push(catgSelector);

    
    searchResult = Business.find(selector, options).fetch();

    // =========================================================
    // ==================Get Image URL from Start ==============
    // =========================================================
    var searchPageShowImage = (imgId)=> {
		if(imgId){
			var imgData = BusinessImage.findOne({"_id":imgId});
            // console.log('imgData :',imgData);
            // console.log('imgData :',imgData.link());
			if(imgData)	{
				var data = {
					img : imgData.link(),
				}
                // if(imgData.copies.businessImgS3.type == 'image/png'){
				if(imgData.type == 'image/png'){
					data.checkpngImg = 'bkgImgNone';
				}else{
					data.checkpngImg = '';
				}
			}else{
				var data = {
					img : '/images/rightnxt_image_nocontent.jpg',
					checkpngImg: '',
				};
			}
			return data;
        }
    }
    // =========================================================
    // ==================Get Image URL from End ================
    // =========================================================

    if(searchResult){
        for(i=0;i<searchResult.length;i++){
            if(searchResult[i].allCategories){
                var listCatArr = (searchResult[i].allCategories).split(',');
                if(listCatArr){
                    for(j=0;j<listCatArr.length;j++){
                        var listSplitArr = listCatArr[j].split('>');
                        uniqueCategoryArr.push(listSplitArr[1].trim());
                    }
                }
            }
        }
        uniqueCategoryArr = _.uniq(uniqueCategoryArr, function(p){ return p; });
    }

    if(uniqueCategoryArr.length>0){
        for(i=0;i<uniqueCategoryArr.length;i++){
            var businessBanner = BusinessBanner.find({"category":uniqueCategoryArr[i],"status":"active"}).fetch();
            busBannerList = busBannerList.concat(businessBanner);
        }
    }

    // To sort array with position 1 to 5
    function sortArrOfObjectsByParam(a, b) {
        const genreA = parseInt(a.position);
        const genreB = parseInt(b.position);
        let comparison = 0;
        if (genreA > genreB) {
        comparison = 1;
        } else if (genreA < genreB) {
        comparison = -1;
        } else {
        comparison = -1;
        }
        return comparison;
    }
    busBannerList.sort(sortArrOfObjectsByParam);

    // Sort Busines to a and b separately
    var businessBannerListA = [];
    var businessBannerListB = [];
    if(busBannerList){
        for(i=0;i<busBannerList.length;i++){
            if(busBannerList[i].rank=="a"){
                businessBannerListA.push(busBannerList[i]);
            }
            if(busBannerList[i].rank=="b"){
                businessBannerListB.push(busBannerList[i]);
            }
        }
    }

    // Return Random Busines by a and b rank 
    var randomInt = Math.random();
    if(randomInt<0.5){
        businessBannerListA = _.uniq(businessBannerListA, function(p){ return p.businessLink; });
        if(businessBannerListA){
            for(i=0;i<businessBannerListA.length;i++){
                for(j=0;j<searchResult.length;j++){
                    if(businessBannerListA[i].businessLink==searchResult[j].businessLink){
                        businessBannerListA[i].businessAboutBus = searchResult[j].businessAboutBus;
                        break;
                    }
                }

                var getBannnerImage = Business.findOne({"businessLink":businessBannerListA[i].businessLink});
                if(getBannnerImage){
                    if(getBannnerImage.publishedImage){
                        businessBannerListA[i].businessSelectedImagesNew = searchPageShowImage(getBannnerImage.publishedImage);
                    } else{
                        if(getBannnerImage.businessImages){
                            if(getBannnerImage.businessImages[0]){
                                businessBannerListA[i].businessSelectedImagesNew = searchPageShowImage(getBannnerImage.businessImages[0].img);
                            }else{
                                var data = {
                                    img : '/images/rightnxt_image_nocontent.jpg',
                                    checkpngImg: '',
                                };
                                businessBannerListA[i].businessSelectedImagesNew = data;
                            }
                        }else{
                            var data = {
                                img : '/images/rightnxt_image_nocontent.jpg',
                                checkpngImg: '',
                            };
                            businessBannerListA[i].businessSelectedImagesNew = data;
                        }
                    }
                }else{
                    var data = {
                        img : '/images/rightnxt_image_nocontent.jpg',
                        checkpngImg: '',
                    };
                    businessBannerListA[i].businessSelectedImagesNew = data;
                }
            }
        }
        return businessBannerListA;
        
    } else{
        businessBannerListB = _.uniq(businessBannerListB, function(p){ return p.businessLink; });
        console.log('businessBannerListB :',businessBannerListB);
        if(businessBannerListB){
            for(i=0;i<businessBannerListB.length;i++){
                for(j=0;j<searchResult.length;j++){
                    if(businessBannerListB[i].businessLink==searchResult[j].businessLink){
                    console.log('searchResult[j] ',searchResult[j]);
        console.log('businessBannerListB [j]:',businessBannerListB [j]);


                        var getBannnerImage = Business.findOne({"businessLink":businessBannerListB[i].businessLink});
                        if(getBannnerImage){
                            if(getBannnerImage.publishedImage){
                                businessBannerListB[i].businessSelectedImagesNew = searchPageShowImage(getBannnerImage.publishedImage);
                            } else{
                                if(getBannnerImage.businessImages){
                                    if(getBannnerImage.businessImages[0]){
                                        businessBannerListB[i].businessSelectedImagesNew = searchPageShowImage(getBannnerImage.businessImages[0].img);
                                    }else{
                                        var data = {
                                            img : '/images/rightnxt_image_nocontent.jpg',
                                            checkpngImg: '',
                                        };
                                        businessBannerListB[i].businessSelectedImagesNew = data;
                                    }
                                }else{
                                    var data = {
                                        img : '/images/rightnxt_image_nocontent.jpg',
                                        checkpngImg: '',
                                    };
                                    businessBannerListB[i].businessSelectedImagesNew = data;
                                }
                            }
                        }else{
                            var data = {
                                img : '/images/rightnxt_image_nocontent.jpg',
                                checkpngImg: '',
                            };
                            businessBannerListB[i].businessSelectedImagesNew = data;
                        }

                        businessBannerListB[i].businessAboutBus = searchResult[j].businessAboutBus;
                        console.log('businessBannerListB[i].businessAboutBus :',businessBannerListB[i].businessAboutBus);
                        break;
                    }
                }
            }
        }
        return businessBannerListB;
    }
});


function buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
        return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
}

