/**
 * Created by Azamat_Nurzhanuly on 03.11.16.
 */
angular.module('starter.services', ['ngCordova', 'ngResource', 'starter.constants'])

    .factory('GeoLayer', function ($timeout, $q, $http, GeoApiService, $cordovaFile, streetsURL, buildingsURL, orgsURL) {

        var jsonObj = {
            streets: "",
            buildings: "",
            orgs: ""
        };

        var promises = [];

        var getHttpGeoJsonStreets = function() {

            return $http.get(streetsURL);
        };

        var getHttpGeoJsonBuildings = function() {

            return $http.get(buildingsURL);
        };

        var getHttpGeoJsonOrgs = function() {

            return $http.get(orgsURL);
        };

        var getStreets = function(streetsFile, deferred) {
            getHttpGeoJsonStreets().then(function (data) {

                streetsFile.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        console.log("Successful file write streets.json... " + JSON.stringify(data.data).length);

                        jsonObj.streets = JSON.stringify(data.data);
                        deferred.resolve(jsonObj);

                        //COMMENT JUST FOR TESTING ONLY
                        streetsFile.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {

                                jsonStringReadFromFile = this.result;
                                console.log("Check streets.json read the same    " + jsonStringReadFromFile.length);
                            };

                            reader.readAsText(file);

                        }, function (err) {
                            console.log("Error reading streets.json is not existed file " + JSON.stringify(err));
                        });
                        //COMMENT JUST FOR TESTING ONLY
                    };

                    fileWriter.onerror = function (e) {
                        console.log("Failed streets.json file write: " + JSON.stringify(e));
                        deferred.reject("Failed streets.json file write: " + JSON.stringify(e));
                    };

                    fileWriter.write(JSON.stringify(data.data));

                }, function (error) {
                    console.log("Error creating fileWriter streets.json " + JSON.stringify(error));
                    deferred.reject("Error creating fileWriter streets.json " + JSON.stringify(error));
                });

            }, function (error) {
                console.log(JSON.stringify(error));
                deferred.reject(JSON.stringify(error));
            });
        };

        var getBuildings = function(buildingsFile, deferred) {
            //TODO: TEST WHILE BUILDINGS NOT OPTIMIZED
            $timeout(function () {

                jsonObj.buildings = "NONE";
                deferred.resolve(jsonObj);
            }, 5000);
            //TODO: TEST ABOVE

            // getHttpGeoJsonBuildings().then(function (data) {
            //
            //     buildingsFile.createWriter(function (fileWriter) {
            //
            //         fileWriter.onwriteend = function () {
            //             console.log("Successful file write buildings.json... " + JSON.stringify(data.data).length);
            //
            //             jsonObj.buildings = JSON.stringify(data.data);
            //             deferred.resolve(jsonObj);
            //
            //             //COMMENT JUST FOR TESTING ONLY
            //             buildingsFile.file(function (file) {
            //                 var reader = new FileReader();
            //
            //                 reader.onloadend = function () {
            //
            //                     jsonStringReadFromFile = this.result;
            //                     console.log("Check buildings.json read the same    " + jsonStringReadFromFile.length);
            //                 };
            //
            //                 reader.readAsText(file);
            //
            //             }, function (err) {
            //                 console.log("Error reading buildings.json is not existed file " + JSON.stringify(err));
            //             });
            //             //COMMENT JUST FOR TESTING ONLY
            //         };
            //
            //         fileWriter.onerror = function (e) {
            //             console.log("Failed buildings.json file write: " + JSON.stringify(e));
            //             deferred.reject("Failed buildings.json file write: " + JSON.stringify(e));
            //         };
            //
            //         fileWriter.write(JSON.stringify(data.data));
            //
            //     }, function (error) {
            //         console.log("Error creating fileWriter buildings.json " + JSON.stringify(error));
            //         deferred.reject("Error creating fileWriter buildings.json " + JSON.stringify(error));
            //     });
            //
            // }, function (error) {
            //     console.log(JSON.stringify(error));
            //     deferred.reject(JSON.stringify(error));
            // });
        };

        var getOrgs = function(orgsFile, deferred) {
            getHttpGeoJsonOrgs().then(function (data) {

                orgsFile.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function () {
                        console.log("Successful file write orgs.json... " + JSON.stringify(data.data).length);

                        jsonObj.orgs = JSON.stringify(data.data);
                        deferred.resolve(jsonObj);

                        //COMMENT JUST FOR TESTING ONLY
                        orgsFile.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {

                                jsonStringReadFromFile = this.result;
                                console.log("Check orgs.json read the same    " + jsonStringReadFromFile.length);
                            };

                            reader.readAsText(file);

                        }, function (err) {
                            console.log("Error reading orgs.json is not existed file " + JSON.stringify(err));
                        });
                        //COMMENT JUST FOR TESTING ONLY
                    };

                    fileWriter.onerror = function (e) {
                        console.log("Failed orgs.json file write: " + JSON.stringify(e));
                        deferred.reject("Failed orgs.json file write: " + JSON.stringify(e));
                    };

                    fileWriter.write(JSON.stringify(data.data));

                }, function (error) {
                    console.log("Error creating fileWriter orgs.json " + JSON.stringify(error));
                    deferred.reject("Error creating fileWriter orgs.json " + JSON.stringify(error));
                });

            }, function (error) {
                console.log(JSON.stringify(error));
                deferred.reject(JSON.stringify(error));
            });
        };

        var getGeoJsonDataFromFile = function () {

            // var assetsPath = JSON.stringify(cordova.file.applicationDirectory + 'www/');
            //TODO: TESTING DOESNT METTER
            // $cordovaFile.checkDir(cordova.file.applicationDirectory, 'www')
            //     .then(function (directory) {
            //
            //         console.log("SUCCESS TEST " + JSON.stringify(directory));
            //
            //         console.log("ASDASDASD " + directory.nativeURL);
            //
            //         $cordovaFile.createFile(directory.nativeURL, 'test.txt', true)
            //             .then(function (file) {
            //
            //                 console.log("SUCCESS TESTFILE " + JSON.stringify(file));
            //             }, function (error) {
            //
            //                 console.log("ERROR TESTFILE" + JSON.stringify(error));
            //             });
            //     }, function (error) {
            //         console.log("ERROR TEST" + JSON.stringify(error));
            //     });
            //
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" +
            //     "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" +
            //     "!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + cordova.file.applicationDirectory + 'www/');

            promises = [];

            var deferred_streets = $q.defer(),
                deferred_buildings = $q.defer(),
                deferred_orgs = $q.defer();

            promises.push(deferred_streets.promise);
            promises.push(deferred_buildings.promise);
            promises.push(deferred_orgs.promise);

            $cordovaFile.checkDir(cordova.file.dataDirectory, 'OfflineMap')
                .then(function (directory) {

                    console.log("successful find dir OfflineMap" + JSON.stringify(directory));

                    $cordovaFile.checkDir(cordova.file.dataDirectory, 'OfflineMap/mapsGeometry')
                        .then(function (mapDirectory) {

                            console.log("Successfully found the mapDirectory " + JSON.stringify(mapDirectory));

                            $cordovaFile.checkFile(mapDirectory.nativeURL, 'streets.json')
                                .then(function (streetsFile) {

                                    console.log("We found file streets.json  " + JSON.stringify(streetsFile));

                                    streetsFile.file(function (file) {
                                        var reader = new FileReader();

                                        reader.onloadend = function () {

                                            jsonStringReadFromFile = this.result;
                                            console.log("We READ THE FILE  STREETS.JSON  " + jsonStringReadFromFile.length);
                                            jsonObj.streets = jsonStringReadFromFile;

                                            deferred_streets.resolve(jsonObj);
                                        };

                                        reader.readAsText(file);

                                    }, function (err) {
                                        console.log("Error reading streets.json is not existed file " + JSON.stringify(err));
                                        deferred_streets.reject("Error reading streets.json is not existed file " + JSON.stringify(err));
                                    });
                                }, function (error) {

                                    console.log("Didn't find streets.json after finding whole directories " + JSON.stringify(error));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'streets.json', true)
                                        .then(function (streetsFile) {
                                            console.log("File streets.json created " + JSON.stringify(streetsFile));

                                            getStreets(streetsFile, deferred_streets);

                                        }, function (error) {
                                            console.log("Error creating streets.json file " + JSON.stringify(error));
                                            deferred_streets.reject("Error creating streets.json file " + JSON.stringify(error));
                                        });
                                });

                            $cordovaFile.checkFile(mapDirectory.nativeURL, 'buildings.json')
                                .then(function (buildingsFile) {

                                    console.log("We found file buildings.json  " + JSON.stringify(buildingsFile));

                                    buildingsFile.file(function (file) {
                                        var reader = new FileReader();

                                        reader.onloadend = function () {

                                            jsonStringReadFromFile = this.result;
                                            console.log("We READ THE FILE  BUILDINGS.JSON  " + jsonStringReadFromFile.length);
                                            jsonObj.buildings = jsonStringReadFromFile;
                                            deferred_buildings.resolve(jsonObj);
                                        };

                                        reader.readAsText(file);

                                    }, function (err) {
                                        console.log("Error reading buildings.json is not existed file " + JSON.stringify(err));
                                        deferred_buildings.reject("Error reading buildings.json is not existed file " + JSON.stringify(err));
                                    });
                                }, function (error) {

                                    console.log("Didn't find buildings.json after finding whole directories " + JSON.stringify(error));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'buildings.json', true)
                                        .then(function (buildingsFile) {
                                            console.log("File buildings.json created " + JSON.stringify(buildingsFile));

                                            getBuildings(buildingsFile, deferred_buildings);

                                        }, function (error) {
                                            console.log("Error creating buildings.json file " + JSON.stringify(error));
                                            deferred_buildings.reject("Error creating buildings.json file " + JSON.stringify(error));
                                        });
                                });

                            $cordovaFile.checkFile(mapDirectory.nativeURL, 'orgs.json')
                                .then(function (orgsFile) {

                                    console.log("We found file orgs.json  " + JSON.stringify(orgsFile));

                                    orgsFile.file(function (file) {
                                        var reader = new FileReader();

                                        reader.onloadend = function () {

                                            jsonStringReadFromFile = this.result;
                                            console.log("We READ THE FILE  orgs.JSON  " + jsonStringReadFromFile.length);
                                            jsonObj.orgs = jsonStringReadFromFile;
                                            deferred_orgs.resolve(jsonObj);
                                        };

                                        reader.readAsText(file);

                                    }, function (err) {
                                        console.log("Error reading orgs.json is not existed file " + JSON.stringify(err));
                                        deferred_orgs.reject("Error reading orgs.json is not existed file " + JSON.stringify(err));
                                    });
                                }, function (error) {

                                    console.log("Didn't find orgs.json after finding whole directories " + JSON.stringify(error));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'orgs.json', true)
                                        .then(function (orgsFile) {
                                            console.log("File orgs.json created " + JSON.stringify(orgsFile));

                                            getOrgs(orgsFile, deferred_orgs);

                                        }, function (error) {
                                            console.log("Error creating orgs.json file " + JSON.stringify(error));
                                            deferred_orgs.reject("Error creating orgs.json file " + JSON.stringify(error));
                                        });
                                });

                        }, function (error) {

                            console.log("Eror finding OfflineMap/mapsGeometry after finding OfflineMap " + JSON.stringify(error));

                            $cordovaFile.createDir(cordova.file.dataDirectory + 'OfflineMap', 'mapsGeometry', true)
                                .then(function (geomDirectory) {
                                    console.log("successful created dir OfflineMap/mapsGeometry " + JSON.stringify(geomDirectory));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'streets.json', true)
                                        .then(function (streetsFile) {
                                            console.log("File streets.json created " + JSON.stringify(streetsFile));

                                            getStreets(streetsFile, deferred_streets);

                                        }, function (error) {
                                            console.log("Error creating streets.json file " + JSON.stringify(error));
                                            deferred_streets.reject("Error creating streets.json file " + JSON.stringify(error));
                                        });

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'buildings.json', true)
                                        .then(function (buildingsFile) {
                                            console.log("File created buildings.json " + JSON.stringify(buildingsFile));

                                            getBuildings(buildingsFile, deferred_buildings);

                                        }, function (error) {
                                            console.log("Error creating buildings.json file " + JSON.stringify(error));
                                            deferred_buildings.reject("Error creating buildings.json file " + JSON.stringify(error));
                                        });

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'orgs.json', true)
                                        .then(function (orgsFile) {
                                            console.log("File created orgs.json " + JSON.stringify(orgsFile));

                                            getOrgs(orgsFile, deferred_orgs);

                                        }, function (error) {
                                            console.log("Error creating orgs.json file " + JSON.stringify(error));
                                            deferred_orgs.reject("Error creating orgs.json file " + JSON.stringify(error));
                                        });

                                }, function (error) {
                                    console.log(JSON.stringify(error));
                                    //No matter what type of error will be deferred random object;
                                    deferred_streets.reject(JSON.stringify(error));
                                });
                        });

                }, function (error) {
                    console.log(JSON.stringify(error));

                    $cordovaFile.createDir(cordova.file.dataDirectory, 'OfflineMap', true)
                        .then(function (directory) {

                            console.log("successful created dir OfflineMap " + JSON.stringify(directory));

                            $cordovaFile.createDir(cordova.file.dataDirectory + 'OfflineMap', 'mapsGeometry', true)
                                .then(function (geomDirectory) {
                                    console.log("successful created dir OfflineMap/mapsGeometry " + JSON.stringify(geomDirectory));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'streets.json', true)
                                        .then(function (streetsFile) {
                                            console.log("File streets.json created " + JSON.stringify(streetsFile));

                                            getStreets(streetsFile, deferred_streets);

                                        }, function (error) {
                                            console.log("Error creating streets.json file " + JSON.stringify(error));
                                            deferred_streets.reject("Error creating streets.json file " + JSON.stringify(error));
                                        });

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'buildings.json', true)
                                        .then(function (buildingsFile) {
                                            console.log("File created buildings.json " + JSON.stringify(buildingsFile));

                                            getBuildings(buildingsFile, deferred_buildings);

                                        }, function (error) {
                                            console.log("Error creating buildings.json file " + JSON.stringify(error));
                                            deferred_buildings.reject("Error creating buildings.json file " + JSON.stringify(error));
                                        });

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'orgs.json', true)
                                        .then(function (orgsFile) {
                                            console.log("File created orgs.json " + JSON.stringify(orgsFile));

                                            getOrgs(orgsFile, deferred_orgs);

                                        }, function (error) {
                                            console.log("Error creating orgs.json file " + JSON.stringify(error));
                                            deferred_orgs.reject("Error creating orgs.json file " + JSON.stringify(error));
                                        });

                                }, function (error) {
                                    console.log(JSON.stringify(error));
                                    //NO Matter
                                    deferred_streets.reject(JSON.stringify(error));
                                });
                        }, function (error) {
                            console.log(JSON.stringify(error));
                            deferred_streets.reject(JSON.stringify(error));
                        });
                });

            console.log("TESTTEST" + promises.length);

            return $q.all(promises);
        };

        return {
            getHttpGeoJsonStreets: getHttpGeoJsonStreets,
            getHttpGeoJsonBuildings: getHttpGeoJsonBuildings,
            getHttpGeoJsonOrgs: getHttpGeoJsonOrgs,
            getGeoJsonDataFromFile: getGeoJsonDataFromFile
        }
    })
.factory('Building', function ($resource, buildingsURL) {
    return $resource(buildingsURL);
})

    .factory('sharedPositionService', function ($rootScope) {
        var sharedPosition = {};
        sharedPosition.sendPosition = function (position) {

            this.sharedPosition = position;

        };
        console.log("POSITION IN SERVICE " + JSON.stringify(sharedPosition));
        return sharedPosition;

    });
