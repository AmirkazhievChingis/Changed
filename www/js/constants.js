/**
 * Created by Azamat_Nurzhanuly on 03.11.16.
 */
angular.module('starter.constants', [])

.constant('GeoApiService', {
    url: '/api'
})
.constant('streetsURL', 'http://eip.geoportal.kz/eip/pull-data?section=street&kato=431010000')
.constant('buildingsURL', 'http://eip.geoportal.kz/eip/pull-data?section=building&kato=431010000')
.constant('orgsURL', 'http://eip.geoportal.kz/eip/pull-data?section=org&kato=431010000')
.constant('tilesURL', 'http://www.obl.kz/ArcGIS/rest/services/Topo_KZ_2016/MapServer/tile/{z}/{y}/{x}')
.constant('centerPoint', new L.LatLng(44.85278, 65.50917))
.constant('southWestBound', new L.LatLng(44.771862, 65.435981))
.constant('northEastBound', new L.LatLng(44.896843, 65.581812))
.constant('transparent', 'rgba(0, 0, 0, 0)')
.constant('fillColorLocationFound', 'rgba(255, 1, 0, 0.7)')
.constant('colorLocationFound', 'rgba(255, 1, 0, 0.7)');