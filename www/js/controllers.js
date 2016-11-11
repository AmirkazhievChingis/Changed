angular.module('starter.controllers', ['ngCordova', 'starter.services', 'starter.constants'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform) {
    $scope.searchQuery = "";
})

    .controller('AddController', function ($scope, $state, sharedPositionService, $cordovaCamera){

        $scope.position = sharedPositionService.sharedPosition;

        $scope.types = [];
        $scope.types[0] = {name:"Выберите тип объекта", items: []};
        $scope.types[0].items.push('тип 1', 'тип 2', 'тип 3');
        console.log($scope.types);

        $scope.toggleType = function(type) {
            if ($scope.isTypeShown(type)) {
                $scope.shownType = null;
            } else {
                $scope.shownType = type;
            }
        };

        $scope.isTypeShown = function(type) {
            return $scope.shownType === type;
        };

      $scope.kinds = [];
      $scope.kinds[0] = {name:"Выберите вид объекта", items: []};
      $scope.kinds[0].items.push('вид 1', 'вид 2', 'вид 3');
      console.log($scope.kinds);

      $scope.toggleKind = function(kind) {
        if ($scope.isKindShown(kind)) {
          $scope.shownKind = null;
        } else {
          $scope.shownKind = kind;
        }
      };
      $scope.isKindShown = function(kind) {
        console.log("SHOWN KIND", $scope.shownKind);
        return $scope.shownKind === kind;
      };

        alert("IN THIS POSITION WILL ADDED OBJECT " + $scope.position);
        console.log("Position in Adding view");

        //Adding picture
        $scope.pictureUrl = 'http://placehold.it/100x100';
        
        $scope.takePicture = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };
            $cordovaCamera.getPicture(options)
                .then(function (data) {
                    $scope.pictureUrl = "data:image/jpeg;base64," + data;
                    
                }, function (error) {
                    
                });
        };

        $scope.retrievePicture = function () {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };

            $cordovaCamera.getPicture(options).then(function(data) {
                $scope.pictureUrl = data;
            }, function(err) {
                alert("You can not retrieve photo");
            });

        }

    })

