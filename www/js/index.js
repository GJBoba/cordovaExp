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

var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        //navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {enableHighAccuracy : true, timeout:10000, maximumAge:6000});
        
        var ref = openCdSystems();
        /*
        *   Quand OpenCdSystems est complétement chargé
        *   Je lance en arrière plan mon application "compteurPlus"
        */
        //ref.addEventListener( "loadstop", backGroundApp );

        // 1) Request background execution
        //cordova.plugins.backgroundMode.enable(()=>{console.log("background enabled")},()=>{console.log("background NOT enabled")});
        //cordova.plugins.backgroundMode.disableWebViewOptimizations();

        // 2) Now the app runs ins background but stays awake
        //cordova.plugins.backgroundMode.on('activate', function () {
            ref.addEventListener( "loadstop", function() {
                ref.executeScript({
                    code: "localStorage.setItem('version','v0.1')"
                });
            });
        //});



        // 3) App is back to foreground
        //cordova.plugins.backgroundMode.on('deactivate', function () {
        //    cordova.plugins.notification.badge.clear();
    },    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

/*
* Déclaration des events sur les boutons
*/

//document.getElementById("getPosition").addEventListener("click", getPosition);
//document.getElementById("watchPosition").addEventListener("click", watchPosition);


/*
* Déclaration des variables globals
*/

var localStorage = window.localStorage;


/*
* Déclaration des fonctions attachées aux events
*/

function getPosition() {
    var options = {
       enableHighAccuracy: true,
       maximumAge: 3600000
    }
    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
 
    function onSuccess(position) {
       alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    };
 
    function onError(error) {
       alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
 }
 
 function watchPosition() {
    var options = {
       maximumAge: 3600000,
       timeout: 3000,
       enableHighAccuracy: true,
    }
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
 
    function onSuccess(position) {
       alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    };
 
    function onError(error) {
       alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    }
 }

 /*
 *  Ouverture d'une nouvelle page
 */
function openCdSystems(){
    console.log("openCdSystems");
    var ref = cordova.InAppBrowser.open('http://jerome.cd-systems.fr/geo2.php', '_blank', 'location=yes');
    
    var myCallback = function(event) { alert(event.url); }
    ref.addEventListener('loadstart', myCallback);
    ref.removeEventListener('loadstart', myCallback);
    ref.show();

    return ref;
};

function successCallback(position){
    alert("Localisation activée!");
};  


function errorCallback(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            alert("L'utilisateur n'a pas autorisé l'accès à sa position");
            break;          
        case error.POSITION_UNAVAILABLE:
            alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
            break;
        case error.TIMEOUT:
            alert("Le service n'a pas répondu à temps");
            break;
        }
};


/*
*   Ma fonction d'incrémentation en arrière plan
*/
function compteurPlus() {

    var code= `localStorage.setItem("cptApp",+localStorage.cptApp + 1);`

    setInterval(
        function(){ 
            ref.executeScript({
            code: code
            });
        }
        , 3000);

}

