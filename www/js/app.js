'use strict';

// Declare villageApp level module which depends on views, and components

var villageApp = angular.module('villageApp', [
  'ngRoute',
  'ngCordova',
  'ui.router',
  'route-segment',
  'view-segment',
  'basePath',
  'getMeta',
  'onlineStatusApp',
  'registerCode',
  'users',
  'ngSanitize',
  'notificationModule',
  'LocalStorageModule',
  'tokenHandlerModule',
  'headerDirective',
  'footerDirective',
  'utils.autofocus',
  'ngDropdowns',
  'NotificationServiceApp',
  'radioButtonDirective',
  'resizeCont',
  'tagged.directives.infiniteScroll',
  'infinite-scroll',
  'footerCustom',
  'villageAppControllers'
]);


villageApp
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('village');
  }])

  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/news', {
          templateUrl: 'templates/news/news-list.html'
        }).
        when('/newsitem/:articleId', {
          templateUrl: 'templates/news/news.html'
        }).
        when('/services', {
          templateUrl: 'templates/services/services-main.html'
        }).
        when('/service/category/:categoryId', {
          templateUrl: 'templates/services/services-category.html'
        }).
        when('/service/search/:searchId', {
          templateUrl: 'templates/services/services-category.html'
        }).
        when('/service/:serviceId', {
          templateUrl: 'templates/services/service-order.html'
        }).
        when('/service/order/:serviceId', {
          templateUrl: 'templates/services/service-order.html'
        }).
        when('/products', {
          templateUrl: 'templates/products/products-main.html'
        }).
        when('/product/category/:categoryId', {
          templateUrl: 'templates/products/products-category.html'
        }).
        when('/product/search/:searchId', {
          templateUrl: 'templates/products/products-category.html'
        }).
        when('/product', {
          templateUrl: 'templates/products/products-all.html'
        }).
        when('/product/:productId', {
          templateUrl: 'templates/products/product-order.html'
        }).
        when('/product/order/:productId', {
          templateUrl: 'templates/products/product-order.html'
        }).
        when('/profile', {
          templateUrl: 'templates/profile/profile.html'
        }).
        when('/profile/history', {
          templateUrl: 'templates/profile/profile-history.html'
        }).
        when('/profile/name', {
          templateUrl: 'templates/profile/profile-name.html'
        }).
        when('/profile/email', {
          templateUrl: 'templates/profile/profile-email.html'
        }).
        when('/profile/phone', {
          templateUrl: 'templates/profile/profile-phone.html'
        }).
        when('/profile/confirm', {
          templateUrl: 'templates/profile/profile-confirm.html'
        }).
        when('/profile/password', {
          templateUrl: 'templates/profile/profile-password.html'
        }).
        when('/profile/numbers', {
          templateUrl: 'templates/profile/profile-numbers.html'
        }).
        when('/profile/documents', {
          templateUrl: 'templates/profile/profile-documents.html'
        }).
        when('/document/:docId', {
          templateUrl: 'templates/profile/profile-document.html'
        }).
        when('/survey', {
          templateUrl: 'templates/surveys/survey.html'
        }).
        when('/login', {
          templateUrl: 'templates/login/login.html'
        }).
        when('/agreement', {
          templateUrl: 'templates/login/register/agreement.html'
        }).
        when('/reset', {
          templateUrl: 'templates/login/reset/forgot.html'
        }).
        when('/reset/confirm', {
          templateUrl: 'templates/login/reset/forgot-confirm.html'
        }).
        when('/reset/change', {
          templateUrl: 'templates/login/reset/forgot-change.html'
        }).
        when('/request', {
          templateUrl: 'templates/login/request/request.html'
        }).
        when('/request/partner', {
          templateUrl: 'templates/login/request/request-partner.html'
        }).
        when('/request/sent', {
          templateUrl: 'templates/login/request/request-sent.html'
        }).
        when('/register', {
          templateUrl: 'templates/login/register/register.html'
        }).
        when('/register/phone', {
          templateUrl: 'templates/login/register/register-phone.html'
        }).
        when('/register/confirm', {
          templateUrl: 'templates/login/register/register-confirm.html'
        }).
        when('/register/welcome', {
          templateUrl: 'templates/login/register/welcome.html'
        }).
        when('/smart', {
          templateUrl: 'templates/smart/smart.html'
        }).
        otherwise({
          redirectTo: '/services'
        });
    }]);

window.stripScript = function (a) {return a.replace(/<script[^>]*>.*?<\/script>/gi,'')}