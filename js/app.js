(function(){
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController',NarrowItDownController)
	.service('MenuSearchService',MenuSearchService)
	.constant('ApiBase','https://davids-restaurant.herokuapp.com/menu_items.json')
	.directive('foundItems',FoundItems);

	function FoundItems(){
		var ddo = {
			templateUrl: 'template.html' ,
			scope:{
				lista : '<',
				onRemove: '&'
			},
			   	controller: FoundItemsDirectiveController,
    			controllerAs: 'foundList',
    			bindToController: true
		};
		return ddo;
	}



	function FoundItemsDirectiveController(){
		var lista = this;
		lista.checkList = function(){
			if(lista.lista != undefined){
				return true;
			}else{
				return false;
			}
		};

		lista.checkEmpty = function(){
			if(lista.lista == undefined){
				//do nothing lista not defined 
			}else if(lista.lista.empty == true){
				return true;
			}else{
				return false;
			}
		};

		lista.noMatch = function(){
			if(lista.lista == undefined){
				//do nothing lista not defined 
			}else if(lista.lista.noMatch == true){
				return true;
			}else{
				return false;
			}
		};
	}

		NarrowItDownController.$inject = ['MenuSearchService'];
		function NarrowItDownController (MenuSearchService){
			var menuData = this;
			menuData.searchValue = "";

			menuData.buttonClick = function(){
			
			var promise = MenuSearchService.getMatchedMenuItems(menuData.searchValue);
			
			promise.then(function(response){
				if(menuData.searchValue == ""){
					menuData.found = [];
					menuData.found.empty = true;
				}else{
					menuData.found = response;
					if(menuData.searchValue != "" && menuData.found.length == 0){
					menuData.found.noMatch = true;
					menuData.found.empty = false;
					}
				}

			})
			.catch(function(error){
				console.log('Something went wrong');
			});
			}

			menuData.deleteItem = function(itemIndex){
				menuData.found.splice(itemIndex,1);
			};
		}

	MenuSearchService.$inject = ['$http','ApiBase'];
		function MenuSearchService($http,ApiBase){
			var service = this;
			service.getMatchedMenuItems = function(searchTerm){
				return $http({
					method: 'GET',
					url: ApiBase})
				.then(function(response){
					var menuItems = response.data.menu_items;
					var itemsFound =[] ;
					for(var i=0 ; i<menuItems.length ; i++){
						var currentItem = menuItems[i].description;
						if(currentItem.indexOf(searchTerm) !== -1){
							itemsFound.push(menuItems[i]);
						} 	
					}
					return itemsFound;
				})
				.catch(function(error){
					console.log('Something went wrong');
				});	
			};
		}

})();