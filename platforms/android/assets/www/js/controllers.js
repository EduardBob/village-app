'use strict';

var villageAppControllers = angular.module('villageAppControllers', []);


villageAppControllers.controller('InviteCodeCtrl', ['$scope', '$resource', '$location', 'TransferDataService',
  function($scope, $resource, $location, TransferDataService) {
    var building = $resource('http://village.fruitware.ru/api/v1/buildings/:buildingCode', {buildingCode: '@buildingCode'});
    $scope.updateCode = function(code) {
      building.get({buildingCode: code}, function(data) {
        $location.path('/register/phone');
        $scope.address = data.data.address;
        $scope.building_id = data.data.id;
        TransferDataService.addData('address', data.data.address);
        TransferDataService.addData('building_id', data.data.id);
      }, function(response) {
        if (response.status === 404 || response.status === 400) {
          alert('Неверный инвайт-код');
        } else if (response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);


villageAppControllers.controller('PhoneCheckCtrl', ['$scope', '$resource', '$location', 'TransferDataService',
  function($scope, $resource, $location, TransferDataService) {
    $scope.addressVillage = TransferDataService.getData('address');
    $scope.buildingId = TransferDataService.getData('building_id');
    var users = $resource('http://village.fruitware.ru/api/v1/users', {});
    $scope.checkPhone = function(phone) {
      users.save({'phone' : phone, 'building_id' : $scope.buildingId}, function(data) {
        $location.path('/register/confirm');
        TransferDataService.addData('phone', phone);
        TransferDataService.addData('session', data.data.session);
        TransferDataService.addData('code', data.data.code);
      }, function(response) {
        if (response.status === 400) {
          alert(response.data.error.message.phone);
        } else if (response.status === 403) {
          if (response.data.error.message === "user_exist") {
            alert('Пользователь с таким номером уже существует');
            $location.path('/login');
          }
        } else if (response.status === 404 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);

villageAppControllers.controller('SmsCheckCtrl', ['$scope', '$resource', '$location', 'TransferDataService',
  function($scope, $resource, $location, TransferDataService) {
    $scope.phone = TransferDataService.getData('phone');
    $scope.session = TransferDataService.getData('session');
    var users = $resource('http://village.fruitware.ru/api/v1/tokens/check', {});
    $scope.code = TransferDataService.getData('code');
    $scope.checkCode = function(code) {
      users.save({'code' : $scope.code, 'session' : $scope.session, 'type' : 'registration'}, function(data) {
        $location.path('/register/welcome');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert(response.data.error.message.code);
        } else if (response.status === 404) {
          alert('Неправильный код');
        } else if (response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);

villageAppControllers.controller('ProfileDataCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'TokenHandler',
  function($scope, $resource, $location, TransferDataService, tokenHandler) {
    $scope.code = TransferDataService.getData('code');
    $scope.session = TransferDataService.getData('session');
    var users = $resource('http://village.fruitware.ru/api/v1/users/confirm', {});
    $scope.submitData = function(first_name, last_name, password, password_confirmation) {
      users.save({'code' : $scope.code, 'session' : $scope.session, 'first_name' : first_name, 'last_name' : last_name, 'password' : password, 'password_confirmation' : password_confirmation}, function(data) {
        $location.path('/profile');
        TransferDataService.addData('first_name', first_name);
        TransferDataService.addData('last_name', last_name);
        TransferDataService.addData('password', password);
        TransferDataService.addData('password_confirmation', password_confirmation);
        tokenHandler.set(data.data.token);
        TransferDataService.addData('token', data.data.token);
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          var messages = [];
          var message = messages.concat(response.data.error.message.first_name, response.data.error.message.last_name, response.data.error.message.password);
          alert(message.join("\r\n"));
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          // alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);


villageAppControllers.controller('ProfileCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'TokenHandler',
  function($scope, $resource, $location, TransferDataService, tokenHandler) {
     var user = $resource('http://village.fruitware.ru/api/v1/me', {}, {
      get: {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    user.get(function(data) {
      $scope.first_name = data.data.first_name;
      $scope.last_name = data.data.last_name;
      $scope.phone = data.data.phone;
      $scope.address = data.data.building.data.address;
      TransferDataService.addData('first_name', data.data.first_name);
      TransferDataService.addData('last_name', data.data.last_name);
      TransferDataService.addData('phone', data.data.phone);
      TransferDataService.addData('address', data.data.building.data.address);
    }, function(response) {
      console.log(response);
      if (response.status === 400) {
        alert(response.data.error.message.join("\r\n"));
      } else if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Повторите попытку или обратитесь в техподдержку');
      }
    });
    $scope.userLogout = function() {
      TransferDataService.resetData();
      tokenHandler.set("none");
      $location.path('/login');
    };
  }]);

villageAppControllers.controller('ProfileChangeDataCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler',
  function($scope, $resource, $location, Users, TransferDataService, tokenHandler) {
    $scope.first_name = TransferDataService.getData('first_name');
    $scope.last_name = TransferDataService.getData('last_name');
    $scope.phone = TransferDataService.getData('phone');
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    $scope.changeName = function(first_name, last_name) {
      user.save({urlId: 'me', routeId: 'name'}, {'first_name' : first_name, 'last_name' : last_name}, function(data) {
        $scope.nameSuccess = 'Данные успешно изменены';
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          $scope.nameSuccess = false;
          var messages = [];
          var message = messages.concat(response.data.error.message.first_name, response.data.error.message.last_name);
          alert(message.join("\r\n"));
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
    $scope.changePass = function(password, new_password, new_password_confirmation) {
      user.save({urlId: 'me', routeId: 'password'}, {'password' : password, 'new_password' : new_password, 'new_password_confirmation' : new_password_confirmation}, function(data) {
        $scope.nameSuccess = 'Данные успешно изменены';
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          $scope.nameSuccess = false;
          var messages = [];
          var message = messages.concat(response.data.error.message.error, response.data.error.message.new_password, response.data.error.message.password);
          alert(message.join("\r\n"));
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
    $scope.changePhone = function(new_phone) {
      user.save({urlId: 'tokens'}, {'type' : 'change_phone', 'phone' : $scope.phone, 'new_phone' : new_phone}, function(data) {
        TransferDataService.addData('phone', new_phone);
        TransferDataService.addData('session', data.data.session);
        TransferDataService.addData('code', data.data.code);
        $location.path('/profile/confirm');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert(response.data.error.message.new_phone);
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
    $scope.code = TransferDataService.getData('code');
    $scope.checkCode = function(code) {
      $scope.session = TransferDataService.getData('session');
      user.save({urlId: 'tokens', routeId: 'check'}, {'type': 'change_phone', 'session': $scope.session, 'code': code}, function(data) {
        TransferDataService.addData('code', code);
      }, function(response) {
        console.log(response);
      });
      user.save({urlId: 'me', routeId: 'phone'}, {'session': $scope.session, 'code': $scope.code}, function(data) {
        $location.path('/profile');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert(response.data.error.message.code);
        } else if (response.status === 404) {
          alert('Неправильный код');
        } else if (response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);


villageAppControllers.controller('AuthCtrl', ['$scope', '$resource', '$location', 'GetMeta', 'Users', 'TransferDataService', 'TokenHandler',
  function($scope, $resource, $location, GetMeta, Users, TransferDataService, tokenHandler) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    user.get({urlId: 'settings'}, {}, function(data) {
      GetMeta.setData(data.data);
      $scope.siteName = GetMeta.getData('core::site-name');
    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Повторите попытку или обратитесь в техподдержку');
      }
    });

    $scope.login = function(phone, password) {
      TransferDataService.addData('phone', phone);
      user.save({urlId: 'auth', routeId: 'token'}, {'phone': phone, 'password': password}, function(data) {
        TransferDataService.addData('phone', phone);
        tokenHandler.set(data.data.token);
        $location.path('/services');
      }, function(response) {
        console.log(response);
        if (response.status === 401 || response.status === 400) {
          alert('Неверный телефон или пароль');
        } else if (response.status === 403) {
          alert('Вы должны зарегистрироваться');
          $location.path('/register');
        } else if (response.status === 404 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);

villageAppControllers.controller('ResetCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler',
  function($scope, $resource, $location, Users, TransferDataService, tokenHandler) {
    $scope.phone = TransferDataService.getData('phone');
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    $scope.checkPhone = function(phone) {
      user.save({urlId: 'tokens'}, {'type' : 'reset_password', 'phone' : phone}, function(data) {
        TransferDataService.addData('phone', phone);
        TransferDataService.addData('session', data.data.session);
        TransferDataService.addData('code', data.data.code);
        $location.path('/reset/confirm');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert(response.data.error.message.phone);
        } else if (response.status === 403) {
          alert('Ваш номер не был активирован. Пожалуйста, активируйте его')
          $scope.phone = TransferDataService.getData('phone');
          $location.path('/register');
        } else if (response.status === 404 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
    $scope.session = TransferDataService.getData('session');
    $scope.checkCode = function(code) {
      user.save({urlId: 'tokens', routeId: 'check'}, {'type': 'reset_password', 'session': $scope.session, 'code': code}, function(data) {
        TransferDataService.addData('code', code);
        $location.path('/reset/change');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert(response.data.error.message.code);
        } else if (response.status === 404) {
          alert('Неверный код');
        } else if (response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
    $scope.code = TransferDataService.getData('code');
    $scope.changePassword = function(password, password_confirmation) {
      user.save({urlId: 'users', routeId: 'reset'}, {'session': $scope.session, 'code': $scope.code, 'password': password, 'password_confirmation' : password_confirmation}, function(data) {
        TransferDataService.addData('password', password);
        tokenHandler.set(data.data.token);
        $location.path('/login');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          $scope.nameSuccess = false;
          var messages = [];
          var message = messages.concat(response.data.error.message.error, response.data.error.message.new_password, response.data.error.message.password);
          alert(message.join("\r\n"));
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);

villageAppControllers.controller('NewsListCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    $scope.page = 0;
    $scope.newsBlocks = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function() {
      $scope.page++;
      $scope.fetching = true;
      user.get({urlId: 'articles', page: $scope.page}, {}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function (news) {
          news.created_at = Date.parse(news.created_at);
        });
        angular.forEach(data.data, function(news) {
          if (news.image != null) {
            news.image = news.image.formats.bigThumb;
          } else {
            news.imagePresent = true;
          }
        });
        $scope.newsBlocks = $scope.newsBlocks.concat(data.data);
        $scope.basePath = BasePath.domain;
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    };
  }]);

// villageAppControllers.controller('NewsListCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler',
//   function($scope, $resource, $location, Users, TransferDataService, tokenHandler) {
//     var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
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
//     user.get({urlId: 'articles', page: '1'}, {}, function(data) {
//       if (!data.data.length ) {
//         $scope.emptyService = "На данный момент новостей нет";
//       } else {
//         $scope.newsBlocks = data.data;
//         $scope.addMoreItems = function(){
//           $scope.first = '5';
//           if($scope.first < $scope.newsBlocks.length){
//              $scope.first = $scope.first + 5;
//           }
//        };
//       }
//     }, function(response) {
//       console.log(response);
//       if (response.status === 404 || response.status === 403 || response.status === 500) {
//         alert('Повторите попытку или обратитесь в техподдержку');
//       }
//     });
//   }]);

villageAppControllers.controller('NewsDetailCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    $scope.articleData = user.get({urlId: 'articles', routeId: $routeParams.articleId}, function(data) {
      $scope.article = data.data;
      $scope.article.created_at = Date.parse($scope.article.created_at);
      if (data.data.image != null) {
        $scope.articleImage = data.data.image.formats.bigThumb;
      } else {
        $scope.imagePresentMain = true;
      }
      $scope.basePath = BasePath.domain;
    });
  }]);

villageAppControllers.controller('ServicesCategoriesCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/services/categories', {}, {
      get: {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    user.get({}, function(data) {
      $scope.serviceBlocks = data.data;
      angular.forEach($scope.serviceBlocks, function(service) {
        if (service.image != null) {
          service.image = service.image.formats.mediumThumb;
        } else {
          service.imagePresent = true;
        }
      })
      $scope.basePath = BasePath.domain;
    }, function(response) {
      console.log(response);
    });
  }]);

villageAppControllers.controller('ServicesCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });

    $scope.page = 0;
    $scope.serviceList = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function() {
      $scope.page++;
      $scope.fetching = true;
      $scope.categoryData = user.get({urlId: 'services', category_id: $routeParams.categoryId, page: $scope.page}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function (service) {
          if (service.image != null) {
            service.image = service.image.formats.smallThumb;
          } else {
            service.imagePresent = true;
          }
        });
        $scope.categoryMain = data.data[0].category.data;
        if (data.data[0].category.data.image != null) {
          $scope.mainImage = data.data[0].category.data.image.formats.smallThumb;
        } else {
          $scope.imagePresentMain = true;
        }
        $scope.serviceList = $scope.serviceList.concat(data.data);
        $scope.basePath = BasePath.domain;
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    };
  }]);


villageAppControllers.controller('ServiceOrderCtrl', ['$scope', '$resource', '$location', 'Users', 'GetMeta', '$routeParams', '$filter', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, GetMeta, $routeParams, $filter, TransferDataService, tokenHandler, BasePath) {
    $scope.servicePaymentInfo = GetMeta.getData('village::service-payment-info');
    $scope.serviceBottomText = GetMeta.getData('village::service-bottom-text');
    TransferDataService.addData('serviceDate', '');
    TransferDataService.addData('serviceTime', '');
    TransferDataService.addData('service_perform_at', '');
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    user.get({urlId: 'services', routeId: $routeParams.serviceId}, {}, function(data) {
      $scope.serviceData = data.data;
      if (data.data.image != null) {
        $scope.serviceImage = data.data.image.formats.mediumThumb;
      } else {
        $scope.imagePresentMain = true;
      }
      $scope.basePath = BasePath.domain; 
    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Повторите попытку или обратитесь в техподдержку');
      }
    });
    $scope.$watchGroup(['date', 'time'], function() {
      if (typeof TransferDataService.getData('serviceDate') != 'undefined' && typeof TransferDataService.getData('serviceTime') != 'undefined') {
        TransferDataService.addData('service_perform_at', TransferDataService.getData('serviceDate') + ' ' + TransferDataService.getData('serviceTime'));
      }
    });
    $scope.changeDate = function() {
      $scope.changedDate = true;
      $scope.dateNew = $filter('date')($scope.date, 'yyyy-MM-dd');
      TransferDataService.addData('serviceDate', $scope.dateNew);
    };
    $scope.changeTime = function() {
      $scope.changedTime = true;
      $scope.hh1 = new Date($scope.time).getHours();
      $scope.mm1 = new Date($scope.time).getMinutes();
      $scope.hh = ($scope.hh1 < 10 ? '0' : '') + $scope.hh1;
      $scope.mm = ($scope.mm1 < 10 ? '0' : '') + $scope.mm1;
      $scope.timeNew = $scope.hh + ':' + $scope.mm;
      TransferDataService.addData('serviceTime', $scope.timeNew);
    };
    $scope.sendData = function($event, comment) {
      $scope.perform_at = TransferDataService.getData('service_perform_at');
      $scope.service_id = $routeParams.serviceId;
      user.save({urlId: 'services', routeId: 'orders'}, {'perform_at': $scope.perform_at, 'comment': comment, 'service_id': $scope.service_id}, function(data) {
        $scope.orderMessage = true;
        $($event.target).css('display','none');
        $scope.textHide = true;
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert('Введите дату и время заказа');
          // var messages = [];
          // var message = messages.concat(response.data.error.message.comment, response.data.error.message.perform_at, response.data.error.message.quantity);
          // alert(message.join("\r\n"));
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);

villageAppControllers.controller('ProductsCategoriesCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    user.get({urlId: 'products', routeId: 'categories'}, {}, function(data) {
      if (!data.data.length ) {
        $scope.emptyService = "На данный момент товаров нет";
      } else {
        $scope.categoriesBlocks = data.data;
        angular.forEach($scope.categoriesBlocks, function(category) {
          if (category.image != null) {
            category.image = category.image.formats.smallThumb;
          } else {
            category.imagePresent = true;
          }
        })
        $scope.basePath = BasePath.domain;
      }
    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Повторите попытку или обратитесь в техподдержку');
      }
    });
  }]);

villageAppControllers.controller('ProductsAllCtrl', ['$scope', '$resource', '$location', 'Users', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    $scope.page = 0;
    $scope.productsAll = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function() {
      $scope.page++;
      $scope.fetching = true;
      user.get({urlId: 'products', page: $scope.page}, {}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function (product) {
          product.price = parseFloat(product.price);
        });
        $scope.productsAll = $scope.productsAll.concat(data.data);
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    };
  }]);

villageAppControllers.controller('ProductsCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });

    $scope.page = 0;
    $scope.productList = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function() {
      $scope.page++;
      $scope.fetching = true;
      $scope.articleData = user.get({urlId: 'products', category_id: $routeParams.categoryId, page: $scope.page}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function (product, image) {
          product.price = parseFloat(product.price);
          if (product.image != null) {
            product.image = product.image.formats.smallThumb;
          } else {
            product.imagePresent = true;
          }
        });
        $scope.productList = $scope.productList.concat(data.data);
        $scope.categoryMain = data.data[0].category.data;
        if (data.data[0].category.data.image != null) {
          $scope.mainImage = data.data[0].category.data.image.formats.smallThumb;
        } else {
          $scope.imagePresentMain = true;
        }
        $scope.basePath = BasePath.domain;
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    };
  }]);

villageAppControllers.controller('ProductOrderCtrl', ['$scope', '$resource', '$location', 'Users', 'GetMeta', '$routeParams', 'TransferDataService', 'TokenHandler', '$filter', 'BasePath',
  function($scope, $resource, $location, Users, GetMeta, $routeParams, TransferDataService, tokenHandler, $filter, BasePath) {
    $scope.shopName = GetMeta.getData('village::shop-name');
    $scope.shopAddress = GetMeta.getData('village::shop-address');
    $scope.productPaymentInfo = GetMeta.getData('village::product-payment-info');
    $scope.productBottomText = GetMeta.getData('village::product-bottom-text');
    TransferDataService.addData('unit_title', '');
    TransferDataService.addData('productDate', '');
    TransferDataService.addData('productTime', '');
    TransferDataService.addData('product_perform_at', '');
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get() }
      }
    });
    user.get({urlId: 'products', routeId: $routeParams.productId}, {}, function(data) {
      $scope.productData = data.data;
      if (data.data.image != null) {
        $scope.productImage = data.data.image.formats.mediumThumb;
      } else {
        $scope.imagePresentMain = true;
      }
      $scope.basePath = BasePath.domain;
      // $scope.productData = $filter('filter')(data.data, {id: $routeParams.productId})[0];
      TransferDataService.addData('unit_title', $scope.productData.unit_title);
      $scope.productUnit = TransferDataService.getData('unit_title');
      $scope.unit_step = GetMeta.getData('village::product-unit-step-' + $scope.productUnit);
      $scope.quantity = $scope.unit_step;
      $scope.changePlus = function() {
        $scope.quantity = ($scope.quantity*1) + ($scope.unit_step*1);
      }
      $scope.changeMinus = function() {
        if ($scope.quantity > $scope.unit_step) {
          $scope.quantity = $scope.quantity - $scope.unit_step;
        }
      }
    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Повторите попытку или обратитесь в техподдержку');
      }
    });
    $scope.$watchGroup(['date', 'time'], function() {
      if (typeof TransferDataService.getData('productDate') != 'undefined' && typeof TransferDataService.getData('productTime') != 'undefined') {
        TransferDataService.addData('product_perform_at', TransferDataService.getData('productDate') + ' ' + TransferDataService.getData('productTime'));
      }
    });
    $scope.changeDate = function() {
      $scope.changedDate = true;
      $scope.dateNew = $filter('date')($scope.date, 'yyyy-MM-dd');
      TransferDataService.addData('productDate', $scope.dateNew);
    };
    $scope.changeTime = function() {
      $scope.changedTime = true;
      $scope.hh1 = new Date($scope.time).getHours();
      $scope.mm1 = new Date($scope.time).getMinutes();
      $scope.hh = ($scope.hh1 < 10 ? '0' : '') + $scope.hh1;
      $scope.mm = ($scope.mm1 < 10 ? '0' : '') + $scope.mm1;
      $scope.timeNew = $scope.hh + ':' + $scope.mm;
      TransferDataService.addData('productTime', $scope.timeNew);
    };
    $scope.sendData = function($event, quantity, comment) {
      $scope.perform_at = TransferDataService.getData('product_perform_at');
      $scope.product_id = $routeParams.productId;
      console.log($scope.service_id);
      user.save({urlId: 'products', routeId: 'orders'}, {'quantity': quantity, 'perform_at': $scope.perform_at, 'comment': comment, 'product_id': $scope.product_id}, function(data) {
        $scope.orderMessage = true;
        $($event.target).css('display','none');
        $scope.textHide = true;
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert('Введите дату и время заказа');
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    }
  }]);


// villageAppControllers.controller('OrdersCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 
//   function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler) {
//     var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
//       get: {
//         method: 'GET',
//         params: {urlId: '@urlId', routeId: '@routeId'},
//         headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
//       },
//       save: {
//         method: 'POST',
//         params: {urlId: '@urlId', routeId: '@routeId'},
//         headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
//       }
//     });
//     $scope.pageServices = 0;
//     $scope.pageProducts = 0;
//     $scope.services = [];
//     $scope.products = [];
//     $scope.fetching = false;

//     // Fetch more items
//     $scope.getMoreServices = function() {
//       $scope.page++;
//       $scope.fetching = true;
//       user.get({urlId: 'services', routeId: 'orders', page: $scope.pageServices}, {}, function(data) {
//         $scope.fetching = false;
//         $scope.services = $scope.services.concat(data.data);
//       }, function(response) {
//         console.log(response);
//         if (response.status === 404 || response.status === 403 || response.status === 500) {
//           alert('Повторите попытку или обратитесь в техподдержку');
//         }
//       });
//     };
//     $scope.getMoreProducts = function() {
//       $scope.page++;
//       $scope.fetching = true;
//       user.get({urlId: 'products', routeId: 'orders', page: $scope.pageProducts}, {}, function(data) {
//         $scope.fetching = false;
//         $scope.products = $scope.products.concat(data.data);
//       }, function(response) {
//         console.log(response);
//         if (response.status === 404 || response.status === 403 || response.status === 500) {
//           alert('Повторите попытку или обратитесь в техподдержку');
//         }
//       });
//     };
//     // user.get({urlId: 'products', routeId: 'orders', page: '1'}, {}, function(data) {
//     //   $scope.products = data.data;
//     // }, function(response) {
//     //   console.log(response);
//     //   if (response.status === 404 || response.status === 403 || response.status === 500) {
//     //     alert('Повторите попытку или обратитесь в техподдержку');
//     //   }
//     // });
//     // user.get({urlId: 'services', routeId: 'orders', page: '1'}, {}, function(data) {
//     //   $scope.services = data.data;
//     // }, function(response) {
//     //   console.log(response);
//     //   if (response.status === 404 || response.status === 403 || response.status === 500) {
//     //     alert('Повторите попытку или обратитесь в техподдержку');
//     //   }
//     // });
//   }]);


villageAppControllers.controller('OrdersServicesCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
      }
    });
    $scope.page = 0;
    $scope.services = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMoreServices = function() {
      $scope.page++;
      $scope.fetching = true;
      user.get({urlId: 'services', routeId: 'orders', page: $scope.page}, {}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function(service) {
          if (service.service.data.image != null) {
            service.image = service.service.data.image.formats.mediumThumb;
          } else {
            service.imagePresent = true;
          }
        });
        $scope.services = $scope.services.concat(data.data);
        $scope.basePath = BasePath.domain;
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    };
  }]);

villageAppControllers.controller('OrdersProductsCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath',
  function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler, BasePath) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
      }
    });
    $scope.page = 0;
    $scope.products = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMoreProducts = function() {
      $scope.page++;
      $scope.fetching = true;
      user.get({urlId: 'products', routeId: 'orders', page: $scope.page}, {}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function(product) {
          if (product.product.data.image != null) {
            product.image = product.product.data.image.formats.mediumThumb;
          } else {
            product.imagePresent = true;
          }
        });
        $scope.products = $scope.products.concat(data.data);
        $scope.basePath = BasePath.domain;
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Повторите попытку или обратитесь в техподдержку');
        }
      });
    };
  }]);

villageAppControllers.controller('SurveyCtrl', ['$scope', '$resource', '$location', 'Users', '$routeParams', 'TransferDataService', 'TokenHandler', 
  function($scope, $resource, $location, Users, $routeParams, TransferDataService, tokenHandler) {
    var user = $resource('http://village.fruitware.ru/api/v1/:urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        headers: { 'Authorization': 'Bearer ' + tokenHandler.get()}
      }
    });
    user.get({urlId: 'surveys', routeId: 'current'}, {}, function(data) {
      $scope.surveyData = data.data;
      $scope.surveyId = data.data.id;
      $scope.surveyData.ends_at = Date.parse($scope.surveyData.ends_at);
      if (data.data.my_vote) {
        $scope.selectedValue = {
          value: data.data.my_vote.data.choice
        };
      }
      $scope.radioChange = function(value) {
        $scope.choice = value;
        user.save({urlId: 'surveys', routeId: $scope.surveyId}, {'choice': $scope.choice}, function(data) {

        }, function(response) {
          console.log(response);
        });
      }
    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Повторите попытку или обратитесь в техподдержку');
      }
    });
  }]);


villageAppControllers.controller('FooterCtrl', ['$scope', '$location', 'FooterCustom',
  function($scope, $location, FooterCustom) {
    $scope.footerBlocks = FooterCustom.query();
    $scope.isActive = function(route) {
      return route === $location.path().split('/', 2)[1];
    }
    $scope.routeFooter = function() {
      return $location.path().split('/', 2)[1];
    }
    $scope.isShownFooter = function(path) {
      switch (path) {
        case 'profile':
        case 'services':
        case 'service':
        case 'news':
        case 'newsitem':
        case 'survey':
        case 'products':
        case 'product':
          return true;
      }
    }

  }]);

villageAppControllers.controller('PathCtrl', ['$scope', '$location',
  function($scope, $location) {
    $scope.routeMain = function() {
      return $location.path();
      // return route === $location.path().split('/', 2)[1];
    }
    $scope.routeUser = function() {
      return $location.path().split('/', 2)[1];
    }
    $scope.addClass = function(path) {
      switch (path) {
        case '/login':
        case '/profile':
        case '/profile/name':
        case '/profile/phone':
        case '/profile/confirm':
        case '/profile/password':
        case '/reset':
        case '/reset/confirm':
        case '/reset/change':
        case '/request':
        case '/request/sent':
        case '/register':
        case '/register/phone':
        case '/register/confirm':
        case '/register/welcome':
          return true;
      }
    }
    $scope.isPadding = function(path) {
      switch (path) {
        case 'profile':
        case 'services':
        case 'service':
        case 'news':
        case 'newsitem':
        case 'products':
        case 'product':
        case 'survey':
          return true;
      }
    }
    $scope.isWhite = function(routeSnd) {
      return routeSnd === $location.path().split('/', 3)[2];
    }
  }]);

