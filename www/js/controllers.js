angular.module('starter.controllers', ['ngCordova', 'starter.services', 'starter.constants'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform) {

})
.controller('MapController', function($scope, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, GeoLayer, $cordovaGeolocation, centerPoint,
                                        southWestBound, northEastBound, transparent, fillColorLocationFound, colorLocationFound, tilesURL){

    $ionicPlatform.ready(function () {

        var initMap = function(jsonString){

            $scope.map = new L.Map('map', {
                center: centerPoint,
                attributionControl: true,
                zoom: 12,
                maxZoom: 18,
                minZoom: 12,
                maxBounds: new L.LatLngBounds(southWestBound, northEastBound)
            });

            L.tileLayer(tilesURL, {}).addTo($scope.map);

            jsonString = JSON.parse(jsonString);

            var geoJsonObj;
            geoJsonObj = '{"type":"FeatureCollection", "features": [';

            jsonString.forEach(function (item) {
                var object = item.geom;

                if(object != null)
                {
                    console.log("TESTGEOPARSE " + JSON.stringify(item));
                    geoJsonObj += '{"type": "Feature","properties": {"title":"';
                    if(item.name_ru !== undefined) {
                        geoJsonObj += item.name_ru;
                    } else {
                        geoJsonObj += item.this_is + " " + item.number;
                    }
                    geoJsonObj += '"},';
                    geoJsonObj += '"geometry":' + item.geometry;
                    geoJsonObj += ',"popupTemplate": "{title}"';
                    geoJsonObj += '},';
                }
            });

            geoJsonObj = geoJsonObj.substring(0, geoJsonObj.length - 1);

            geoJsonObj += ']}';

            // console.log(geoJsonObj);

            //TODO: НЕВЕРНО ПАРСИТ ИЗМЕНИТЬ ГАЛЫМ СФОРМИРУЕТ КОЛЛЕКЦИЮ!!!!
            geoJsonObj = JSON.parse(geoJsonObj);

            // console.log(geoJsonObj);

            var featuresLayer = new L.GeoJSON(geoJsonObj, {
                style: function (feature) {
                    return {color: transparent};
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
                e.layer.setStyle({fillColor: fillColorLocationFound, color: colorLocationFound});

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
        };

        GeoLayer.getGeoJsonDataFromFile()
            .then(function(data) {

                $scope.streets = data[data.length - 1].streets.substr(1, data[data.length - 1].streets.length - 2);
                $scope.buildings = data[data.length - 1].buildings.substr(1, data[data.length - 1].buildings.length - 2);
                $scope.orgs = data[data.length - 1].orgs.substr(1, data[data.length - 1].orgs.length - 2);

                $scope.geoJsonLayerString = "[" + $scope.streets + "," + $scope.buildings + "," + $scope.orgs + "]";
                console.log("!!!!!!!!!!!!!!!!  " + $scope.geoJsonLayerString + "    !!!!!!!!!!!!!!!!  ");

                console.log("STREETSTEST" + $scope.streets);
                console.log("BUILDINGSTEST" + $scope.buildings);
                console.log("ORGSTEST" + $scope.orgs);

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