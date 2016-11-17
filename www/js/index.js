/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


// document.addEventListener('deviceready', onDeviceReady, false);

// function onDeviceReady() {

//     // Mock device.platform property if not available
//     if (!window.device) {
//         window.device = { platform: 'Browser' };
//     }

//     handleExternalURLs();
// }

// function handleExternalURLs() {
//     // Handle click events for all external URLs
//     if (device.platform.toUpperCase() === 'ANDROID') {
//         $(document).on('click', 'a[href^="http"]', function (e) {
//             var url = $(this).attr('href');
//             navigator.app.loadUrl(url, { openExternal: true });
//             e.preventDefault();
//         });
//     }
//     else if (device.platform.toUpperCase() === 'IOS') {
//         $(document).on('click', 'a[href^="http"]', function (e) {
//             var url = $(this).attr('href');
//             window.open(url, '_system');
//             e.preventDefault();
//         });
//     }
//     else {
//         // Leave standard behaviour
//     }
// }

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        document.addEventListener('deviceready', function() {
            
        }, false);

        if (!window.device) {
            window.device = { platform: 'Browser' };
        }
        

        app.handleExternalURLs();
        // app.showAlert();

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    showAlert: function() {
        // if (navigator.notification) { // Override default HTML alert with native dialog
          window.alert = function (message) {
              navigator.notification.alert(
                  message,    // message
                  null,       // callback
                  "Консьерж", // title
                  'OK'        // buttonName
              );
          };
        // }
    },
    handleExternalURLs: function() {
        // Handle click events for all external URLs
        if (device.platform.toUpperCase() === 'ANDROID') {
            $(document).on('click', 'a[href^="http"]', function (e) {
                var url = $(this).attr('href');
                navigator.app.loadUrl(url, { openExternal: true });
                e.preventDefault();
            });
        }
        else if (device.platform.toUpperCase() === 'IOS') {
            $(document).on('click', 'a[href^="http"]', function (e) {
                var url = $(this).attr('href');
                window.open(url, '_system');
                e.preventDefault();
            });
        }
        else {
            // Leave standard behaviour
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var newToken = localStorage.getItem('tokendevice');
        var push = PushNotification.init({
            android: {
                senderID: "1055017294786"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function(data) {
            if (newToken != data.registrationId) {
                localStorage.setItem('tokendeviceNew', data.registrationId);
            } else {
                localStorage.setItem('tokendevice', data.registrationId);
            }
            // data.registrationId
        });

        push.on('notification', function(data) {
            // alert(JSON.stringify(data));
            sessionStorage.removeItem('foreground');
            sessionStorage.removeItem('coldstart');
            sessionStorage.removeItem('message');
            sessionStorage.removeItem('pushLink');
            sessionStorage.removeItem('pushType');

            var url = data.additionalData.category;

            sessionStorage.setItem('foreground', data.additionalData.foreground);
            sessionStorage.setItem('coldstart', data.additionalData.coldstart);
            sessionStorage.setItem('message', data.message);

            if (url.indexOf('?type=') > 0) {
                var pushType = url.split('?type=')[1],
                    pushLink = url.split('?type=')[0];
                sessionStorage.setItem('pushLink', pushLink);
                sessionStorage.setItem('pushType', pushType);
            } else {
                sessionStorage.setItem('pushLink', url);
            }
            // window.location.replace(url);
            // window.location = host + url;
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function(e) {
            aleert(e.message);
            // e.message
        });
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

