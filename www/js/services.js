'use strict';



// var getMeta = angular.module('getMeta', ['ngResource']);

//   getMeta.service('GetMeta', ['$resource',
//     function() {
//       var saved_data = {};

//       var setData = function(metaArray) {
//         for (var i = 0, len = metaArray.length; i < len; i++) {
//           saved_data[metaArray[i].name] = metaArray[i].plainValue;
//         }
//       };
//       var _testData = function() {
//         if (!saved_data) {
//           var resource = $resource('http://1centr.com/api/v1/settings', {}, {
//             get: {
//               method: 'GET'
//             }
//           });
//           setData(resource);
//         }
//       };

//       var getData = function(key){
//           return saved_data[key];
//       };

//       var getAllData = function(){
//           return saved_data;
//       };
//       var resetData = function() {
//         saved_data = {};
//       };

//     return {
//       setData: setData,
//       getData: getData,
//       getAllData: getAllData,
//       resetData: resetData
//     };
//   ]});

var basePath = angular.module('basePath', []);

  basePath.constant('BasePath', {
    'domain' : 'http://village.fruitware.ru/',
    'api' : 'http://village.fruitware.ru/api/v1/'
  });

  // basePath.constant('BasePath', {
  //   'domain' : 'http://1centr.com/',
  //   'api' : 'http://1centr.com/api/v1/'
  // });

  // basePath.constant('BasePath', {
  //   'domain' : 'http://192.168.99.45/',
  //   'api' : 'http://192.168.99.45/api/v1/'
  // });

  // basePath
  //   .constant('domain', 'http://village.fruitware.ru/'),
  //   .constant('api', 'http://village.fruitware.ru/api/v1/');

var getMeta = angular.module('getMeta', []);

  getMeta.service('GetMeta',
    function() {
      var meta_data = {};

      var setData = function(metaArray) {
        for (var i = 0, len = metaArray.length; i < len; i++) {
          meta_data[metaArray[i].name] = metaArray[i].plainValue;
        }
      };

      var getData = function(key){
          return meta_data[key];
      };

      var getAllData = function(){
          return meta_data;
      };
      var resetData = function() {
        meta_data = {};
      };

    return {
      setData: setData,
      getData: getData,
      getAllData: getAllData,
      resetData: resetData
    };
  });

var registerCode = angular.module('registerCode', []);

  registerCode.service('TransferDataService',
    function() {
      var saved_data = {};

      var addData = function(key, data) {
        saved_data[key]=data;
      };

      var getData = function(key){
          return saved_data[key];
      };
      var resetData = function() {
        saved_data = {};
      };

    return {
      addData: addData,
      getData: getData,
      resetData: resetData
    };
  });


var tokenHandlerModule = angular.module('tokenHandlerModule', []);

  tokenHandlerModule.factory('TokenHandler', function() {
    var tokenHandler = {};
    var token = "none";

    tokenHandler.set = function( newToken ) {
      token = newToken;
    };

    tokenHandler.get = function() {
      return token;
    };

    // wrap given actions of a resource to send auth token with every
    // request
    tokenHandler.wrapActions = function( resource, actions ) {
      // copy original resource
      var wrappedResource = resource;
      for (var i=0; i < actions.length; i++) {
        tokenWrapper( wrappedResource, actions[i] );
      };
      // return modified copy of resource
      return wrappedResource;
    };

    // wraps resource action to send request with auth token
    var tokenWrapper = function( resource, action ) {
      // copy original action
      resource['_' + action]  = resource[action];
      // create new action wrapping the original and sending token
      resource[action] = function( data, success, error){
        return resource['_' + action](
          angular.extend({}, data || {}, {access_token: tokenHandler.get()}),
          success,
          error
        );
      };
    };

    return tokenHandler;
  });


// var users = angular.module('users', ['ngResource', 'tokenHandlerModule']);

// users.factory('Users', ['$resource', 'TokenHandler', 
//   function($resource, tokenHandler) {
//     return $resource('http://1centr.com/api/v1/:urlId/:routeId', {}, {
//       get: {
//         method: 'GET',
//         params: {urlId: '@urlId', routeId: '@routeId'},
//         headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
//       },
//       save: {
//         method: 'POST',
//         params: {urlId: '@urlId', routeId: '@routeId'},
//         headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
//       }
//     });
//   }]);


var users = angular.module('users', ['LocalStorageModule', 'ngResource']);

users.factory('Users', ['localStorageService', '$resource', 
  function(localStorageService, $resource) {
    return $resource('http://village.fruitware.ru/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') }
      }
    });
  }]);


// var orders = angular.module('orders', ['ngResource']);

// orders.factory('Orders', ['$resource',
//  function($resource){
//    return {
//      productsOrders: $resource('json/products/orders.json', {}, {
//        query: {
//           method:'GET', 
//           params:{}, 
//           isArray:false
//         } 
//      }),
//       servicesOrders: $resource('json/services/orders.json', {}, {
//        query: {
//           method:'GET', 
//           params:{}, 
//           isArray:false
//         }
//      })
//     };
//  }]);



var footerCustom = angular.module('footerCustom', ['ngResource']);

footerCustom.factory('FooterCustom', ['$resource',
  function($resource){
    return $resource('json/footer.json', {}, {
      query: {
        method:'GET', 
        params: {},
        isArray: true
      }
    });
  }]);

var notificationModule = angular.module('notificationModule', []);

notificationModule.factory("NotificationService", function () {
    return {
        alert: function (message, title, buttonText, buttonAction) {
            navigator.notification.alert(message,
                buttonAction,
                title,
                buttonText);
        }
    }
});


var onlineStatusApp = angular.module('onlineStatusApp', []);

onlineStatusApp.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    }

    $window.addEventListener("online", function () {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
        onlineStatus.onLine = false;
        $rootScope.$digest();
    }, true);

    return onlineStatus;
}]);

var notificationService = angular.module('NotificationServiceApp', []);

notificationService.factory("NotificationService", function () {
    return {
      alert: function (message) {
        navigator.notification.alert(
          message,
          null,
          'Консьерж',
          'OK'
        );
      }
    }
});

