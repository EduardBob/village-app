'use strict';

var villageAppControllers = angular.module('villageAppControllers', []);


villageAppControllers.controller('RequestCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'localStorageService', 'BasePath',
  function($scope, $resource, $location, TransferDataService, localStorageService,  BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        isArray: true
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        isArray: true
      }
    });
    $scope.sendRequest = function(phone, full_name, position, address) {
      user.save({urlId: 'villages', routeId: 'request'}, {'phone' : phone, 'full_name' : full_name, 'position' : position, 'address' : address}, function(data) {
         $location.path('/request/sent');
      }, function(response) {
        if (response.status === 400) {
          // var messages = [];
          // var message = messages.concat(response.data.error.message.address, response.data.error.message.full_name, response.data.error.message.phone, response.data.error.message.position);
          // alert(message.join("\r\n"));
          alert('Все поля обязательны для заполнения');
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);
villageAppControllers.controller('RequestPartnerCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'localStorageService', 'BasePath',
  function($scope, $resource, $location, TransferDataService, localStorageService,  BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'},
        isArray: true
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'},
        isArray: true
      }
    });
    $scope.sendRequest = function(phone, full_name, company_name) {
      user.save({urlId: 'villages', routeId: 'partner-request'}, {'phone' : phone, 'full_name' : full_name, 'company_name' : company_name}, function(data) {
         $location.path('/request/sent');
      }, function(response) {
        if (response.status === 400) {
          var messages = [];
          var message = messages.concat(response.data.error.message.company_name, response.data.error.message.full_name, response.data.error.message.phone);
          alert(message.join("\r\n"));
          // alert('Все поля обязательны для заполнения');
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);

villageAppControllers.controller('InviteCodeCtrl', ['$scope', '$resource', '$location', '$timeout', 'TransferDataService', 'localStorageService', 'GetMeta', '$sce', 'BasePath',
  function($scope, $resource, $location, $timeout, TransferDataService, localStorageService, GetMeta, $sce,  BasePath) {
    var building = $resource(BasePath.api + 'buildings/:buildingCode', {buildingCode: '@buildingCode'});
    $scope.terms = false;
    

    $timeout(function() {
        angular.element('.main-container').css('min-height', $(window).height());
        // angular.element('#invite-code').focus();
    });
    $resource(BasePath.api + 'settings').get({}, function(data) {
      GetMeta.setData(data.data);
      $scope.agreementTextOld = GetMeta.getData('village::village-agreement-condition');

      if ($scope.agreementTextOld.indexOf('src="/assets/') > 0) {
        var d = 'src="' + BasePath.domain + '/assets/';
        $scope.agreementTextOld = $scope.agreementTextOld.replace(/(src="\/assets\/)/g, d);
      }
      $scope.agreementText = $sce.trustAsHtml(stripScript($scope.agreementTextOld));
    }, function(response) {
      $scope.agreementText = 'Соглашение'
    });


    $scope.updateCode = function(code) {
      building.get({buildingCode: code}, function(data) {
        $scope.address = data.data.address;
        $scope.building_id = data.data.id;
        TransferDataService.addData('address', data.data.address);
        localStorageService.set('invitecode', code);
        localStorageService.set('token', 'none');
        TransferDataService.addData('building_id', data.data.id);

        $scope.terms = true;
        $scope.goToPhone = function() {
          $location.path('/register/phone');
        }
      }, function(response) {
        if (response.status === 404 || response.status === 400) {
          alert('Неверный инвайт-код');
        } else if (response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
    $timeout(function() {
      angular.element('.form-scroll').css({
        'max-height' : $(window).height() - 103,
        'margin-top' : '-20px'
      });
    });
  }]);

villageAppControllers.controller('AgreementCtrl', ['$scope', '$resource', '$location', '$timeout', 'TransferDataService', 'localStorageService', 'GetMeta', '$sce', 'BasePath',
  function($scope, $resource, $location, $timeout, TransferDataService, localStorageService, GetMeta, $sce,  BasePath) {

    $resource(BasePath.api + 'settings').get({}, function(data) {
      GetMeta.setData(data.data);
      $scope.agreementTextOld = GetMeta.getData('village::village-agreement-condition');

      if ($scope.agreementTextOld.indexOf('src="/assets/') > 0) {
        var d = 'src="' + BasePath.domain + '/assets/';
        $scope.agreementTextOld = $scope.agreementTextOld.replace(/(src="\/assets\/)/g, d);
      }
      $scope.agreementText = $sce.trustAsHtml(stripScript($scope.agreementTextOld));
    }, function(response) {
      $scope.agreementText = 'Соглашение'
    });

    $timeout(function() {
      angular.element('.form-scroll').css({
        'max-height' : $(window).height() - 103,
        'margin-top' : '-20px'
      });
    });
  }]);


villageAppControllers.controller('PhoneCheckCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'BasePath',
  function($scope, $resource, $location, TransferDataService,  BasePath) {
    $scope.addressVillage = TransferDataService.getData('address');
    $scope.buildingId = TransferDataService.getData('building_id');
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'}
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'}
      }
    });
    $scope.checkPhone = function(phone) {
      user.save({urlId: 'users'}, {'phone' : phone, 'building_id' : $scope.buildingId}, function(data) {
        $location.path('/register/confirm');
        TransferDataService.addData('phone', phone);
        TransferDataService.addData('session', data.data.session);
        TransferDataService.addData('code', data.data.code);
      }, function(response) {
        if (response.status === 400) {
          alert(response.data.error.message.phone);
        } else if (response.status === 403) {
          // if (response.data.error.message === "user_exist") {
          //   alert('Пользователь с таким номером уже существует');
          // } else if (response.data.error.message === "user_not_activated") {
          //   alert('Ваш аккаунт деактивирован. Обратитесь в техподдержку');
          // } else if (response.data.error.message === "user_without_building") {
          //   alert('У вашего аккаунта  не указан номер дома. Обратитесь в техподдержку');
          // } else if (response.data.error.message === "village_not_activated") {
          //   alert('Ваш посёлок отключен от нашей системы');
          // } else if (response.data.error.message === 'sms_invalid_mobile_phone') {
          //   alert('sms gate не работает с этим номер телефона');
          // } else if (response.data.error.message === '') {

          // }
          var alertMsg = '';
          switch(response.data.error.message) {
            case 'user_exist':
              alertMsg = 'Пользователь с таким номером уже существует';
              break;
            case 'user_not_activated':
              alertMsg = 'Ваш аккаунт деактивирован. Пожалуйста, обратитесь в техподдержку';
              break;
            case 'user_without_building':
              alertMsg = 'У вашего аккаунта  не указан номер дома. Пожалуйста, обратитесь в техподдержку';
              break;
            case 'village_not_activated':
              alertMsg = 'Ваш посёлок отключен от нашей системы';
              break;
            case 'sms_invalid_mobile_phone':
              alertMsg = 'Неверный номер телефона.';
              break;
            case 'sms_internal_error':
              alertMsg = 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.';
              break;
          }
          alert(alertMsg);
          $location.path('/login');
        } else if (response.status === 404 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);

villageAppControllers.controller('SmsCheckCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'BasePath',
  function($scope, $resource, $location, TransferDataService,  BasePath) {
    $scope.phone = TransferDataService.getData('phone');
    $scope.session = TransferDataService.getData('session');
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'}
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'}
      }
    });
    $scope.code = TransferDataService.getData('code');
    $scope.checkCode = function(code) {
      user.save({urlId: 'tokens', routeId: 'check'}, {'code' : $scope.code, 'session' : $scope.session, 'type' : 'registration'}, function(data) {
        $location.path('/register/welcome');
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          alert(response.data.error.message.code);
        } else if (response.status === 404) {
          alert('Неправильный код');
        } else if (response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);

villageAppControllers.controller('ProfileDataCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath',
  function($scope, $resource, $location, TransferDataService, tokenHandler, localStorageService, Users,  BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    $scope.code = TransferDataService.getData('code');
    $scope.session = TransferDataService.getData('session');
    $scope.submitData = function(first_name, last_name, email, password, password_confirmation) {
      user.save({urlId: 'users', routeId: 'confirm'}, {'code' : $scope.code, 'session' : $scope.session, 'first_name' : first_name, 'last_name' : last_name, 'email' : email, 'password' : password, 'password_confirmation' : password_confirmation}, function(data) {
        $location.path('/profile');
        TransferDataService.addData('first_name', first_name);
        TransferDataService.addData('last_name', last_name);
        TransferDataService.addData('email', email);
        TransferDataService.addData('password', password);
        TransferDataService.addData('password_confirmation', password_confirmation);
        localStorageService.set('token', data.data.token);
        tokenHandler.set(data.data.token);
        TransferDataService.addData('token', data.data.token);
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          if (response.data.error === 'token_not_provided') {
            $location.path('/login');
            localStorageService.set('token', 'none');
          } else {
            var messages = [];
            var message = messages.concat(response.data.error.message.first_name, response.data.error.message.last_name, response.data.error.message.email, response.data.error.message.password);
            alert(message.join("\r\n"));
          }
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);


villageAppControllers.controller('ProfileCtrl', ['$scope', '$resource', '$location', '$timeout', '$http', 'TransferDataService', 'TokenHandler', 'Users', 'localStorageService', 'BasePath',
  function($scope, $resource, $location, $timeout, $http, TransferDataService, tokenHandler, Users, localStorageService,  BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    $timeout(function() {
      angular.element('.main-container').css('min-height', $(window).height());
    });

    $scope.first_name = TransferDataService.getData('first_name');
    $scope.last_name = TransferDataService.getData('last_name');
    $scope.phone = TransferDataService.getData('phone');
    $scope.email = TransferDataService.getData('email'); 
    $scope.villageName = TransferDataService.getData('villageName'); 
    $scope.address = TransferDataService.getData('address'); 
    
    user.get({urlId: 'me'}, function(data) {
      $scope.first_name = data.data.first_name;
      $scope.last_name = data.data.last_name;
      $scope.phone = data.data.phone;
      $scope.villageName = data.data.building.data.village.data.name;
      localStorageService.set('villageName', $scope.villageName);
      $scope.address = data.data.building.data.address;
      $scope.checkEmail = data.data.has_mail_notifications;
      if (data.data.email != null) {
        $scope.email = data.data.email;
      } else {
        $scope.emailPresent = false;
      }
      TransferDataService.addData('first_name', data.data.first_name);
      TransferDataService.addData('villageName', data.data.building.data.village.data.name);
      TransferDataService.addData('last_name', data.data.last_name);
      TransferDataService.addData('phone', data.data.phone);
      TransferDataService.addData('email', data.data.email);
      TransferDataService.addData('address', data.data.building.data.address);
    }, function(response) {
      console.log(response);
      if (response.status === 400) {
        if (response.data.error === 'token_not_provided') {
          $location.path('/login');
          localStorageService.set('token', 'none');
        } else {
          alert(response.data.error.message.join("\r\n"));
        }
      } else if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });
    $scope.userLogout = function() {
      
      if (localStorageService.get('tokendevice')) {

        var tokenDevice = localStorageService.get('tokendevice');

        var req = {
           method: 'POST',
           url: BasePath.api + 'me/device-delete',
           headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
           data: {token: tokenDevice}
          }

        $http(req).then(function(){
          TransferDataService.resetData();
          localStorageService.set('token', 'none');
          localStorage.removeItem('tokendevice');
          // localStorage.removeItem('tokendeviceNew');
          localStorageService.set('tokendevice', '');
          tokenHandler.set("none");
          $location.path('/login');
        }, function(){

        });

      } else {
        TransferDataService.resetData();
        localStorageService.set('token', 'none');
        localStorage.removeItem('tokendevice');
        // localStorage.removeItem('tokendeviceNew');
        localStorageService.set('tokendevice', '');
        tokenHandler.set("none");
        $location.path('/login');
      }
      
    };

    // if (localStorageService.get('push')) {
    //   $scope.checkEmail = localStorageService.get('push');
    // } else {
    //   $scope.checkEmail = false;
    // }

    // $scope.$watch('checkEmail', function() {
    //   localStorageService.set('push', $scope.checkEmail);
    // }, true); 
    
    $scope.changeNotification = function(checkEmail) {
      var stat = checkEmail ? 1 : 0;
      // console.log(stat);
      $timeout.cancel( timer );
      var timer = $timeout(
        function() {
          user.save({urlId: 'me', routeId: 'mail-notifications'}, {'has_mail_notifications' : stat}, function(data) {
          }, function(response) {
            console.log(response);
            alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
          });
        }, 500);
      
    }

  }]);

villageAppControllers.controller('ProfileChangeDataCtrl', ['$scope', '$resource', '$location', '$timeout', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath',
  function($scope, $resource, $location, $timeout, TransferDataService, tokenHandler, localStorageService, Users,  BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    $timeout(function() {
        angular.element('.main-container').css('min-height', $(window).height());
    });
    $scope.first_name = TransferDataService.getData('first_name');
    $scope.last_name = TransferDataService.getData('last_name');
    $scope.phone = TransferDataService.getData('phone');
    $scope.email = TransferDataService.getData('email');
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
    $scope.changeEmail = function(email) {
      user.save({urlId: 'me', routeId: 'email'}, {'email' : email}, function(data) {
        $scope.nameSuccess = 'Данные успешно изменены';
      }, function(response) {
        console.log(response);
        if (response.status === 400) {
          $scope.nameSuccess = false;
          alert(response.data.error.message.email[0]);
          // alert(response.data.error.message.email);
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
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
        } else if (response.status === 403) {
          var alertMsg = '';
          switch(response.data.error.message) {
            case 'sms_invalid_mobile_phone':
              alertMsg = 'Неверный номер телефона.';
              break;
            case 'sms_internal_error':
              alertMsg = 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.';
              break;
          }
          alert(alertMsg);
        } else if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);


villageAppControllers.controller('ProfileNumbersCtrl', ['$scope', '$resource', '$location', '$timeout', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath', '$http', '$sce',
  function($scope, $resource, $location, $timeout, TransferDataService, tokenHandler, localStorageService, Users, BasePath, $http, $sce) {
    if(localStorageService.isSupported) {
      // function submit(key, val) {
      //   return localStorageService.set(key, val);
      // }
    }
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    user.get({urlId: 'me'}, {}, function(data) {
      $scope.contacts = data.data.building.data.village.data.important_contacts;
      
      if ($scope.contacts.length) {
        $scope.noNumbers = false;
        if ($scope.contacts.indexOf('src="/assets/') > 0) {
          var d = 'src="' + BasePath.domain + 'assets/';
          $scope.contacts = $scope.contacts.replace(/(src="\/assets\/)/g, d);
        }
        $scope.contacts = $sce.trustAsHtml(stripScript($scope.contacts));
        // angular.forEach($scope.contacts, function (contact) {

        //   if (contact.title.indexOf('src="/assets/') > 0) {
        //     var d = 'src="' + BasePath.domain + '/assets/';
        //     contact.title = contact.title.replace('src="/assets/', d);
        //   }
        //   contact.title = $sce.trustAsHtml(stripScript(contact.title));


        //   if (contact.phone.indexOf('src="/assets/') > 0) {
        //     var d = 'src="' + BasePath.domain + '/assets/';
        //     contact.phone = contact.phone.replace('src="/assets/', d);
        //   }
        //   contact.phone = $sce.trustAsHtml(stripScript(contact.phone));

        // });
      } else {
        $scope.noNumbers = true;
      }
      
    }, function(response) {
      alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
    });

  }]);


villageAppControllers.controller('ProfileDocumentsCtrl', ['$scope', '$resource', '$location', '$sanitize', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', '$http', '$routeParams',
  function($scope, $resource, $location, $sanitize, TransferDataService, tokenHandler, BasePath, localStorageService, Users, $http, $routeParams) {

    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    $scope.catIdNew = $routeParams.category_id;
    $scope.catTitleNew = $routeParams.category_title;

    if (typeof $scope.catIdNew != 'undefined' && $scope.catIdNew != 'allCategories') {
      $scope.ddSelectSelected = {'title': $scope.catTitleNew, 'id' : $scope.catIdNew};
    } else {
      $scope.ddSelectSelected = {'title': "Все категории", 'id' : 'allCategories'};
    }

    user.get({urlId: 'documents', routeId: 'categories'}, {}, function(data) {
      $scope.arr3 = data.data;
      $scope.ddSelectOptions = $scope.arr3;
      $scope.mainCat = {'title': "Все категории", 'id' : 'allCategories'};
      $scope.ddSelectOptions.push($scope.mainCat);

    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });

    $scope.filterNews = function(selected) {
      $location.url($location.path() + '/?category_id=' + selected.id + '&category_title=' + selected.title);
    }

    $scope.page = 0;
    $scope.docBlocks = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function(catId) {
      if ($scope.fetching) return;
      $scope.page++;
      $scope.fetching = true;

      if (catId == 'allCategories') {
        catId = '';
      }
      
      user.get({urlId: 'documents', category_id: catId, page: $scope.page}, {}, function(data) {

        $scope.fetching = false;
        angular.forEach(data.data, function (doc) {
          $scope.arr = doc.published_at.split(/[- :]/);
          doc.published_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2], $scope.arr[3], $scope.arr[4], $scope.arr[5]);
          if (doc.file) {
            doc.docFormat = doc.file.formats.extension;
          } else {
            doc.docFormat = 'txt';
          }
        });

        $scope.docBlocks = $scope.docBlocks.concat(data.data);
        $scope.basePath = BasePath.domain;
        if ($scope.page == 1 && data.data.length < 1) {
          $scope.emptyService = true;
          $scope.emptyServiceText = "В данной категории документов нет"
        }
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };

    
  }]);



villageAppControllers.controller('DocumentCtrl', ['$scope', '$resource', '$location', '$window', '$routeParams', '$filter', '$q', '$sce', '$timeout', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', '$cordovaSocialSharing',
  function($scope, $resource, $location, $window, $routeParams, $filter,$q, $sce, $timeout, TransferDataService, tokenHandler, BasePath, localStorageService, Users, $cordovaSocialSharing) {


    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    user.get({urlId: 'documents', routeId: $routeParams.docId}, {}, function(data) {
      $scope.docItem = data.data;

      if ($scope.docItem.text.indexOf('%%') > 0) {
        var regex = /%%/gi,
            match, 
            indices = [];
        $scope.textNew = $scope.docItem.text;
        while ((match = regex.exec($scope.docItem.text)) != null) {
          indices.push(match.index);
        }
        for (var i = 1, len = indices.length; i < len; i+=2) {
          var a = $scope.docItem.text.split("%%")[i],
            b = a.split('^'),
            itemName = b[0],
            item = b[1],
            itemId = b[2];
          var c = '%%' + a + '%%';
          var d = '<a href="#/' + item + '/' + itemId + '">' + itemName + '</a>';
          $scope.textNew = $scope.textNew.replace(c, d);
        }
      } else {
        $scope.textNew = $scope.docItem.text;
      }

      if ($scope.textNew.indexOf('src="/assets/') > 0) {
        var d = 'src="' + BasePath.domain + '/assets/';
        $scope.textNew = $scope.textNew.replace(/(src="\/assets\/)/g, d);
      }

      $scope.textNew = $sce.trustAsHtml(stripScript($scope.textNew));

      if ($scope.docItem.file) {
        $scope.docLink = BasePath.domain + $scope.docItem.file.formats.original;
      }
      
      $scope.basePath = BasePath.domain; 
    }, function(response) {
      if (response.status === 404) {
        alert('Этот документ был удален');
        $location.path('/profile/documents');
      }
      if (esponse.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });

    $scope.share = function() {
      $cordovaSocialSharing
      .share($scope.docLink) // Share via native share sheet
      // .share(message, subject, file, link) // Share via native share sheet
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

  }]);

villageAppControllers.controller('AuthCtrl', ['$scope', '$resource', '$http', '$location', '$timeout', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath', '$window',
  function($scope, $resource, $http, $location, $timeout, TransferDataService, tokenHandler, localStorageService, Users, BasePath, $window) {
    if(localStorageService.isSupported) {
      // function submit(key, val) {
      //   return localStorageService.set(key, val);
      // }
    }
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
      get: {
        method: 'GET',
        params: {urlId: '@urlId', routeId: '@routeId'}
      },
      save: {
        method: 'POST',
        params: {urlId: '@urlId', routeId: '@routeId'}
      }
    });
    // $timeout(function() {
    //     angular.element('.main-container').css('min-height', $(window).height());
    // });

    if (localStorageService.get('villageName') != null) {
      $scope.siteName = localStorageService.get('villageName');
    } else if (localStorageService.get('invitecode') != null) {
      user.get({urlId: 'buildings', routeId: localStorageService.get('invitecode')}, {}, function(data) {
        $scope.siteName = data.data.village.data.name;
      }, function(response) {
        console.log(response);
        if (response.status === 404) {
          localStorageService.remove('invitecode');
          alert('Вы должны зарегистрироваться');
        } else if (response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    } else {
      $scope.siteName = '"Консьерж"';
    }
    $scope.login = function(phone, password) {
      TransferDataService.addData('phone', phone);
      user.save({urlId: 'auth', routeId: 'token'}, {'phone': phone, 'password': password}, function(data) {
        TransferDataService.addData('phone', phone);
        tokenHandler.set(data.data.token);
        // window.localStorage['token'] = data.data.token;
        localStorageService.set('token', data.data.token);
        if (localStorage.getItem('tokendeviceNew') != localStorage.getItem('tokendevice')) {
          var newToken = localStorage.getItem('tokendeviceNew');
          var ua = $window.navigator.userAgent,
              ios = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod') || ~ua.indexOf('iPad');

          var type = ios ? "ios" : "gcm";

          var req = {
             method: 'POST',
             url: BasePath.api + 'me/device',
             headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
             data: {type: type, token: newToken}
            }

          $http(req).then(function(){
            localStorage.setItem('tokendevice', newToken);
            localStorageService.set('tokendevice', newToken);
            localStorageService.set('devicetype', type);
            $location.path('/services');
          }, function(response){
            // alert(response.status);
             // alert(JSON.stringify(response));
          });
        } else {
          $location.path('/services');
        }
        // if (localStorageService.get('tokendevice')) {
        //   var type = localStorageService.get('devicetype'),
        //     tokenDevice = localStorageService.get('tokendevice');
        //   var req = {
        //      method: 'POST',
        //      url: BasePath.api + 'me/device',
        //      headers: { 'Authorization': 'Bearer ' + data.data.token },
        //      data: {type: type, token: tokenDevice}
        //     }

        //   $http(req).then(function(){
        //     $location.path('/services');
        //   }, function(response){

        //   });
        // } else {
        //   $location.path('/services');
        // }
        
        // console.log(localStorageService.get('token'));
        
      }, function(response) {
        if (response.status === 401 || response.status === 400) {
          alert('Неверный телефон или пароль');
        } else if (response.status === 403) {
          alert('Вы должны зарегистрироваться');
          $location.path('/register');
        } else if (response.status === 404 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);

villageAppControllers.controller('ResetCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath',
  function($scope, $resource, $location, TransferDataService, tokenHandler, localStorageService, Users,  BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    $scope.phone = TransferDataService.getData('phone');
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
          var alertMsg = '';
          switch(response.data.error.message) {
            case 'sms_invalid_mobile_phone':
              alertMsg = 'sms gate не работает с этим номер телефона';
              break;
            case 'sms_internal_error':
              alertMsg = 'закончился баланс или неверная валидация данных';
              break;
            default:
              alertMsg = 'Ваш номер не был активирован. Пожалуйста, активируйте его';
          }
          alert(alertMsg);
          $scope.phone = TransferDataService.getData('phone');
          $location.path('/register');
        } else if (response.status === 404 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    }
  }]);

villageAppControllers.controller('NewsListCtrl', ['$scope', '$resource', '$location', '$sanitize', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', '$http', '$routeParams', '$sce',
  function($scope, $resource, $location, $sanitize, TransferDataService, tokenHandler, BasePath, localStorageService, Users, $http, $routeParams, $sce) {
    // Users.get({urlId: 'articles'}, {}, function(data) {
    //   $scope.allNews = [];
    //   angular.forEach(data.data, function (news) {
    //     $scope.allNews.push(news.id);
    //   });
    //   //       if (!angular.equals($scope.allNews, $scope.allNews2)) {
    //   //         $scope.allNews2 = $scope.allNews2.concat($scope.allNews);
    //   //       }

    //   // $scope.allNews2 = ["502", "38"];
    //   // $scope.result = [];
    //   // angular.forEach($scope.allNews2, function(key) {
    //   //   if (-1 === $scope.allNews.indexOf(key)) {
    //   //     $scope.result.push(key);
    //   //   }
    //   // });
    //   // $scope.nrNew = $scope.result.length;

    //   $scope.maxNews = Math.max.apply(Math, $scope.allNews);

    //   localStorageService.set('nrNews', $scope.maxNews);


    //   // GetMeta.setData(data.data);
    //   // $scope.siteName = GetMeta.getData('core::site-name');

    //   // for (var i in $scope.allNews) {
    //   //       if (!$scope.allNews2.hasOwnProperty(i)) {
    //   //               $scope.allNews2 = $scope.allNews2.concat($scope.allNews);
    //   //       }
    //   //   }
    //   //   console.log($scope.allNews2);
    // }, function(response) {
    //   console.log(response);
    //   if (response.status === 404 || response.status === 403 || response.status === 500) {
    //     alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
    //   }
    // });

    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    $scope.allNews = [];

    localStorageService.set('newArticles', false);
    user.get({urlId: 'articles'}, {}, function(data) {
      angular.forEach(data.data, function (news) {
        $scope.allNews.push(news.id);
      });
      localStorageService.set('oldNews', $scope.allNews);
      
      // if (localStorageService.get('maxNews') < Math.max.apply(Math, $scope.allNews) && $scope.allNews.indexOf('' + localStorageService.get('maxNews') + '') !== '-1'  && localStorageService.get('maxNews') != null) {
      //   localStorageService.set('maxNews', Math.max.apply(Math, $scope.allNews));
      // } else {
      //   localStorageService.set('maxNews', Math.max.apply(Math, $scope.allNews));
      // }
    }, function(response) {
      console.log(response);
      if (response.data.error === 'token_not_provided') {
        $location.path('/login');
        localStorageService.set('token', 'none');
      } 
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });

    $scope.catIdNew = $routeParams.category_id;
    $scope.catTitleNew = $routeParams.category_title;

    if (typeof $scope.catIdNew != 'undefined' && $scope.catIdNew != 'allCategories') {
      $scope.ddSelectSelected = {'title': $scope.catTitleNew, 'id' : $scope.catIdNew};
    } else {
      $scope.ddSelectSelected = {'title': "Все категории", 'id' : 'allCategories'};
    }

    user.get({urlId: 'articles', routeId: 'categories'}, {}, function(data) {
      $scope.arr3 = data.data;
      $scope.ddSelectOptions = $scope.arr3;
      $scope.mainCat = {'title': "Все категории", 'id' : 'allCategories'};
      $scope.ddSelectOptions.push($scope.mainCat);

    }, function(response) {
      console.log(response);
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });

    $scope.filterNews = function(selected) {
      $location.url($location.path() + '/?category_id=' + selected.id + '&category_title=' + selected.title);
    }

    $scope.page = 0;
    $scope.newsBlocks = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function(catId) {
      if ($scope.fetching) return;
      $scope.page++;
      $scope.fetching = true;

      if (catId == 'allCategories') {
        catId = '';
      }
      
      user.get({urlId: 'articles', category_id: catId, page: $scope.page}, {}, function(data) {

        $scope.fetching = false;
        angular.forEach(data.data, function (news) {
          // news.published_at = Date.parse(news.published_at);
          $scope.arr = news.published_at.split(/[- :]/);
          news.published_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2], $scope.arr[3], $scope.arr[4], $scope.arr[5]);

          if (news.image != null) {
            news.image = news.image.formats.bigThumb;
          } else {
            news.imagePresent = true;
          }

          if (news.short.indexOf('%%') > 0) {
            var regex = /%%/gi,
                match, 
                indices = [];
                news.textNew = news.short;
            while ((match = regex.exec(news.text)) != null) {
              indices.push(match.index);
            }
            for (var i = 1, len = indices.length; i < len; i+=2) {
              var a = news.text.split("%%")[i],
                b = a.split('^'),
                itemName = b[0],
                item = b[1],
                itemId = b[2];
              var c = '%%' + a + '%%';
              var d = '<a href="#/' + item + '/' + itemId + '">' + itemName + '</a>';
              news.textNew = news.textNew.replace(c, d);
            }
          } else {
            news.textNew = news.short;
          }

          // if (news.short.indexOf('%%') > 0) {
          //   var a = news.short.split("%%")[1],
          //       b = a.split('^'),
          //       itemName = b[0],
          //       item = b[1],
          //       itemId = b[2];
          //   var c = '%%' + a + '%%';
          //   var d = '<a href="#/' + item + '/' + itemId + '">' + itemName + '</a>';
          //   news.short = news.short.replace(c, d);
          // }
          // $scope.add(news, news.category_title);
        });

        $scope.newsBlocks = $scope.newsBlocks.concat(data.data);
        $scope.basePath = BasePath.domain;
        if ($scope.page == 1 && data.data.length < 1) {
          $scope.emptyService = true;
          $scope.emptyServiceText = "В данной категории новостей нет"
        }
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };

    
  }]);


villageAppControllers.controller('NewsDetailCtrl', ['$scope', '$resource', '$location', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', '$sce', 
  function($scope, $resource, $location, $routeParams, TransferDataService, tokenHandler, BasePath, localStorageService, Users, $sce) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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


    // $scope.article = {};
    // $scope.article.text = "<p>В одном из населённых пунктов Самарской области автомобилист %поворачивал|15% налево и столкнулся с машиной, ехавшей по обочине. Как сообщает &laquo;Российская газета&raquo;, инспекторы ГИБДД назвали виновными обоих водителей: одного, так как двигался по обочине, второго, поскольку не уступил помехе справа. Верховный суд, рассмотрев дело, постановил: водитель, движущийся по обочине, не имел преимущественного права движения, а у водителя другого автомобиля при повороте налево на прилегающую территорию вне перекрестка отсутствовала обязанность уступить дорогу движущемуся по обочине транспортному средству. Проще говоря, машины на обочине вообще не должно было быть, соответственно, и уступать дорогу некому. Таким образом, из постановления Верховного суда России можно сделать вывод, что дорогу автомобилям, которые движутся по обочине, можно не уступать &mdash; поскольку езда по обочине запрещена как таковая, то при любом столкновении будет виноват &laquo;обочечник&raquo;.</p>"
      
    // if ($scope.article.text.indexOf('%') > 0) {
    //   var a = $scope.article.text.split("%")[1],
    //       b = a.split('^'),
    //       itemName = b[0],
    //       item = b[1],
    //       itemId = b[2];
    //   var c = '%' + a + '%';
    //   var d = '<a href="#/' + item + '/' + itemId + '">' + itemName + '</a>';
    //   $scope.article.text = $scope.article.text.replace(c, d);
    // }

    localStorageService.set('newArticles', false);

    $scope.articleData = user.get({urlId: 'articles', routeId: $routeParams.articleId}, function(data) {
      $scope.article = data.data;
      // $scope.article.published_at = Date.parse($scope.article.published_at);
      $scope.arr = $scope.article.published_at.split(/[- :]/);
      $scope.article.published_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2], $scope.arr[3], $scope.arr[4], $scope.arr[5]);
      if (data.data.image != null) {
        $scope.articleImage = data.data.image.formats.bigThumb;
      } else {
        $scope.imagePresentMain = true;
      }
      if ($scope.article.text.indexOf('%%') > 0) {
        var regex = /%%/gi,
            match, 
            indices = [];
        $scope.textNew = $scope.article.text;
        while ((match = regex.exec($scope.article.text)) != null) {
          indices.push(match.index);
        }
        for (var i = 1, len = indices.length; i < len; i+=2) {
          var a = $scope.article.text.split("%%")[i],
            b = a.split('^'),
            itemName = b[0],
            item = b[1],
            itemId = b[2];
          var c = '%%' + a + '%%';
          var d = '<a href="#/' + item + '/' + itemId + '">' + itemName + '</a>';
          $scope.textNew = $scope.textNew.replace(c, d);
        }
      } else {
        $scope.textNew = $scope.article.text;
      }

      if ($scope.textNew.indexOf('src="/assets/') > 0) {
        var d = 'src="' + BasePath.domain + '/assets/';
        $scope.textNew = $scope.textNew.replace(/(src="\/assets\/)/g, d);
      }

      $scope.textNew = $sce.trustAsHtml(stripScript($scope.textNew));
      $scope.basePath = BasePath.domain;
    }, function(response) {
      // alert(JSON.stringify(response));
    });
  }]);

villageAppControllers.controller('ServicesCategoriesCtrl', ['$scope', '$rootScope', '$resource', '$location', '$timeout', '$window', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', '$http', '$cordovaPushV5',
  function($scope, $rootScope, $resource, $location, $timeout, $window, TransferDataService, tokenHandler, BasePath, localStorageService, Users, $http, $cordovaPushV5) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    if (localStorage.getItem('tokendeviceNew') != localStorage.getItem('tokendevice')) {
      $scope.loading = true;
    } else {
      $scope.loading = false;
    }
    // $scope.loading = true;

    $scope.registerId = function() {

      if (localStorage.getItem('tokendeviceNew') != localStorage.getItem('tokendevice')) {
        var newToken = localStorage.getItem('tokendeviceNew');
        var ua = $window.navigator.userAgent,
            ios = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod') || ~ua.indexOf('iPad');

        var type = ios ? "ios" : "gcm";

        var req = {
           method: 'POST',
           url: BasePath.api + 'me/device',
           headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
           data: {type: type, token: newToken}
          }

        $http(req).then(function(){
          localStorage.setItem('tokendevice', newToken);
          localStorageService.set('tokendevice', newToken);
          localStorageService.set('devicetype', type);
          $scope.loading = false;
        }, function(response){
          // alert(response.status);
           // alert(JSON.stringify(response));
        });
      } else {
        $scope.loading = false;
      }


      var pushLinkA = sessionStorage.getItem('pushLink');
      var pushTypeA = sessionStorage.getItem('pushType');

      if (typeof pushLinkA != 'undefined' && pushLinkA != null) {
        // $location.path('/survey');
        if (typeof pushTypeA != 'undefined' && pushTypeA != null) {
          sessionStorage.removeItem('pushLink');
          sessionStorage.removeItem('pushType');
          sessionStorage.removeItem('foreground');
          sessionStorage.removeItem('message');
          sessionStorage.removeItem('coldstart');
          $location.path(pushLinkA).search({show: pushTypeA});
        } else {
          sessionStorage.removeItem('pushLink');
          sessionStorage.removeItem('pushType');
          sessionStorage.removeItem('foreground');
          sessionStorage.removeItem('message');
          sessionStorage.removeItem('coldstart');
          $location.path(pushLinkA);
        }
      }

      // alert('run');

      // var newToken = localStorageService.get('tokendevice');
      // var ua = $window.navigator.userAgent,
      //     ios = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod') || ~ua.indexOf('iPad');

      // var type = ios ? "ios" : "gcm";

      // var options = {
      //   android: {
      //     senderID: "1055017294786"
      //   },
      //   ios: {
      //     alert: "true",
      //     badge: "true",
      //     sound: "true"
      //   },
      //   windows: {}
      // };
      
      // // initialize
      // $cordovaPushV5.initialize(options).then(function() {
      //   alert('init');
      //   // start listening for new notifications
      //   $cordovaPushV5.onNotification();
      //   // start listening for errors
      //   $cordovaPushV5.onError();

        
      //   // register to get registrationId
      //   $cordovaPushV5.register().then(function(data) {
      //     alert('register');

      //     if (newToken != data) {
      //       var req = {
      //          method: 'POST',
      //          url: BasePath.api + 'me/device',
      //          headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
      //          data: {type: type, token: data}
      //         }

      //       $http(req).then(function(){
      //         alert('ok');
      //         $scope.loading = false;
      //         localStorageService.set('tokendevice', data);
      //         localStorageService.set('devicetype', type);
      //       }, function(response){
      //         // alert(response.status);
      //          // alert(JSON.stringify(response));
      //       });
      //     } else {
      //       $scope.loading = false;
      //     }
      //     // `data.registrationId` save it somewhere;
      //   }, function(error) {
      //     // alert(error);
      //   })
      // });
      
      // // triggered every time notification received
      // $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data){
      //   // alert(data.additionalData.url);
      //   // localStorageService.set('aaaa', data.additionalData.url);
      //   if (typeof data.additionalData.url != 'undefined') {
      //     alert('isurl');
      //     if (typeof data.additionalData.type != 'undefined') {
      //       alert('istype');
      //       $location.path(data.additionalData.url).search({show: data.additionalData.type});
      //     } else {
      //       $location.path(data.additionalData.url);
      //     }
      //   }
      //   // alert(JSON.stringify(data));
      //   // data.message,
      //   // data.title,
      //   // data.count,
      //   // data.sound,
      //   // data.image,
      //   // data.additionalData
      // });

      // // triggered every time error occurs
      // $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
      //   alert(e.message);
      //   // e.message
      // });
    }

    if (localStorageService.get('token') != 'none' && localStorageService.get('token') != null) {
      user.get({urlId: 'services', routeId: 'categories'}, {}, function(data) {

        $scope.serviceBlocks = data.data;
        angular.forEach($scope.serviceBlocks, function(service) {
          if (service.image != null) {
            service.image = service.image.formats.mediumThumb;
          } else {
            service.imagePresent = true;
          }
        })
        $scope.basePath = BasePath.domain;
        $timeout(function() {
          angular.element('#register').triggerHandler('click');
        }, 100);

      }, function(response) {
        console.log(response);
        if (response.data.error = 'token_expired') {
          user.save({urlId: 'auth', routeId: 'refresh'}, {}, function(data) {
            localStorageService.set('token', data.data.token);
            var newTokenUser = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
            newTokenUser.get({urlId: 'services', routeId: 'categories'}, {}, function(data) {

              $timeout(function() {
                angular.element('#register').triggerHandler('click');
              }, 100);
              
              $scope.serviceBlocks = data.data;
              angular.forEach($scope.serviceBlocks, function(service) {
                if (service.image != null) {
                  service.image = service.image.formats.mediumThumb;
                } else {
                  service.imagePresent = true;
                }
              })
              $scope.basePath = BasePath.domain;

            });
            $scope.allNews = [];
            if (localStorageService.get('oldNews') != null) {
              $scope.oldNews = localStorageService.get('oldNews');
            } else {
              $scope.oldNews = ["0"];
            }
            $scope.result = [];
            newTokenUser.get({urlId: 'articles'}, {}, function(data) {
              angular.forEach(data.data, function (news) {
                $scope.allNews.push(news.id);
              });
              angular.forEach($scope.allNews, function(key) {
                if (-1 === $scope.oldNews.indexOf(key)) {
                  if (key > Math.min.apply(Math, $scope.oldNews)) {
                    $scope.result.push(key);
                  }
                }
              });
              if ($scope.result.length && Math.max.apply(Math, $scope.result) > Math.max.apply(Math, $scope.oldNews)) {
                $scope.nrNews = $scope.result.length;
                TransferDataService.addData('nrNews', $scope.nrNews);
                localStorageService.set('newArticles', true);
              } else {
                localStorageService.set('newArticles', false);
              }
              // if (localStorageService.get('maxNews') < Math.max.apply(Math, $scope.allNews) && $scope.allNews.indexOf('' + localStorageService.get('maxNews') + '') !== '-1' && localStorageService.get('maxNews') != null) {
              //   $scope.nrNews = parseFloat($scope.allNews.indexOf('' + localStorageService.get('maxNews') + '')) - parseFloat($scope.allNews.indexOf('' + Math.max.apply(Math, $scope.allNews) + ''));
              //   TransferDataService.addData('nrNews', $scope.nrNews);
              //   localStorageService.set('newArticles', true);
              // } else {
              //   localStorageService.set('maxNews', Math.max.apply(Math, $scope.allNews));
              //   localStorageService.set('newArticles', false);
              // }
            }, function(response) {
              console.log(response);
              if (response.status === 404 || response.status === 403 || response.status === 500) {
                alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
              }
            });
          }, function(response) {
            console.log(response);
            if (response.status === 404 || response.status === 403 || response.status === 500) {
              alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
            }
          });
        } else if (response.data.error === 'token_not_provided') {
          $location.path('/login');
          localStorageService.set('token', 'none');
        } 
      });
      
      $scope.allNews = [];
      if (localStorageService.get('oldNews') != null) {
        $scope.oldNews = localStorageService.get('oldNews');
      } else {
        $scope.oldNews = ["0"];
      }
      $scope.result = [];
      user.get({urlId: 'articles'}, {}, function(data) {
        angular.forEach(data.data, function (news) {
          $scope.allNews.push(news.id);
        });
        angular.forEach($scope.allNews, function(key) {
          if (-1 === $scope.oldNews.indexOf(key)) {
            if (key > Math.min.apply(Math, $scope.oldNews)) {
              $scope.result.push(key);
            }
          }
        });
        if ($scope.result.length && Math.max.apply(Math, $scope.result) > Math.max.apply(Math, $scope.oldNews)) {
          $scope.nrNews = $scope.result.length;
          TransferDataService.addData('nrNews', $scope.nrNews);
          localStorageService.set('newArticles', true);
        } else {
          localStorageService.set('newArticles', false);
        }
        // if (localStorageService.get('maxNews') < Math.max.apply(Math, $scope.allNews) && $scope.allNews.indexOf('' + localStorageService.get('maxNews') + '') !== '-1' && localStorageService.get('maxNews') != null) {
        //   $scope.nrNews = parseFloat($scope.allNews.indexOf('' + localStorageService.get('maxNews') + '')) - parseFloat($scope.allNews.indexOf('' + Math.max.apply(Math, $scope.allNews) + ''));
        //   TransferDataService.addData('nrNews', $scope.nrNews);
        //   localStorageService.set('newArticles', true);
        // } else {
        //   localStorageService.set('maxNews', Math.max.apply(Math, $scope.allNews));
        //   localStorageService.set('newArticles', false);
        // }
      }, function(response) {
        console.log(response);
        // alert(JSON.stringify(response));
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    } else {
      $location.path('/login');
    }
    $scope.searchText = function() {
      $scope.notFound = false;
      $scope.notEntered = false;
    }
    $scope.search = function(text) {
      if (typeof text != 'undefined' && text.length) {
        user.get({urlId: 'services', search: text}, {}, function(data) {
          if (!data.data.length ) {
            $scope.notFound = true;
          } else {
            $location.path('/service/search/' + text);
          }
        }, function(response) {
          if (response.status === 404 || response.status === 403 || response.status === 500) {
            alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
          }
        });
      } else {
        $scope.notEntered = true;
      }
    }
  }]);

villageAppControllers.controller('ServicesCtrl', ['$scope', '$resource', '$location', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', 
  function($scope, $resource, $location, $routeParams, TransferDataService, tokenHandler, BasePath, localStorageService, Users) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    $scope.page = 0;
    $scope.serviceList = [];
    $scope.fetching = false;


    // Fetch more items
    $scope.getMore = function() {
      $scope.page++;
      $scope.fetching = true;
      $scope.categoryData = user.get({urlId: 'services', category_id: $routeParams.categoryId, page: $scope.page, search: $routeParams.searchId}, function(data) {
        $scope.fetching = false;
        if (typeof $routeParams.searchId != 'undefined' && $routeParams.searchId) {
          $scope.emptyService = true;
        }
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };
  }]);


villageAppControllers.controller('ServiceOrderCtrl', ['$scope', '$resource', '$http', '$location', '$window', '$routeParams', 'Upload', '$filter', '$q', '$sce', '$timeout', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users', '$cordovaCamera',
  function($scope, $resource, $http, $location, $window, $routeParams, Upload, $filter,$q, $sce, $timeout, TransferDataService, tokenHandler, BasePath, localStorageService, Users, $cordovaCamera) {


    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    $scope.canceler = $q.defer();
    function getResource(promise) {
      return $resource(BasePath.api + ':urlId/:routeId', {}, {
        save: {
          method: 'POST',
          params: {urlId: '@urlId', routeId: '@routeId'},
          headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
          timeout: promise
        }
      });
    }

    $scope.loading = false;

    var ua = $window.navigator.userAgent,
        ios = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod') || ~ua.indexOf('iPad');

    var type = ios ? "ios" : "gcm";

    if (type == 'ios') {
      $scope.ios = true;
    } else {
      $scope.android = true;
    }
    
    $scope.filesAll = [];

    $scope.addFiles = function(files) {
      angular.forEach(files, function(file) {
        var newFileName = Math.floor(Math.random()*1000000) + '_' + Date.now();
        Upload.rename(file,  newFileName + '.' + file.name.substr(file.name.lastIndexOf(".") + 1));
      })
      $scope.filesAll = $scope.filesAll.concat(files);
      if ($scope.filesAll.length >= 5) {
        $scope.maxImg = true;
        
        var len = $scope.filesAll.length;
        while(len > 5) {
          $scope.filesAll.pop();
          len = $scope.filesAll.length;
        }
      }
      $scope.loading = false;
      console.log($scope.filesAll);
    }

    $scope.addFile = function(file) {
      if (file != null) {
        var newFileName = Math.floor(Math.random()*1000000) + '_' + Date.now();
        Upload.rename(file,  newFileName + '.' + file.name.substr(file.name.lastIndexOf(".") + 1));
        $scope.filesAll.push(file);
      }
      if ($scope.filesAll.length >= 5) {
        $scope.maxImg = true;
        
        var len = $scope.filesAll.length;
        while(len > 5) {
          $scope.filesAll.pop();
          len = $scope.filesAll.length;
        }
      }
      $scope.loading = false;
      console.log($scope.filesAll);
    }

    $scope.beforeChange = function() {
      $scope.loading = true;
    }

    // $scope.submit = function() {
    //   if ($scope.form.file.$valid && $scope.files) {
    //     $scope.uploadFiles($scope.files);
    //     // $scope.upload($scope.file);
    //   }
    // };


    $scope.removePicture = function(f) {
      var id = f.$$hashKey;
      $scope.filesAll = $scope.filesAll.filter(function(el) { return el.$$hashKey != id;});
      $scope.maxImg = false;
    }

    // upload on file select or drop
    $scope.sendFiles = function (filesAll) {
      // alert(filesAll);
        $scope.loading = true;
        Upload.upload({
            url: BasePath.api + 'ping/sendfiles',
            data: {files: filesAll}
        }).then(function (resp) {
            console.log(resp);
            $scope.loading = false;
        }, function (err) {
            $scope.loading = false;
          // alert('err' + JSON.stringify(err));
            // console.log('Error status: ' + resp.status);
        });

        // $scope.loading = true;
        // $scope.filesToSend = [];
        // angular.forEach($scope.filesAll, function(file) {
        //   Upload.resize(file, {width:1080, height: 1080}).then(function(fileNew) {
        //     $scope.filesToSend.push(fileNew);
        //     return fileNew;
        //     Upload.upload({
        //       url: BasePath.api + 'ping/sendfiles',
        //       data: {files: filesAll}
        //     }).then(function (resp) {
        //         console.log(resp);
        //         $scope.loading = false;
        //     }, function (err) {
        //         $scope.loading = false;
        //       // alert('err' + JSON.stringify(err));
        //         // console.log('Error status: ' + resp.status);
        //     });
        //   })
        // })
    };
    $scope.takePicture = function() {
     var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 1080,
        targetHeight: 1080,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        // alert(imageData);
        var urlToBlob = function(url) {
          var defer = $q.defer();
          $http({url: url, method: 'get', responseType: 'arraybuffer'}).then(function (resp) {
            var arrayBufferView = new Uint8Array(resp.data);
            var type = resp.headers('content-type') || 'image/WebP';
            var blob = new window.Blob([arrayBufferView], {type: type});
            var matches = url.match(/.*\/(.+?)(\?.*)?$/);
            if (matches.length > 1) {
              blob.name = matches[1];
            }
            var newFileName = Math.floor(Math.random()*1000000) + '_' + Date.now();
            Upload.rename(blob,  newFileName + '.' + blob.name.substr(blob.name.lastIndexOf(".") + 1));

            $scope.filesAll.push(blob);
            if ($scope.filesAll.length >= 5) {
              $scope.maxImg = true;
            }
            defer.resolve(blob);
          }, function (e) {
            defer.reject(e);
          });
          return defer.promise;
        };
        urlToBlob(imageData);

        // var aaa = function(imageData) {
        //   window.resolveLocalFileSystemURI(imageData, function(fileEntry) {
        //     // alert(JSON.stringify(fileEntry));
        //     // alert('all' + $scope.filesAll);
        //     // $scope.filesAll.push(fileEntry);
        //     // alert('all again' + $scope.filesAll);
        //     // fileEntry.file(function(file) {
        //     //   alert(JSON.stringify(file));
        //     //   $scope.filesAll.push(file);
        //     // })

        //     var readBinaryFile = function (fileEntry) {
        //       fileEntry.file(function (file) {
        //         var reader = new FileReader();

        //         reader.onloadend = function() {

        //           console.log("Successful file read: " + this.result);
        //           // displayFileData(fileEntry.fullPath + ": " + this.result);

        //           var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
        //           // displayImage(blob);
        //           // alert(blob);
        //           $scope.filesAll.push(blob);
        //         };

        //         reader.readAsArrayBuffer(file);

        //       }, function() {

        //       });
        //     }
        //     readBinaryFile(fileEntry);


        //     // $scope.picData = fileEntry.nativeURL;
        //     // $scope.ftLoad = true;
        //     // alert('url' + $scope.picData);
        //     // var image = document.getElementById('myImage');
        //     // image.src = fileEntry.nativeURL;
        //   }, function(error) {
        //     alert('err' + error)

        //   });
        // }
        // aaa(imageData);
      }, function(err) {
        // alert('')
      });

    }


    // function getResource() {
    //   var defered = $q.defer();
    //   return $resource(BasePath.api + ':urlId/:routeId', {}, {
    //     save: {
    //       method: 'POST',
    //       params: {urlId: '@urlId', routeId: '@routeId'},
    //       headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
    //       timeout: defered.promise
    //     }
    //   });
    // }
    TransferDataService.addData('serviceDate', '');
    TransferDataService.addData('serviceTime', '');
    TransferDataService.addData('service_perform_at', '');
    TransferDataService.addData('hideBlockPayment', 'false');
    TransferDataService.addData('paymentOption', 'cash');
    user.get({urlId: 'me'}, {}, function(data) {
      $scope.servicePaymentInfo = data.data.building.data.village.data.service_payment_info;
      $scope.serviceBottomText = data.data.building.data.village.data.service_bottom_text;
    });
    user.get({urlId: 'services', routeId: $routeParams.serviceId}, {}, function(data) {
      $scope.serviceData = data.data;
      if (data.data.price == 0) {
        $scope.hideBlock = true;
        TransferDataService.addData('hideBlockPayment', 'true');
        TransferDataService.addData('paymentOption', 'cash');
        $scope.paymentOption = 'cash';
      } else {
        TransferDataService.addData('hideBlockPayment', 'false');
        TransferDataService.addData('paymentOption', 'card');
        $scope.paymentOption = 'card';
      }

      if (data.data.show_perform_time == 0) {
        $scope.hideTime = true;
      }
      if (data.data.allow_media) {
        $scope.allowMedia = true;
      }

      if (data.data.type == "sc") {
        $scope.commentRequired = true;
        $scope.serviceData.comment_label = '* ' + $scope.serviceData.comment_label;
      }

      if ($scope.serviceData.text.length) {
          if ($scope.serviceData.text.indexOf('src="/assets/') > 0) {
            var d = 'src="' + BasePath.domain + '/assets/';
            $scope.serviceData.text = $scope.serviceData.text.replace(/(src="\/assets\/)/g, d);
          }
          $scope.serviceData.text = $sce.trustAsHtml(stripScript($scope.serviceData.text));
      }

      if (typeof $routeParams.payment_type != 'undefined' && $routeParams.payment_type) {
        TransferDataService.addData('paymentOption', $routeParams.payment_type);
        $scope.paymentOption = $routeParams.payment_type;
      } else if (data.data.has_card_payment == 0) {
          TransferDataService.addData('paymentOption', 'cash');
          $scope.paymentOption = 'cash';
          $scope.justCash = true;
        }

      // console.log(localStorageService.get('serviceOrder' + $routeParams.serviceId));
      if (data.data.image != null) {
        $scope.serviceImage = data.data.image.formats.mediumThumb;
      } else {
        $scope.imagePresentMain = true;
      }

      if (typeof $routeParams.comment != 'undefined' && $routeParams.comment) {
        $scope.comment = $routeParams.comment;
      }

      $scope.serviceOrdered = false;
      $scope.basePath = BasePath.domain; 
    }, function(response) {
      if ((response.data.error.message === "Not Found") && response.status === 404) {
        alert('Эта услуга была удалена');
        $location.path('/profile/history');
      }
      if (esponse.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });
    // $scope.$watchGroup(['date', 'time'], function() {
    //   if (typeof TransferDataService.getData('serviceDate') != 'undefined' && typeof TransferDataService.getData('serviceTime') != 'undefined') {
    //     TransferDataService.addData('service_perform_at', TransferDataService.getData('serviceDate') + ' ' + TransferDataService.getData('serviceTime'));
    //   }
    // });
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
    $scope.paymentOptionChange = function(value) {
      TransferDataService.addData('paymentOption', $scope.paymentOption);
    }
    $scope.currentDate = new Date().toISOString().split("T")[0];

    $scope.sendData = function($event, comment, paymentOption, filesAll) {

      var timerData = $timeout(
        function() {
          alert('Невозможно отправить заявку. Пожалуйста, повторите попытку позже.');
          upload.abort();
          $scope.loading = false;
        }, 90000);
      // $scope.canceler = $q.defer();
      // var flag = 0;
      // $timeout(function() {
      //   flag = 1;
      //   $scope.canceler.resolve();
      //   $scope.waiting = false;
      // }, 10000);
      

      $scope.perform_date = TransferDataService.getData('serviceDate');
      $scope.perform_time = TransferDataService.getData('serviceTime');
      $scope.service_id = $routeParams.serviceId;
      $scope.waiting = true;

      if (!$scope.serviceOrderForm.inputDate.$valid) {
        alert('Выбранная дата не может быть меньше текущей даты');
        $timeout.cancel(timerData);
        $scope.waiting = false;
      } else if (!$scope.serviceOrderForm.inputComment.$valid) {
        alert('Для данного заказа все поля обязательны');
        $timeout.cancel(timerData);
        $scope.waiting = false;
      } else {

      $scope.loading = true;
      console.log($scope.filesAll);

      var upload = Upload.upload({
          url: BasePath.api + 'services/orders',
          data: {
            files: filesAll,
            'perform_date': $scope.perform_date, 
            'perform_time': $scope.perform_time, 
            'comment': comment, 
            'service_id': $scope.service_id,  
            'payment_type' : paymentOption
          },
          headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') }
      });
      upload.then(function (data) {
          console.log(data);
          $timeout.cancel(timerData);
          $scope.imgLength = $scope.filesAll.length;
          if ($scope.imgLength > 0) {
            $scope.sentImg = true;
          }
          $scope.loading = false;
          $scope.orderMessage = true;
          $($event.target).css('display','none');
          $scope.textHide = true;

          $scope.serviceOrdered = true;
          
          $scope.dataOrder = data.data;
          if ($scope.dataOrder.payment_type === 'card' && $scope.dataOrder.payment_status === 'not_paid') {
            $scope.link = $scope.dataOrder.pay.data.link;
            $window.open($scope.link, '_system');
          }

          $scope.filesAll = [];
          $scope.maxImg = false;
      }, function (response) {
          // alert(response.status);
          $timeout.cancel(timerData);
          $scope.loading = false;
          $($event.target).css('display','block');
          $scope.changedDate = false;
          $scope.changedTime = false;
          $scope.orderMessage = false;
          $scope.waiting = false;
          if (response.status === 400) {
            // alert('Введите дату и время заказа');
            alert('Введите дату заказа');
            // var messages = [];
            // var message = messages.concat(response.data.error.message.comment, response.data.error.message.perform_at, response.data.error.message.quantity);
            // alert(message.join("\r\n"));
          } else if (response.status === 404 || response.status === 403 || response.status === 500) {
            alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
          } else {
            alert('Невозможно отправить заявку. Пожалуйста, повторите попытку позже');
          }
        // alert('err' + JSON.stringify(err));
          // console.log('Error status: ' + resp.status);
      });

        // getResource($scope.canceler.promise).save({urlId: 'services', routeId: 'orders'}, {'perform_date': $scope.perform_date, 'perform_time': $scope.perform_time, 'comment': comment, 'service_id': $scope.service_id,  'payment_type' : paymentOption}, function(data) {
        //   $timeout.cancel();
        //   if (!flag) {
        //     // $scope.canceler = $q.defer();

        //     $scope.orderMessage = true;
        //     // $scope.waiting = false;
        //     $($event.target).css('display','none');
        //     $scope.textHide = true;

        //     $scope.serviceOrdered = true;
            
        //     $scope.dataOrder = data.data;
        //     if ($scope.dataOrder.payment_type === 'card' && $scope.dataOrder.payment_status === 'not_paid') {
        //       $scope.link = $scope.dataOrder.pay.data.link;
        //       $window.open($scope.link, '_system');
        //     }
        //   }
        //   // if (TransferDataService.getData('paymentOption') === 'card') {
        //   //   $window.open('https://mpi.mkb.ru:9443/MPI_payment/?site_link=test-api.html&mid=500000000011692&oid=12341236&aid=443222&amount=000000010000&merchant_mail=test@mkb.ru&signature=coo0re7VuwMFnY%2Bsc4EmhWEvejc%3D&client_mail=pos@mkb.ru');
        //   // }
        // }, function(response) {
        //   $timeout.cancel();
        //   $($event.target).css('display','block');
        //   $scope.changedDate = false;
        //   $scope.changedTime = false;
        //   $scope.orderMessage = false;
        //   $scope.waiting = false;
        //   if (response.status === 400) {
        //     // alert('Введите дату и время заказа');
        //     alert('Введите дату заказа');
        //     // var messages = [];
        //     // var message = messages.concat(response.data.error.message.comment, response.data.error.message.perform_at, response.data.error.message.quantity);
        //     // alert(message.join("\r\n"));
        //   } else if (response.status === 404 || response.status === 403 || response.status === 500) {
        //     alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        //   }
        // });
      }
    }

    // $scope.sendData = function($event, comment, paymentOption) {
    //   $scope.canceler = $q.defer();
    //   var flag = 0;
    //   $timeout(function() {
    //     flag = 1;
    //     $scope.canceler.resolve();
    //     $scope.waiting = false;
    //   }, 10000);
      

    //   $scope.perform_date = TransferDataService.getData('serviceDate');
    //   $scope.perform_time = TransferDataService.getData('serviceTime');
    //   $scope.service_id = $routeParams.serviceId;
    //   $scope.waiting = true;

    //   if (!$scope.serviceOrderForm.inputDate.$valid) {
    //     alert('Выбранная дата не может быть меньше текущей даты');
    //     $timeout.cancel();
    //     $scope.waiting = false;
    //   } else if (!$scope.serviceOrderForm.inputComment.$valid) {
    //     alert('Для данного заказа все поля обязательны');
    //     $timeout.cancel();
    //     $scope.waiting = false;
    //   } else {

    //     getResource($scope.canceler.promise).save({urlId: 'services', routeId: 'orders'}, {'perform_date': $scope.perform_date, 'perform_time': $scope.perform_time, 'comment': comment, 'service_id': $scope.service_id,  'payment_type' : paymentOption}, function(data) {
    //       $timeout.cancel();
    //       if (!flag) {
    //         // $scope.canceler = $q.defer();

    //         $scope.orderMessage = true;
    //         // $scope.waiting = false;
    //         $($event.target).css('display','none');
    //         $scope.textHide = true;

    //         $scope.serviceOrdered = true;
            
    //         $scope.dataOrder = data.data;
    //         if ($scope.dataOrder.payment_type === 'card' && $scope.dataOrder.payment_status === 'not_paid') {
    //           $scope.link = $scope.dataOrder.pay.data.link;
    //           $window.open($scope.link, '_system');
    //         }
    //       }
    //       // if (TransferDataService.getData('paymentOption') === 'card') {
    //       //   $window.open('https://mpi.mkb.ru:9443/MPI_payment/?site_link=test-api.html&mid=500000000011692&oid=12341236&aid=443222&amount=000000010000&merchant_mail=test@mkb.ru&signature=coo0re7VuwMFnY%2Bsc4EmhWEvejc%3D&client_mail=pos@mkb.ru');
    //       // }
    //     }, function(response) {
    //       $timeout.cancel();
    //       $($event.target).css('display','block');
    //       $scope.changedDate = false;
    //       $scope.changedTime = false;
    //       $scope.orderMessage = false;
    //       $scope.waiting = false;
    //       if (response.status === 400) {
    //         // alert('Введите дату и время заказа');
    //         alert('Введите дату заказа');
    //         // var messages = [];
    //         // var message = messages.concat(response.data.error.message.comment, response.data.error.message.perform_at, response.data.error.message.quantity);
    //         // alert(message.join("\r\n"));
    //       } else if (response.status === 404 || response.status === 403 || response.status === 500) {
    //         alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
    //       }
    //     });
    //   }
    // }

  }]);

villageAppControllers.controller('ProductsCategoriesCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users',
  function($scope, $resource, $location, TransferDataService, tokenHandler, BasePath, localStorageService, Users) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
      // alert(JSON.stringify(response));
      console.log(response);
      if (response.data.error === 'token_not_provided') {
        $location.path('/login');
        localStorageService.set('token', 'none');
      } 
      if (response.status === 404 || response.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });
    $scope.searchText = function() {
      $scope.notFound = false;
      $scope.notEntered = false;
    }
    $scope.search = function(text) {
      if (typeof text != 'undefined' && text.length) {
        user.get({urlId: 'products', search: text}, {}, function(data) {
          if (!data.data.length ) {
            $scope.notFound = true;
          } else {
            $location.path('/product/search/' + text);
          }
        }, function(response) {
          if (response.status === 404 || response.status === 403 || response.status === 500) {
            alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
          }
        });
      } else {
        $scope.notEntered = true;
      }
    }
  }]);

villageAppControllers.controller('ProductsAllCtrl', ['$scope', '$resource', '$location', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users',
  function($scope, $resource, $location, TransferDataService, tokenHandler, BasePath, localStorageService, Users) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };
  }]);

villageAppControllers.controller('ProductsCtrl', ['$scope', '$resource', '$location', '$routeParams', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users',
  function($scope, $resource, $location, $routeParams, TransferDataService, tokenHandler, BasePath, localStorageService, Users) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    $scope.page = 0;
    $scope.productList = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMore = function() {
      $scope.page++;
      $scope.fetching = true;
      $scope.articleData = user.get({urlId: 'products', category_id: $routeParams.categoryId, page: $scope.page, search: $routeParams.searchId}, function(data) {
        $scope.fetching = false;
        if (typeof $routeParams.searchId != 'undefined' && $routeParams.searchId) {
          $scope.emptyService = true;
        }
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
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };
  }]);

villageAppControllers.controller('ProductOrderCtrl', ['$scope', '$resource', '$location', '$window', '$routeParams', 'TransferDataService', 'TokenHandler', '$filter', '$q', '$timeout', 'BasePath', 'localStorageService', 'Users', '$sce',
  function($scope, $resource, $location, $window, $routeParams, TransferDataService, tokenHandler, $filter, $q, $timeout, BasePath, localStorageService, Users, $sce) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    $scope.canceler = $q.defer();
    function getResource(promise) {
      return $resource(BasePath.api + ':urlId/:routeId', {}, {
        save: {
          method: 'POST',
          params: {urlId: '@urlId', routeId: '@routeId'},
          headers: { 'Authorization': 'Bearer ' + localStorageService.get('token') },
          timeout: promise
        }
      });
    }
    TransferDataService.addData('unit_title', '');
    TransferDataService.addData('productDate', '');
    TransferDataService.addData('productTime', '');
    TransferDataService.addData('product_perform_at', '');
    TransferDataService.addData('hideBlockPayment', 'false');
    TransferDataService.addData('paymentOption', 'cash');
    user.get({urlId: 'me'}, {}, function(data) {
      $scope.dataVillage = data.data.building.data.village.data;
      $scope.shopName = $scope.dataVillage.shop_name;
      $scope.shopAddress = $scope.dataVillage.shop_address;
      $scope.productPaymentInfo = $scope.dataVillage.product_payment_info;
      $scope.productBottomText = $scope.dataVillage.product_bottom_text;
      $scope.productUnitStepKg = $scope.dataVillage.product_unit_step_kg;
      $scope.productUnitStepBottle = $scope.dataVillage.product_unit_step_bottle;
      $scope.productUnitStepPiece = $scope.dataVillage.product_unit_step_piece;
      user.get({urlId: 'products', routeId: $routeParams.productId}, {}, function(data) {
        $scope.productData = data.data;
        if ($scope.productData.text.length) {

          if ($scope.productData.text.indexOf('src="/assets/') > 0) {
            var d = 'src="' + BasePath.domain + '/assets/';
            $scope.productData.text = $scope.productData.text.replace(/(src="\/assets\/)/g, d);
          }
          $scope.productData.text = $sce.trustAsHtml(stripScript($scope.productData.text));
        }
        
        if (data.data.price == 0) {
          $scope.hideBlock = true;
          TransferDataService.addData('hideBlockPayment', 'true');
          TransferDataService.addData('paymentOption', 'cash');
          $scope.paymentOption = 'cash';
        } else {
          TransferDataService.addData('hideBlockPayment', 'false');
          TransferDataService.addData('paymentOption', 'card');
          $scope.paymentOption = 'card';
        }

        if (data.data.show_perform_time == 0) {
          $scope.hideTime = true;
        }

        if (typeof $routeParams.payment_type != 'undefined' && $routeParams.payment_type) {
          TransferDataService.addData('paymentOption', $routeParams.payment_type);
          $scope.paymentOption = $routeParams.payment_type;
        } else if (data.data.has_card_payment == 0) {
          TransferDataService.addData('paymentOption', 'cash');
          $scope.paymentOption = 'cash';
          $scope.justCash = true;
        }

        if (data.data.image != null) {
          $scope.productImage = data.data.image.formats.mediumThumb;
        } else {
          $scope.imagePresentMain = true;
        }

        if (typeof $routeParams.comment != 'undefined' && $routeParams.comment) {
          $scope.comment = $routeParams.comment;
        }

        $scope.productOrdered = false;

        $scope.basePath = BasePath.domain;
        
        // $scope.productData = $filter('filter')(data.data, {id: $routeParams.productId})[0];
        TransferDataService.addData('unit_title', $scope.productData.unit_title);
        $scope.productUnit = $scope.productData.unit_title;
        // $scope.unit_step = GetMeta.getData('village::product-unit-step-' + $scope.productUnit);
        
        if ($scope.productUnit === 'kg') {
          $scope.unitRus = 'кг';
        } else if ($scope.productUnit === 'bottle') {
          $scope.unitRus = 'бут.';
        } else if ($scope.productUnit === 'piece') {
          $scope.unitRus = 'шт.';
        }
        var unitStep = function(s) {
          if (s === 'kg') {
            return $scope.productUnitStepKg;
          } else if (s === 'bottle') {
            return $scope.productUnitStepBottle;
          } else if (s === 'piece') {
            return $scope.productUnitStepPiece;
          }
        }
        $scope.unit_step = unitStep($scope.productUnit);

        
        if (typeof $routeParams.qty != 'undefined') {
          $scope.quantity = $routeParams.qty;
        } else {
          $scope.quantity = $scope.unit_step;
        }

        $scope.sumTotal = parseFloat((($scope.productData.price*1)*($scope.quantity*1)).toFixed(2));

        $scope.changePlus = function() {
          if ($scope.productOrdered === true) {
            return false;
          } else {
            $scope.quantity = parseFloat((($scope.quantity*1) + ($scope.unit_step*1)).toFixed(2));
            $scope.sumTotal = parseFloat((($scope.productData.price*1)*($scope.quantity*1)).toFixed(2));
          }
        }
        
        $scope.changeMinus = function() {
          if ($scope.productOrdered === true) {
            return false;
          } else if ($scope.quantity > $scope.unit_step) {
            $scope.quantity = parseFloat((($scope.quantity*1) - ($scope.unit_step*1)).toFixed(2));
            $scope.sumTotal = parseFloat((($scope.productData.price*1)*($scope.quantity*1)).toFixed(2));
          }
        }
      }, function(response) {
        if ((response.data.error.message === "Not Found") && response.status === 404) {
          alert('Этот продукт был удален');
          $location.path('/profile/history');
        }
        if (esponse.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });

    });
    // $scope.$watchGroup(['date', 'time'], function() {
    //   if (typeof TransferDataService.getData('productDate') != 'undefined' && typeof TransferDataService.getData('productTime') != 'undefined') {
    //     TransferDataService.addData('product_perform_at', TransferDataService.getData('productDate') + ' ' + TransferDataService.getData('productTime'));
    //   }
    // });

    var today=new Date();
    $scope.currentDate = today.toISOString().split("T")[0];

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
    $scope.paymentOptionChange = function(value) {
      TransferDataService.addData('paymentOption', $scope.paymentOption);
    }
    $scope.sendData = function($event, quantity, comment, paymentOption) {

      $scope.canceler = $q.defer();
      var flag = 0;
      $timeout(function() {
        flag = 1;
        $scope.canceler.resolve();
        $scope.waiting = false;
      }, 10000);

      $scope.perform_date = TransferDataService.getData('productDate');
      $scope.perform_time = TransferDataService.getData('productTime');
      $scope.product_id = $routeParams.productId;
      $scope.waiting = true;

      if (!$scope.productOrderForm.inputDate.$valid) {
       alert('Выбранная дата не может быть меньше текущей даты');
      } else {
        getResource($scope.canceler.promise).save({urlId: 'products', routeId: 'orders'}, {'quantity': quantity, 'perform_date': $scope.perform_date, 'perform_time': $scope.perform_time, 'comment': comment, 'product_id': $scope.product_id, 'payment_type' : paymentOption}, function(data) {
          $timeout.cancel();
          if (!flag) {
            $scope.orderMessage = true;
            $scope.waiting = false;
            $($event.target).css('display','none');
            $scope.textHide = true;
            $scope.productOrdered = true;

            $scope.dataOrder = data.data;

            if ($scope.dataOrder.payment_type === 'card' && $scope.dataOrder.payment_status === 'not_paid') {
              $scope.link = $scope.dataOrder.pay.data.link;
              $window.open($scope.link, '_system');
            }
          }
          // if (TransferDataService.getData('paymentOption') === 'card') {
          //   $window.open('https://mpi.mkb.ru:9443/MPI_payment/?site_link=test-api.html&mid=500000000011692&oid=12341236&aid=443222&amount=000000010000&merchant_mail=test@mkb.ru&signature=coo0re7VuwMFnY%2Bsc4EmhWEvejc%3D&client_mail=pos@mkb.ru');
          // }
        }, function(response) {
          $timeout.cancel();
          $scope.changedDate = false;
          $scope.changedTime = false;
          $scope.orderMessage = false;
          $scope.waiting = false;
          $scope.orderMessageDeclined = false;
          $($event.target).css('display','block');
          if (response.status === 400) {
            alert('Введите дату заказа');
          } else if (response.status === 404 || response.status === 403 || response.status === 500) {
            alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
          }
        });
      }
    }
  }]);



villageAppControllers.controller('OrdersServicesCtrl', ['$scope', '$resource', '$location', '$routeParams', '$window', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users',
  function($scope, $resource, $location, $routeParams, $window, TransferDataService, tokenHandler, BasePath, localStorageService, Users) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    $scope.page = 0;
    $scope.services = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMoreServices = function() {
      $scope.page++;
      $scope.fetching = true;
      user.get({urlId: 'services', routeId: 'orders', page: $scope.page}, {}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function (service) {
          if (service.service.data.image != null) {
            service.image = service.service.data.image.formats.mediumThumb;
          } else {
            service.imagePresent = true;
          }
          if (service.payment_type === 'card' && service.payment_status === 'not_paid') {
            service.paymentLink = service.pay.data.link;
            $scope.openPaymentLink = function() {
              $window.open(service.paymentLink, '_system');
            }
          }

          // service.created_at = Date.parse(service.created_at);
          $scope.arr = service.created_at.split(/[- :]/);
          service.created_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2], $scope.arr[3], $scope.arr[4], $scope.arr[5]);

          if (service.perform_time != null) {
          $scope.arr_time = service.perform_time.split(/[- :]/);
          service.perform_time = $scope.arr_time[0] + ':' + $scope.arr_time[1];
        }
        });
        $scope.services = $scope.services.concat(data.data);
        $scope.basePath = BasePath.domain;
      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };
  }]);

villageAppControllers.controller('OrdersProductsCtrl', ['$scope', '$resource', '$location', '$routeParams', '$window', 'TransferDataService', 'TokenHandler', 'BasePath', 'localStorageService', 'Users',
  function($scope, $resource, $location, $routeParams, $window, TransferDataService, tokenHandler, BasePath, localStorageService, Users) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    $scope.page = 0;
    $scope.products = [];
    $scope.fetching = false;

    // Fetch more items
    $scope.getMoreProducts = function() {
      $scope.page++;
      $scope.fetching = true;
      user.get({urlId: 'products', routeId: 'orders', page: $scope.page}, {}, function(data) {
        $scope.fetching = false;
        angular.forEach(data.data, function (product) {
          if (product.product.data.image != null) {
            product.image = product.product.data.image.formats.mediumThumb;
          } else {
            product.imagePresent = true;
          }
          if (product.payment_type === 'card' && product.payment_status === 'not_paid') {
            product.paymentLink = product.pay.data.link;
            $scope.openPaymentLink = function() {
              $window.open(product.paymentLink, '_system');
            }
          }
          // product.created_at = Date.parse(product.created_at);
          $scope.arr = product.created_at.split(/[- :]/);
          product.created_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2], $scope.arr[3], $scope.arr[4], $scope.arr[5]);
          if (product.perform_time != null) {
            $scope.arr_time = product.perform_time.split(/[- :]/);
            product.perform_time = $scope.arr_time[0] + ':' + $scope.arr_time[1];
          }

          $scope.productUnit = product.unit_title;
          // $scope.unit_step = GetMeta.getData('village::product-unit-step-' + $scope.productUnit);
          
          if ($scope.productUnit === 'kg') {
            product.unitRus = 'кг';
          } else if ($scope.productUnit === 'bottle') {
            product.unitRus = 'бут.';
          } else if ($scope.productUnit === 'piece') {
            product.unitRus = 'шт.';
          }

          function formatNumber(num) {
            num = Math.round(num * 100)/100; ;
            return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + " " });
          }

          product.unit_price = formatNumber(product.unit_price);
          product.price = formatNumber(product.price);

        });

        $scope.products = $scope.products.concat(data.data);
        $scope.basePath = BasePath.domain;

      }, function(response) {
        console.log(response);
        if (response.status === 404 || response.status === 403 || response.status === 500) {
          alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
        }
      });
    };
  }]);

villageAppControllers.controller('HistoryTabCtrl', ['$scope', '$resource', '$location', '$routeParams', 'localStorageService',
  function($scope, $resource, $location, $routeParams, localStorageService) {

    if ($routeParams.show == 'product') {
      $scope.tab = 2;
    } else {
      $scope.tab = 1;
    }

    $scope.selectTab = function(passInTab) {
      $scope.tab = passInTab;
    }

    $scope.isTab = function(chosenTab) {
      return $scope.tab === chosenTab;
    }
  }]);

villageAppControllers.controller('SurveyCtrl', ['$scope', '$resource', '$location', '$routeParams', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath',
  function($scope, $resource, $location, $routeParams, TransferDataService, tokenHandler, localStorageService, Users, BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    // $scope.noCurrentSurvey = true;
    user.get({urlId: 'surveys', routeId: 'current'}, {}, function(data) {
      // $scope.noCurrentSurvey = false;
      $scope.surveyData = data.data;
      $scope.surveyId = data.data.id;
      // $scope.surveyData.ends_at = Date.parse($scope.surveyData.ends_at);
      $scope.arr = $scope.surveyData.ends_at.split(/[- :]/);
      $scope.surveyData.ends_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2]);
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
      if (response.status === 404) {
        $scope.noCurrentSurvey = true;
      } else if (response.status === 403 || response.status === 500) {
        alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
      }
    });
  }]);

villageAppControllers.controller('SmartCtrl', ['$scope', '$resource', '$location', '$routeParams', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath',
  function($scope, $resource, $location, $routeParams, TransferDataService, tokenHandler, localStorageService, Users, BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    // $scope.noCurrentSurvey = true;
    // user.get({urlId: 'surveys', routeId: 'current'}, {}, function(data) {
    //   // $scope.noCurrentSurvey = false;
    //   $scope.surveyData = data.data;
    //   $scope.surveyId = data.data.id;
    //   // $scope.surveyData.ends_at = Date.parse($scope.surveyData.ends_at);
    //   $scope.arr = $scope.surveyData.ends_at.split(/[- :]/);
    //   $scope.surveyData.ends_at = new Date($scope.arr[0], $scope.arr[1]-1, $scope.arr[2]);
    //   if (data.data.my_vote) {
    //     $scope.selectedValue = {
    //       value: data.data.my_vote.data.choice
    //     };
    //   }
    //   $scope.radioChange = function(value) {
    //     $scope.choice = value;
    //     user.save({urlId: 'surveys', routeId: $scope.surveyId}, {'choice': $scope.choice}, function(data) {

    //     }, function(response) {
    //       console.log(response);
    //     });
    //   }
    // }, function(response) {
    //   console.log(response);
    //   if (response.status === 404) {
    //     $scope.noCurrentSurvey = true;
    //   } else if (response.status === 403 || response.status === 500) {
    //     alert('Произошла неизвестная ошибка. Пожалуйста, свяжитесь с нами, или попробуйте позже.');
    //   }
    // });


  }]);

villageAppControllers.controller('LoadingCtrl', ['$scope', '$rootScope', '$resource', '$timeout', '$interval', '$location', '$routeParams', 'TransferDataService', 'TokenHandler', 'localStorageService', 'Users', 'BasePath',
  function($scope, $rootScope, $resource, $timeout, $interval, $location, $routeParams, TransferDataService, tokenHandler, localStorageService, Users, BasePath) {
    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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
    var timeout = 3000,
        flag2 = 0,
        retries = 0;

    function func() {
      if (!flag2) {
        user.get({urlId: 'ping'}, {}, function(data) {
          flag2 = 1;
        }, function(response) {
          flag2 = 1;
          if (response.status === 400 && response.data.error === 'token_not_provided') {
            $location.path('/login');
            localStorageService.set('token', 'none');
          }
        });

        retries++;
        timeout = timeout + 500;
        timer = setTimeout(func, timeout);

        if (retries > 10) {
          clearTimeout(timer);
          $scope.loading = true;
          $scope.loadingMessage = true;
        }
      } else {
        clearTimeout(timer);
        $location.path($rootScope.page);
      }
    }
    var timer = setTimeout(func, timeout);
  }]);


villageAppControllers.controller('FooterCtrl', ['$scope', '$location', 'FooterCustom', 'TransferDataService', 'localStorageService', 'BasePath',
  function($scope, $location, FooterCustom, TransferDataService, localStorageService, BasePath) {
    $scope.footerBlocks = FooterCustom.query();
    // $scope.nrNews = TransferDataService.getData('nrNews');
    // $scope.newArticles = localStorageService.get('newArticles');
    // $scope.$watch(localStorageService.get('newArticles'), function() {
    //   $scope.newArticles = localStorageService.get('newArticles');
    // console.log(localStorageService.get('newArticles'));
    // });
    // $scope.$watch(TransferDataService.getData('nrNews'), function() {
    //   $scope.nrNews = TransferDataService.getData('nrNews');
    // });
    // $scope.newArticles = function() {
    //   return localStorageService.get('newArticles');
    // }
    // $scope.nrNews = function() {
    //   return TransferDataService.getData('nrNews');
    // }
    $scope.isActive = function(route) {
      var r = $location.path().split('/', 2)[1];
      if (r === 'products' || r === 'product') {
        return route === 'services';
      } else {
        return route === r;
      }

      // return route === r;
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
        case 'smart':
        case 'document':
          return true;
      }
    }
    $scope.newNewsNr = function(path) {
      switch (path) {
        case 'profile':
        case 'services':
        case 'service':
        case 'smart':
        case 'news':
        case 'newsitem':
        case 'survey':
        case 'products':
        case 'product':
          return TransferDataService.getData('nrNews');
      }
    }
    $scope.newNewsAre = function(path) {
      switch (path) {
        case 'profile':
        case 'services':
        case 'service':
        case 'smart':
        case 'news':
        case 'newsitem':
        case 'survey':
        case 'products':
        case 'product':
          return localStorageService.get('newArticles');
      }
    }
  }]);

villageAppControllers.controller('PathCtrl', ['$scope', '$rootScope', '$resource', '$route', '$sce', '$routeParams', '$timeout', '$location', 'onlineStatus', 'localStorageService', '$interval', 'BasePath',
  function($scope, $rootScope, $resource, $route, $sce, $routeParams, $timeout, $location, onlineStatus, localStorageService, $interval, BasePath) {
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
        case '/profile/email':
        case '/profile/phone':
        case '/profile/confirm':
        case '/profile/password':
        case '/profile/numbers':
        case '/reset':
        case '/reset/confirm':
        case '/reset/change':
        case '/request':
        case '/request/partner':
        case '/request/sent':
        case '/register':
        case '/agreement':
        case '/register/phone':
        case '/register/confirm':
        case '/register/welcome':
        case '/smart':
        case '/offline':
        case '/loading':
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
        case 'documents':
        case 'document':
        case 'numbers':
        case 'products':
        case 'product':
        case 'survey':
        case 'smart':
          return true;
      }
    }
    $scope.isWhite = function(routeSnd) {
      return routeSnd === $location.path().split('/', 3)[2];
    }

    $scope.onlineStatus = onlineStatus;
    $scope.locationRemember = $location.path();

    $scope.$watch('onlineStatus.isOnline()', function(online) {
        $scope.offlineShow = online ? false : true;
    });

    // $scope.$on('linkChanged', function(event, data) { 
    //     // do things with the new counter
    //     alert(data);
    //     // var url = data;
    //     // if (url.indexOf('?type=') > 0) {
    //     //     var pushType = url.split('?type=')[1],
    //     //         pushLink = url.split('?type=')[0];
    //     //     // localStorage.removeItem('pushLink');
    //     //     $location.path(pushLink).search({show: pushType});
    //     // } else {
    //     //     // localStorage.removeItem('pushLink');
    //     //     $location.path(url);
    //     // }
    // });

    // var pushLink = localStorage.getItem('pushLink');

    var user = $resource(BasePath.api + ':urlId/:routeId', {}, {
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

    var timeStamp = new Date();
    var flag = 0;

    $scope.$on('$routeChangeStart', function(ev, next, current) { 
      var timeStampNew = new Date(),
          diffMs = timeStampNew - timeStamp,
          timeLeft = Math.round(((diffMs % 86400000) % 3600000) / 60000);

      timeStamp = timeStampNew;

      if (timeLeft > 30) {
        user.get({urlId: 'ping'}, {}, function(data) {
          flag = 1;
        }, function(response) {
          flag = 1;
          if (response.status === 400 && response.data.error === 'token_not_provided') {
            $location.path('/login');
            localStorageService.set('token', 'none');
          }
        });
        var timer = $timeout(
          function() {
            if (!flag) {
              $rootScope.page = next.originalPath;
              $location.path('/loading');
            } else {
              flag = 0;
            }
          }, 5000);
      }
     });

    $interval(callAtInterval, 100);

    function callAtInterval() {
      var newLink = sessionStorage.getItem('pushLink');
      // alert('new' + newLink);
      // alert('old' + pushLink);
      if (newLink != null && typeof newLink != 'undefined' && sessionStorage.getItem('coldstart') == 'false') {

        if (sessionStorage.getItem('foreground') == 'true') {
          $scope.pushReceived = true;
          $scope.message = sessionStorage.getItem('message');
          // newLink = null;
        } else if (sessionStorage.getItem('foreground') == 'false') {
          var newLink = sessionStorage.getItem('pushLink');
          var pushType = sessionStorage.getItem('pushType');
          if (typeof pushType != 'undefined' && pushType != null) {
            $location.path(newLink).search({show: pushType});
          } else {
            $location.path(newLink);
          }
          sessionStorage.removeItem('pushLink');
          sessionStorage.removeItem('pushType');
          sessionStorage.removeItem('foreground');
          sessionStorage.removeItem('message');
          sessionStorage.removeItem('coldstart');
          // pushLink = null;
        }
      };
    }

    $scope.pushOk = function() {
      $scope.pushReceived = false;
      var newLink = sessionStorage.getItem('pushLink');
      var pushType = sessionStorage.getItem('pushType');
      if (typeof pushType != 'undefined' && pushType != null) {
        $location.path(newLink).search({show: pushType});
      } else {
        $location.path(newLink);
      }
      sessionStorage.removeItem('pushLink');
      sessionStorage.removeItem('pushType');
      sessionStorage.removeItem('foreground');
      sessionStorage.removeItem('message');
      sessionStorage.removeItem('coldstart');
      // pushLink = null;
    }

    $scope.pushCancel = function() {
      $scope.pushReceived = false;
      sessionStorage.removeItem('pushLink');
      sessionStorage.removeItem('pushType');
      sessionStorage.removeItem('foreground');
      sessionStorage.removeItem('message');
      sessionStorage.removeItem('coldstart');
      // pushLink = null;
    }

  }]);

