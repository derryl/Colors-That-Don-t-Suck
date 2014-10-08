window.log = console.log.bind(console);
window.err = console.error.bind(console);
window.glog = function(msg) { log('%c' + msg, 'color: green'); }

//
//  MODULE
//
window.CTDS = angular.module( 'CTDS', ['ngRoute', 'LocalStorageModule']).config([
    '$compileProvider', function($compileProvider) {
        return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|rdar|mailto|chrome-extension):/);
    }
]);

//
//  ROUTES
//
// CTDS.config( function( $routeProvider ) {
//     $routeProvider.when('/home', {
//         templateUrl: 'colors.html',
//         controller:  'mainController'
//     }).otherwise({ redirectTo: '/home' });
//     return false;
// });


//
//  CONTROLLER
//
CTDS.controller( 'mainController', function($scope, localStorageService, $rootScope, $filter, $http, $timeout, $sce) {
    
    var $$ = $scope;
    window.scope = $$;
    $$.message = "HELLO";
    
    var store = localStorageService;
    
    // $$.firstRun = true;
    // $$.modals = {};
    
    var init = function() {
        $$.createColors();
    };
    
    var random = function(ceiling, floor) {
        var floor = floor || 0;
        return (Math.random() * ceiling) + floor;
    }
    
    var randomSchemeType = function() {
        var types = [
            // "mono",
            "triadic",
            "complementary",
            // "double-complementary",
            "split-complementary",
            "analogous"
        ];
        return types[Math.floor(Math.random()*types.length)]
    }
    
    $$.createColors = function() {
        
        var type = randomSchemeType();
        log(type)
        
        $$.colors = Please.make_scheme(
        {
            h: random(360),
            s: random(0.7,0.6),
            v: random(0.7,0.5)
            // s: .7,
            // v: .6
        },
        {
            scheme_type: type,
            format: 'rgb-string'
        });
        log($$.colors)
    }
    
    init();
    // $$.api.getPictures(17993529);
});
