var app = angular.module('magogApp', ['ui.bootstrap', 'ui.router', 'angular-spinkit']);

angular.module('magogApp').config(function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html',
            controller: 'aboutCtrl'
        })
        .state('map', {
            url: '/map/:id',
            templateUrl: 'partials/map.html',
            controller: 'mapCtrl'
        })
        .state('chart', {
            url: '/chart/:id',
            templateUrl: 'partials/chart.html',
            controller: 'chartCtrl'
        })
        .state('list', {
            url: '/list/:id',
            templateUrl: 'partials/list.html',
            controller: 'listCtrl'
        })
        .state('diag', {
            url: '/diag/:id',
            templateUrl: 'partials/diag.html',
            controller: 'diagCtrl'
        });
}).run(function($state) {
    $state.go('home');
})