.controller('MapController', function($scope, $state, $ionicPlatform, sharedPositionService, $cordovaFile,
                                      $cordovaFileTransfer, GeoLayer, $cordovaGeolocation, centerPoint,
                                      southWestBound, northEastBound, transparent, Database, mapDB,
                                      fillColorLocationFound, colorLocationFound, tilesURL, $ionicModal){

    $ionicPlatform.ready(function () {

        ////MODAL BEGIN////////
        $ionicModal.fromTemplateUrl('templates/searchModal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        ///MODAL END/////

        var initMap = function(jsonString){

            $scope.map = new L.Map('map', {
                center: centerPoint,
                attributionControl: true,
                zoom: 12,
                maxZoom: 18,
                minZoom: 12,
                maxBounds: new L.LatLngBounds(southWestBound, northEastBound)
            });

            Database.openDB().then(function (DBName) {

                // L.tileLayer(tilesURL, {}).addTo($scope.map);

                console.log("ASDASDASDASDASDASD " + JSON.stringify(DBName));

                var dbOptions = {};

                if (ionic.Platform.isAndroid()) {
                    dbOptions = {name: DBName, createFromLocation: 1, location: 'default', androidDatabaseImplementation: 2, androidLockWorkaround: 1};
                }
                else {
                    dbOptions = {name: DBName, createFromLocation: 1};
                }

                var db = window.sqlitePlugin.openDatabase(dbOptions, function(db) {
                    db.transaction(function(tx) {
                        console.log("transaction: " + JSON.stringify(tx));

                        var MBTilesLayer = new L.TileLayer.MBTiles('',
                            {
                                tms: true,
                                scheme: 'tms',
                                unloadInvisibleTiles:true
                            },  db);

                        MBTilesLayer.addTo($scope.map);

                        console.log("end of build map");
                    });
                });

                //Adding object
                $scope.map.on('contextmenu', function(e){

                    var result = confirm("Добавить на карту");
                    console.log("RESULT OF OBJECT ", result);
                    if(result){
                        var position = e.latlng;
                        sharedPositionService.sendPosition(position);
                        console.log("POSITION IN MAPCONTROL " + position);
                        $state.go('app.addBuildingAndOrganization');
                    }
                    else{
                        alert("Объект не может быть добавлен на этой точке");
                    }

                });

                jsonString = JSON.parse(jsonString);

                $scope.searchGeoObjs = [];

                jsonString.forEach(function (item) {

                    var geomObj = item.geom;

                    if(geomObj != null) {

                        var object = {
                            name: item.name_ru,
                            geometry: item.geometry
                        };

                        $scope.searchGeoObjs.push(object);
                    }
                });

                // var geoJsonObj;
                // geoJsonObj = '{"type":"FeatureCollection", "features": [';
                //
                // jsonString.forEach(function (item) {
                //     var object = item.geom;
                //
                //     if(object != null)
                //     {
                //         // console.log("TESTGEOPARSE " + JSON.stringify(item));
                //         geoJsonObj += '{"type": "Feature","properties": {"title":"';
                //         if(item.name_ru !== undefined) {
                //             geoJsonObj += item.name_ru;
                //         } else {
                //             geoJsonObj += item.this_is + " " + item.number;
                //         }
                //         geoJsonObj += '"},';
                //         geoJsonObj += '"geometry":' + item.geometry;
                //         geoJsonObj += ',"popupTemplate": "{title}"';
                //         geoJsonObj += '},';
                //     }
                // });
                //
                // geoJsonObj = geoJsonObj.substring(0, geoJsonObj.length - 1);
                //
                // geoJsonObj += ']}';

                // console.log(geoJsonObj);

                //TODO: НЕВЕРНО ПАРСИТ ИЗМЕНИТЬ ГАЛЫМ СФОРМИРУЕТ КОЛЛЕКЦИЮ!!!!
                // geoJsonObj = JSON.parse(geoJsonObj);

                // console.log(geoJsonObj);

                // var featuresLayer = new L.GeoJSON(geoJsonObj, {
                //     style: function (feature) {
                //         return {color: transparent};
                //     },
                //     onEachFeature: function(feature, marker) {
                //         marker.bindPopup('<h4 style="color:#FFDD73">' + feature.properties.title +'</h4>');
                //     }
                // });

                // $scope.map.addLayer(featuresLayer);

                // var searchControl = new L.Control.Search({
                //     layer: featuresLayer,
                //     propertyName: 'title',
                //     circleLocation: false,
                //     moveToLocation: function (latlng, title, map) {
                //         var zoom = map.getBoundsZoom(latlng.layer.getBounds());
                //         map.setView(latlng, zoom);
                //     }
                // });

                // searchControl.on('search:locationfound', function (e) {
                //     e.layer.setStyle({fillColor: fillColorLocationFound, color: colorLocationFound});
                //
                //     if(e.layer._popup)
                //     {
                //         e.layer.openPopup();
                //     }
                // }).on('search:collapsed', function (e) {
                //     featuresLayer.eachLayer(function(layer) {
                //         featuresLayer.resetStyle(layer);
                //     });
                // });

                // $scope.map.addControl(searchControl);

              //GEOPOSITION
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

                        container.style.backgroundColor = transparent;
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
            }, function (error) {

                console.log("ERROR FETCHING DATABASE " + JSON.stringify(error));
            });
        };

        GeoLayer.getGeoJsonDataFromFile()
            .then(function(data) {

                // $scope.streets = data[data.length - 1].streets.substr(1, data[data.length - 1].streets.length - 2);
                // $scope.buildings = data[data.length - 1].buildings.substr(1, data[data.length - 1].buildings.length - 2);
                // $scope.orgs = data[data.length - 1].orgs.substr(1, data[data.length - 1].orgs.length - 2);
                //
                // $scope.geoJsonLayerString = "[" + $scope.streets + "," + $scope.buildings + "," + $scope.orgs + "]";
                // console.log("!!!!!!!!!!!!!!!!  " + $scope.geoJsonLayerString + "    !!!!!!!!!!!!!!!!  ");
                //
                // console.log("STREETSTEST" + $scope.streets);
                // console.log("BUILDINGSTEST" + $scope.buildings);
                // console.log("ORGSTEST" + $scope.orgs);

                $scope.streets = data[data.length - 1].streets;
                $scope.geoJsonLayerString = $scope.streets;

                initMap($scope.geoJsonLayerString);
            }, function (error) {
                console.log("Error outputing GeoInformation " + JSON.stringify(error));
            });

    });
})
    .controller('BuildingsCtrl', function ($scope, Building) {
        $scope.buildings = Building.query();
    })

    .controller('BuildingCtrl', function($scope, $stateParams, Building) {
        $scope.building = Building.get({buildingId: $stateParams.buildingId});
    });



