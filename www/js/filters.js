'use strict';

angular.module('servicesFilters', []).filter('serviceFilter', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});


