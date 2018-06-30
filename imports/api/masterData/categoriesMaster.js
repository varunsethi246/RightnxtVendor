import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const Categories = new Mongo.Collection('categories');

if (Meteor.isServer) {
	Meteor.publish('categories', function categories() {
		return Categories.find({});
	});
	Meteor.publish('categoriesListSearch', function() {
		return Categories.find({},{fields:{"level0":1,"level1":1,"level2":1,"level3":1,"level4":1,"tags":1}});
	});
}

Meteor.methods({
	'insertCategoriesBlank':function(formValues){
			Categories.insert({ 
				"categoryIndex"			: formValues.categoryIndex,
				"level0" 				: formValues.level0,
				"level1" 				: formValues.level1,
				"level2" 				: formValues.level2,
				"level3"				: formValues.level3,
				"level4"				: formValues.level4,		
				"tags"					: formValues.tags,
				"menuStatus"			: "Disable",		
			},function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			});		
		
	},
	'updateBusinessCategories':function(recId,formValues){
		Categories.update({'_id':recId},
			{$set:{
				"level0" 				: formValues.level0,
				"level1" 				: formValues.level1,
				"level2" 				: formValues.level2,
				"level3"				: formValues.level3,
				"level4"				: formValues.level4,		
				"tags"					: formValues.tags,	
			}
		});
	},
	'updateCategoriesMultipleTags':function(recId,formValues){
		Categories.update({'_id':recId},
			{$set:{
				"level0"				: formValues.level0Name,
				"level1"	 			: formValues.level1Name,
				"level1Tags" 			: formValues.level1Tags,
				"level2"	  			: formValues.level2Name,
				"level2Tags"  			: formValues.level2Tags,
				"level3"	 			: formValues.level3Name,
				"level3Tags" 			: formValues.level3Tags,
				"level4"	 			: formValues.level4Name,		
				"level4Tags" 			: formValues.level4Tags,		
				"tags"					: formValues.allTags,		
			}
		});
	},

	// 'insertCategories':function(formValues){
	// 	var maxRecObj = Categories.findOne({},{sort:{categoryIndex: -1,limit:1}});

	// 	if(maxRecObj){
	// 		var newCategoryIndex = maxRecObj.categoryIndex + 100;

	// 		Categories.insert({ 
	// 			"categoryIndex"			: newCategoryIndex,
	// 			"level0"				: formValues.level0,
	// 			"level1" 				: formValues.level1,
	// 			"level2" 				: formValues.level2,
	// 			"level3"				: formValues.level3,
	// 			"level4"				: formValues.level4,		
	// 			"tags"					: formValues.tags,		
	// 		},function(error,result){
	// 			if(error){
	// 				console.log(error);
	// 				return error;
	// 			}
	// 			if(result){
	// 				return result;
	// 			}
	// 		});		
	// 	}

	// 	if(!maxRecObj){
			
	// 		var newCategoryIndex = 100;	
			
	// 		Categories.insert({ 
	// 			"categoryIndex"			: newCategoryIndex,
	// 			"level0"				: formValues.level0,
	// 			"level1" 				: formValues.level1,
	// 			"level2" 				: formValues.level2,
	// 			"level3"				: formValues.level3,
	// 			"level4"				: formValues.level4,		
	// 			"tags"					: formValues.tags,		
	// 		},function(error,result){
	// 			if(error){
	// 				console.log(error.reason);
	// 				return error;
	// 			}
	// 			if(result){
	// 				return result;
	// 			}
	// 		});		
	// 	}
	// },

	'insertCategoriesMultipleTags':function(formValues){
		var maxRecObj = Categories.findOne({},{sort:{categoryIndex: -1,limit:1}});

		if(maxRecObj){
			var newCategoryIndex = maxRecObj.categoryIndex + 100;

			Categories.insert({ 
				"categoryIndex"			: newCategoryIndex,
				"level0"				: formValues.level0Name,
				"level1" 				: formValues.level1Name,
				"level1Tags" 			: formValues.level1Tags,
				"level2"  				: formValues.level2Name,
				"level2Tags"  			: formValues.level2Tags,
				"level3" 				: formValues.level3Name,
				"level3Tags" 			: formValues.level3Tags,
				"level4" 				: formValues.level4Name,		
				"level4Tags" 			: formValues.level4Tags,		
				"tags"					: formValues.allTags,	
				"menuStatus"			: "Disable",		
					
			},function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			});		
		}

		if(!maxRecObj){
			
			var newCategoryIndex = 100;	
			
			Categories.insert({ 
				"categoryIndex"			: newCategoryIndex,
				"level0"				: formValues.level0Name,
				"level1"	 			: formValues.level1Name,
				"level1Tags" 			: formValues.level1Tags,
				"level2"	  			: formValues.level2Name,
				"level2Tags"  			: formValues.level2Tags,
				"level3"	 			: formValues.level3Name,
				"level3Tags" 			: formValues.level3Tags,
				"level4"	 			: formValues.level4Name,		
				"level4Tags" 			: formValues.level4Tags,		
				"tags"				: formValues.allTags,		
			},function(error,result){
				if(error){
					console.log(error.reason);
					return error;
				}
				if(result){
					return result;
				}
			});		
		}
	},

	'removecategories' : function(id){
		
		Categories.remove(id);
	},

	CSVUpload( data ){
		check( data, Array);
		
		var categoryIndexSrno = 1;
	
		for ( let i = 0; i < data.length - 1; i++ ) {
			var catgMgmt = data[i];
			
			var level0Name    = catgMgmt["Level 0"];
			
			var level1Name	  = catgMgmt["Level 1"];
			if(!level1Name) {level1Name='--';}
			var level1Tags	  = catgMgmt["Level 1 Tags"];
			if(!level1Tags) {level1Tags='--';}
			
			var level2Name	  = catgMgmt["Level 2"];
			if(!level2Name) {level2Name='--';}
			var level2Tags	  = catgMgmt["Level 2 Tags"];
			if(!level2Tags) {level2Tags='--';}

			var level3Name	  = catgMgmt["Level 3"];
			if(!level3Name) {level3Name='--';}
			var level3Tags	  = catgMgmt["Level 3 Tags"];
			if(!level3Tags) {level3Tags='--';}

			var level4Name	  = catgMgmt["Level 4"];
			if(!level4Name) {level4Name='--';}
			var level4Tags	  = catgMgmt["Level 4 Tags"];
			if(!level4Tags) {level4Tags='--';}
			
			

			var dataCollection = Categories.findOne({"level4":level4Name,
										"level3":level3Name,
										"level2":level2Name,
										"level1":level1Name,
										"level0":level0Name});
			// console.log('dataCollection' , dataCollection);
			var allTags = level1Tags + ',' + level2Tags + ','+ level3Tags + ',' + level4Tags;

			if(dataCollection){
				
			}else{
				
				Categories.insert({ 
					"categoryIndex"			: categoryIndexSrno,
					"level0"				: level0Name,
					"level1"	 			: level1Name,
					"level1Tags" 			: level1Tags,
					"level2"	  			: level2Name,
					"level2Tags"  			: level2Tags,
					"level3"	 			: level3Name,
					"level3Tags" 			: level3Tags,
					"level4"	 			: level4Name,		
					"level4Tags" 			: level4Tags,		
					"tags"					: allTags,
					"menuStatus"			: "Disable",		
				},function(error,result){
					if(error){
						console.log(error);
						return error;
					}
					if(result){
						return result;
					}
				}); 			
				categoryIndexSrno++;
			}
		} //end of i loop
	}, //End of CSVUpload category

	'removeCategoriestags':function (id,tag) {	
		var formedName = "tags."+tag;
		Categories.update(
			{_id:id},
			{$unset: { [formedName]: 1}}, 
			function(error,result){
				if(error){
					console.log('unset : ',error);
					// return error;
				}else{
					
				}
			}
		);
		Categories.update(
			{_id:id},
			{$pull: {"tags" : null}}, 
			function(error,result){
				if(error){
					console.log('pull : ',error);
					// return error;
				}else{
					
				}
			}
		);
	},
	'removeCategoryMenuStatus':function (id,menuStatus) {	
		
		Categories.update(
			{_id:id},
			{$set: { 
						menuStatus : menuStatus,
					}
			}, 
			function(error,result){
				if(error){
					// return error;
				}else{
					
				}
			}
		);
		
	},

});