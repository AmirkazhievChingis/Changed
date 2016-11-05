/**
 * Created by Azamat_Nurzhanuly on 03.11.16.
 */
angular.module('starter.services', ['ngCordova', 'ngResource'])

    .factory('GeoLayer', function ($q, $http, GeoApiService, $cordovaFile) {

        var getHttpGeoJson = function() {

            return $http.get('http://eip.geoportal.kz/eip/pull-data?section=street&kato=431010000');
                // .then(function(data){
                //     console.log("DATA FROM GEOJSON   " + JSON.stringify(data));
                //     return data;
                // });
        };

        var getGeoJsonDataFromFile = function () {

            // var assetsPath = JSON.stringify(cordova.file.applicationDirectory + 'www/');

            $cordovaFile.checkDir(cordova.file.applicationDirectory, 'www')
                .then(function (directory) {

                    console.log("SUCCESS TEST " + JSON.stringify(directory));

                    console.log("ASDASDASD " + directory.nativeURL);

                    $cordovaFile.createFile(directory.nativeURL, 'test.txt', true)
                        .then(function (file) {

                            console.log("SUCCESS TESTFILE " + JSON.stringify(file));
                        }, function (error) {

                            console.log("ERROR TESTFILE" + JSON.stringify(error));
                        });
                }, function (error) {
                    console.log("ERROR TEST" + JSON.stringify(error));
                });

            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" +
                "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" +
                "!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + cordova.file.applicationDirectory + 'www/');

            var deferred = $q.defer();

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
                                            console.log("We READ THE FILE    " + jsonStringReadFromFile.length);
                                            deferred.resolve(jsonStringReadFromFile);
                                        };

                                        reader.readAsText(file);

                                    }, function (err) {
                                        console.log("Error reading streets.json is not existed file " + JSON.stringify(err));
                                        deferred.reject("Error reading streets.json is not existed file " + JSON.stringify(err));
                                    });
                                }, function (error) {

                                    console.log("Didn't find streets.json after finding whole directories " + JSON.stringify(error));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'streets.json', false)
                                        .then(function (streetsFile) {
                                            console.log("File created " + JSON.stringify(streetsFile));

                                            getHttpGeoJson().then(function (data) {

                                                streetsFile.createWriter(function (fileWriter) {

                                                    fileWriter.onwriteend = function () {
                                                        console.log("Successful file write... " + JSON.stringify(data.data).length);

                                                        deferred.resolve(JSON.stringify(data.data));

                                                        // streetsFile.file(function (file) {
                                                        //     var reader = new FileReader();
                                                        //
                                                        //     reader.onloadend = function () {
                                                        //
                                                        //         jsonStringReadFromFile = this.result;
                                                        //         console.log("AAAAAAAA    " + jsonStringReadFromFile.length);
                                                        //     };
                                                        //
                                                        //     reader.readAsText(file);
                                                        //
                                                        // }, function (err) {
                                                        //     console.log("Error reading streets.json is not existed file " + JSON.stringify(err));
                                                        // });
                                                    };

                                                    fileWriter.onerror = function (e) {
                                                        console.log("Failed file write: " + JSON.stringify(e));
                                                        deferred.reject("Failed file write: " + JSON.stringify(e));
                                                    };

                                                    fileWriter.write(JSON.stringify(data.data));

                                                }, function (error) {
                                                    console.log("Error creating fileWriter " + JSON.stringify(error));
                                                    deferred.reject("Error creating fileWriter " + JSON.stringify(error));
                                                });

                                            }, function (error) {
                                                console.log(JSON.stringify(error));
                                                deferred.reject(JSON.stringify(error));
                                            });

                                        }, function (error) {
                                            console.log("Error creating file " + JSON.stringify(error));
                                            deferred.reject("Error creating file " + JSON.stringify(error));
                                        });
                                });

                        }, function (error) {

                            console.log("Eror finding OfflineMap/mapsGeometry after finding OfflineMap " + JSON.stringify(error));

                            $cordovaFile.createDir(cordova.file.dataDirectory + 'OfflineMap', 'mapsGeometry', false)
                                .then(function (geomDirectory) {
                                    console.log("successful created dir OfflineMap/mapsGeometry " + JSON.stringify(geomDirectory));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'streets.json', false)
                                        .then(function (streetsFile) {
                                            console.log("File created " + JSON.stringify(streetsFile));

                                            getHttpGeoJson().then(function (data) {

                                                streetsFile.createWriter(function (fileWriter) {

                                                    fileWriter.onwriteend = function () {
                                                        console.log("Successful file write... " + JSON.stringify(data.data).length);

                                                        deferred.resolve(JSON.stringify(data.data));

                                                        // streetsFile.file(function (file) {
                                                        //     var reader = new FileReader();
                                                        //
                                                        //     reader.onloadend = function () {
                                                        //
                                                        //         jsonStringReadFromFile = this.result;
                                                        //         console.log("AAAAAAAA    " + jsonStringReadFromFile.length);
                                                        //     };
                                                        //
                                                        //     reader.readAsText(file);
                                                        //
                                                        // }, function (err) {
                                                        //     console.log("Error reading streets.json is not existed file " + JSON.stringify(err));
                                                        // });
                                                    };

                                                    fileWriter.onerror = function (e) {
                                                        console.log("Failed file write: " + JSON.stringify(e));
                                                        deferred.reject("Failed file write: " + JSON.stringify(e));
                                                    };

                                                    fileWriter.write(JSON.stringify(data.data));

                                                }, function (error) {
                                                    console.log("Error creating fileWriter " + JSON.stringify(error));
                                                    deferred.reject("Error creating fileWriter " + JSON.stringify(error));
                                                });

                                            }, function (error) {
                                                console.log(JSON.stringify(error));
                                                deferred.reject(JSON.stringify(error));
                                            });

                                        }, function (error) {
                                            console.log("Error creating file " + JSON.stringify(error));
                                            deferred.reject("Error creating file " + JSON.stringify(error));
                                        });
                                }, function (error) {
                                    console.log(JSON.stringify(error));
                                    deferred.reject(JSON.stringify(error));
                                });
                        });

                }, function (error) {
                    console.log(JSON.stringify(error));

                    $cordovaFile.createDir(cordova.file.dataDirectory, 'OfflineMap', false)
                        .then(function (directory) {

                            console.log("successful created dir OfflineMap " + JSON.stringify(directory));

                            $cordovaFile.createDir(cordova.file.dataDirectory + 'OfflineMap', 'mapsGeometry', false)
                                .then(function (geomDirectory) {
                                    console.log("successful created dir OfflineMap/mapsGeometry " + JSON.stringify(geomDirectory));

                                    $cordovaFile.createFile(cordova.file.dataDirectory + 'OfflineMap/mapsGeometry', 'streets.json', false)
                                        .then(function (streetsFile) {
                                            console.log("File created " + JSON.stringify(streetsFile));

                                            getHttpGeoJson().then(function (data) {

                                                streetsFile.createWriter(function (fileWriter) {

                                                    fileWriter.onwriteend = function () {
                                                        console.log("Successful file write... " + JSON.stringify(data.data).length);

                                                        deferred.resolve(JSON.stringify(data.data));

                                                        // streetsFile.file(function (file) {
                                                        //     var reader = new FileReader();
                                                        //
                                                        //     reader.onloadend = function () {
                                                        //
                                                        //         jsonStringReadFromFile = this.result;
                                                        //         console.log("AAAAAAAA    " + jsonStringReadFromFile.length);
                                                        //     };
                                                        //
                                                        //     reader.readAsText(file);
                                                        //
                                                        // }, function (err) {
                                                        //     console.log("Error reading streets.json is not existed file " + JSON.stringify(err));
                                                        // });
                                                    };

                                                    fileWriter.onerror = function (e) {
                                                        console.log("Failed file write: " + JSON.stringify(e));
                                                        deferred.reject("Failed file write: " + JSON.stringify(e));
                                                    };

                                                    fileWriter.write(JSON.stringify(data.data));

                                                }, function (error) {
                                                    console.log("Error creating fileWriter " + JSON.stringify(error));
                                                    deferred.reject("Error creating fileWriter " + JSON.stringify(error));
                                                });

                                            }, function (error) {
                                                console.log(JSON.stringify(error));
                                                deferred.reject(JSON.stringify(error));
                                            });

                                        }, function (error) {
                                            console.log("Error creating file " + JSON.stringify(error));
                                            deferred.reject("Error creating file " + JSON.stringify(error));
                                        });
                                }, function (error) {
                                    console.log(JSON.stringify(error));
                                    deferred.reject(JSON.stringify(error));
                                });
                        }, function (error) {
                            console.log(JSON.stringify(error));
                            deferred.reject(JSON.stringify(error));
                        });
                });

            return deferred.promise;
        };

        return {
            getHttpGeoJson: getHttpGeoJson,
            getGeoJsonDataFromFile: getGeoJsonDataFromFile
        }
    })
.factory('Building', function($resource){
    return $resource('http://eip.geoportal.kz/eip/pull-data?section=building&kato=431010000');
});