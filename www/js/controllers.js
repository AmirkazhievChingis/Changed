angular.module('starter.controllers', ['ngCordova', 'starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform) {

})
.controller('MapController', function($scope, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, GeoLayer, $cordovaGeolocation){

    $ionicPlatform.ready(function () {

        var initMap = function(jsonString){

            $scope.map = new L.Map('map', {
                center: new L.LatLng(44.85278, 65.50917),
                attributionControl: true,
                zoom: 12,
                maxZoom: 18,
                minZoom: 12,
                maxBounds: new L.LatLngBounds(new L.LatLng(44.771862, 65.435981), //southWest
                    new L.LatLng(44.896843, 65.581812) // northEast
                )
            });

            L.tileLayer('http://www.obl.kz/ArcGIS/rest/services/Topo_KZ_2016/MapServer/tile/{z}/{y}/{x}', {}).addTo($scope.map);

            jsonString = JSON.parse(jsonString);

            var geoJsonObj;
            geoJsonObj = '{"type":"FeatureCollection", "features": [';

            jsonString.forEach(function (item) {
                var object = item.geom;
                var objectGeo;

                if(object != null)
                {
                    geoJsonObj += '{"type": "Feature","properties": {"title":"';
                    geoJsonObj += item.name_ru;
                    geoJsonObj += '"},';
                    geoJsonObj += '"geometry":' + item.geometry;
                    geoJsonObj += ',"popupTemplate": "{title}"';
                    geoJsonObj += '},';
                }
            });

            geoJsonObj = geoJsonObj.substring(0, geoJsonObj.length - 1);

            geoJsonObj += ']}';

            // console.log(geoJsonObj);

            geoJsonObj = JSON.parse(geoJsonObj);

            // console.log(geoJsonObj);

            var featuresLayer = new L.GeoJSON(geoJsonObj, {
                style: function (feature) {
                    return {color: 'rgba(0, 0, 0, 0)'};
                },
                onEachFeature: function(feature, marker) {
                    marker.bindPopup('<h4 style="color:#FFDD73">' + feature.properties.title +'</h4>');
                }
            });

            $scope.map.addLayer(featuresLayer);

            var searchControl = new L.Control.Search({
                layer: featuresLayer,
                propertyName: 'title',
                circleLocation: false,
                moveToLocation: function (latlng, title, map) {
                    var zoom = map.getBoundsZoom(latlng.layer.getBounds());
                    map.setView(latlng, zoom);
                }
            });

            searchControl.on('search:locationfound', function (e) {
                e.layer.setStyle({fillColor: 'rgba(255, 1, 0, 0.7)', color: 'rgba(255, 1, 0, 0.7)'});

                if(e.layer._popup)
                {
                    e.layer.openPopup();
                }
            }).on('search:collapsed', function (e) {
                featuresLayer.eachLayer(function(layer) {
                    featuresLayer.resetStyle(layer);
                });
            });

            $scope.map.addControl(searchControl);

            $scope.MyLocation = function() {

                $cordovaGeolocation.watchPosition({timeout: 3000, enableHighAccuracy: false})
                    .then(null, function (error) {

                        console.log("LOCATE ERROR    " + JSON.stringify(error));
                    }, function (position) {

                        $scope.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
                    });
            };

            var customControl = L.Control.extend({
                options: {
                    position: 'bottomleft'
                },

                onAdd: function (map) {
                    var container = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom ion-location');

                    container.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    container.style.borderWidth = 0;
                    // container.style.backgroundImage = "url(img/Location.png)";
                    // container.style.backgroundSize = "30px 30px";
                    // container.style.width = '30px';
                    // container.style.height = '30px';

                    container.onclick = function(){
                        $scope.MyLocation();
                    };

                    return container;
                }
            });

            $scope.map.addControl(new customControl());
        };

        GeoLayer.getGeoJsonDataFromFile()
            .then(function(data) {
                $scope.geoJsonLayerString = data;
                // console.log("!!!!!!!!!!!!!!!!  " + $scope.geoJsonLayerString + "    !!!!!!!!!!!!!!!!  ");

                initMap($scope.geoJsonLayerString);
            }, function (error) {
                console.log("Error outputing GeoInformation " + JSON.stringify(error));
            });


        //TODO:--------------------
        // var url = 'https://github.com/stefanocudini/leaflet-search/archive/master.zip';
        // var targetPath = cordova.file.dataDirectory + url.split("/").pop();
        //
        //     $cordovaFileTransfer.download(url, targetPath, {}, true)
        //         .then(function (result) {
        //         $scope.msg = 'Save file on '+targetPath+' success! ' + result.fullPath;
        //
        //             $cordovaZip
        //                 .unzip(targetPath, cordova.file.dataDirectory + '/map')
        //                 .then(function (file) {
        //
        //                     $scope.msg = 'success ' + " " + file;
        //                 }, function () {
        //
        //                     $scope.msg = 'error';
        //                 }, function (progress) {
        //
        //                     $scope.msg = (progress.loaded / progress.total) * 100;
        //                 });
        //
        //     }, function (error) {
        //         $scope.msg = 'Error Download file ';
        //     }, function (progress) {
        //         $scope.msg = (progress.loaded / progress.total) * 100;
        //     });

//         $scope.map = new L.Map('map', {
//             center: new L.LatLng(44.85278, 65.50917),
//             attributionControl: true,
//             zoom: 12,
//             maxZoom: 18,
//             minZoom: 12//,
//             // maxBounds: new L.LatLngBounds(new L.LatLng(44.771862, 65.435981), //southWest
//             //     new L.LatLng(44.896843, 65.581812) // northEast
//             //)
//         });
//
//         L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo($scope.map);
//
//         var searchControl = new L.Control.Search({
//             propertyName: 'title',
//             circleLocation: false,
//             moveToLocation: function (latlng, title, map) {
//                 var zoom = map.getBoundsZoom(latlng.layer.getBounds());
//                 map.setView(latlng, zoom);
//             }
//         });
//
//         searchControl.on('search:locationfound', function (e) {
//             e.layer.setStyle({fillColor: 'rgba(255, 1, 0, 0.7)', color: 'rgba(255, 1, 0, 0.7)'});
//
//             if(e.layer._popup)
//             {
//                 e.layer.openPopup();
//             }
//         });
//
//         $scope.map.addControl(searchControl);
/////////////
        ////////////
    });
})
    .controller('BuildingsCtrl', function ($scope, Building) {
        $scope.buildings = Building.query();
    })

    .controller('BuildingCtrl', function($scope, $stateParams, Building) {
        $scope.building = Building.get({buildingId: $stateParams.buildingId});
    });