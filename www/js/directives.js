'use strict';

angular.module('headerDirective', [])
  .directive('headerInner', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'templates/parts/header.html',
      controller: ['$scope', '$location', function ($scope, $location) {
        $scope.$back = function() { 
          window.history.back();
        };
        $scope.route = function() {
          if ($location.path().split('/', 2)[1] === 'newsitem') {
            return 'news';
          } else if ($location.path().split('/', 2)[1] === 'service') {
            return 'service';
          } else if ($location.path().split('/', 2)[1] === 'product') {
            return 'products';
          } else if ($location.path().split('/', 2)[1] === 'document') {
            return 'document';
          } else {
            return $location.path();
          }
        }
        $scope.isShownHeader = function(path) {
          if (path === '/login' || path === '/offline') {
            return true;
          }
        }
        $scope.arrowHidden = function(path) {
          if (path === '/services' || path === '/products' || path === '/news' || path === '/profile' || path === '/survey' || path === '/smart') {
            return true;
          }
        }
        $scope.isTitle = function(path) {
          var title = '';
          switch(path) {
            case '/register':
              title = 'Регистрация';
              break;
            case '/register/phone':
            case '/register/confirm':
              title = 'Верификация';
              break;
            case '/register/welcome':
              title = 'Поздравляем!';
              break;
            case '/agreement':
              title = 'Лицензионное соглашение';
              break;
            case '/request':
              title = 'Заявка';
              break;
            case '/request/partner':
              title = 'Стать партнером';
              break;
            case '/request/sent':
              title = 'Спасибо за заявку';
              break;
            case '/profile':
            case '/profile/history':
            case '/profile/name':
            case '/profile/email':
            case '/profile/password':
            case '/profile/phone':
            case '/profile/numbers':
              title = 'Мой профиль';
              break;
            case '/profile/documents':
            case 'document':
              title = 'Мои документы';
              break;
            case '/profile/confirm':
              title = 'ПОДТВЕРДИТЕ НОВЫЙ НОМЕР';
              break;
            case '/services':
              title = 'Основные услуги';
              break;
            case 'service':
              title = 'услуги';
              break;
            case '/smart':
              title = 'Умный дом';
              break;
            case 'products':
            case '/products':
            case '/products/category':
            case '/products/order':
              title = 'Магазин';
              break;
            case '/survey':
              title = 'Опрос';
              break;
            case '/news':
            case 'news':
              title = 'Новости';
              break;
            case '/reset':
            case '/reset/confirm':
            case '/reset/change':
              title = 'Восстановление пароля';
              break;
          }
          return title;
        }
      }]
    }
  });

angular.module('footerDirective', [])
  .directive('footerInner', function () {
    return {
      restrict: 'E',
      // restrict: 'A', //This menas that it will be used as an attribute and NOT as an element.
      replace: true,
      transclude: true,
      templateUrl: 'templates/parts/footer.html',
      controller: 'FooterCtrl'
    }
  });

angular.module('radioButtonDirective', [])
  .directive('radioButton', function() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        ngModel: '=',
              ngModelText: '@ngModel',
        value: '@',
        ttt: '='
      },
      controller: ['$scope', function ($scope)
      {
          $scope.checked = function()
        {
          return $scope.value === $scope.model;
        };
      }],
      template: '<div class="checkbox-container">' +
                '<input type="radio" ng-model="ngModel" value="{{value}}" name="survey" id="survey{{value}}" ng-change="ttt">' +
                '<label for="survey{{value}}">{{label}}</label></div>',
      replace: true
    };
  });

angular.module('utils.autofocus', [])
  .directive('autoFocus', ['$timeout',  function($timeout) {
    return {
      restrict: 'A',
      link : function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
        });
      }
    }
  }]);
angular.module('resizeCont', [])
  .directive('resize', function ($window, $timeout) {
  return function (scope, element) {
    $timeout(function() {
      var w = angular.element($window),
          wH = w.height(),
          wW = w.width();
          
      scope.styleMain = function () {
        // alert($window.navigator.userAgent.indexOf('iPhone'));
        var ua = $window.navigator.userAgent,
            ios = ua.indexOf('iPhone') || ua.indexOf('iPod') || ua.indexOf('iPad'),
            wHM;
        wHM = (ios > 0) ? (wH - 20) : wH
        return {
          'min-height' : wHM
        }
      };
    }, 0)
  }
});
