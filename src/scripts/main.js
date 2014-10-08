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
    
    $$.heading = "Here are some colors that don't suck.";
    $$.linkText = "Actually, those kinda sucked ... hit me again.";
    // $$.debug_mode = true;
    
    var store = localStorageService;
    
    $$.init = function() {
        // $$.randomizeHeader();
        $$.generateColors();
    };
    
    $$.refresh = function() {
        $$.randomizeMessaging();
        $$.generateColors();
    };
    
    var random = function(ceiling, floor) {
        var floor = floor || 0;
        return (Math.random() * ceiling) + floor;
    }
    
    $$.please = window.Please;
    
    $$.lastIndex = null;
    
    $$.randomizeMessaging = function() {
        
        var headers = [
            "What about these ones?",
            "Try these on some buttons.",
            "You won't find these in Bootstrap.",
            "If these came on sneakers - I'd wear em.",
            "These would make some bitchin' Crayons.",
            "These might do the trick.",
            "If these don't work - you'd better revisit those wireframes.",
            "Hot damn! These are ready to go.",
            "These look pretty slick.",
            "How bout these ones?"
        ], links = [
            "Those actually sucked worse than before.",
            "Ehh, I'd be better off going Aqua.",
            "I actually prefer theirs. Let's see some more.",
            "Yeah, I bet you would.",
            "You must've eaten glue as a kid. Hit me again.",
            "Maybe ... if my clients were baboons.",
            "Actually, my wireframes are just fine.",
            "Nah, I think we can do better.",
            "Yeah, but let's try another set.",
            "Maybe if I was still in design school."
        ]
        
        var index = $$.lastIndex;
        
        while (index === $$.lastIndex) {
            index = Math.floor(Math.random()*headers.length);
        };
        
        $$.lastIndex =  index;
        
        $$.heading = headers[index];
        $$.linkText = links[index];
    };
    
    var randomSchemeType = function() {
        var types = [
            // "mono",
            "triadic",
            "complementary",
            // "double-complementary",
            // "split-complementary",
            // "analogous"
        ];
        return types[Math.floor(Math.random()*types.length)]
    };
    
    $$.shadeColor = function(color, percent) {  
        var num = parseInt(color.split('#').join(''),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    };
    
    $$.generateColors = function() {
        
        $$.type = randomSchemeType();
        $$.hue  = random(360);
        $$.saturation = random(0.2,0.6),
        $$.value = random(0.2,0.6)
        
        $$.colors = Please.make_scheme(
        {
            h: $$.hue,
            s: $$.saturation,
            v: $$.value
            // s: .7,
            // v: .6
        },
        {
            scheme_type: $$.type,
            format: 'hex'
        });
        log($$.colors)
    }
    
    $$.init();
    // $$.api.getPictures(17993529);
});
