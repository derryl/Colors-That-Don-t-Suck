window.log  = console.log.bind( console );
window.err  = console.error.bind( console );
window.glog = function( msg ) { log( '%c' + msg, 'color: green' ); }

window.DEBUG_MODE = false;

//
//  MODULE
//
window.CTDS = angular.module( 'CTDS', [ 'ngRoute', 'LocalStorageModule', 'ngClipboard' ]).config([
    '$compileProvider', function($compileProvider) {
        return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|rdar|mailto|chrome-extension):/);
    }
]).config([
    'ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath('flash/ZeroClipboard.swf');
    }
]);

//
//  CONTROLLER
//
CTDS.controller( 'mainController', function($scope, localStorageService, $rootScope, $filter, $http, $timeout, $sce) {
    
    var $$ = $scope;
    window.scope = $$;
    
    $$.debug_mode = DEBUG_MODE;
    
    $$.heading = "Here are some colors that don't suck.";
    $$.linkText = "Actually, those kinda sucked ... hit me again.";
    
    var store = localStorageService;
    
    $$.init = function() {
        $$.generateColors();
    };
    
    // Refresh color choices
    $$.refresh = function() {
        $$.randomizeMessaging();
        $$.generateColors();
    };
    
    // Generate random number between ceiling and floor
    window.random = function(ceiling, floor) {
        var floor = floor || 0;
        return (Math.random() * (ceiling - floor)) + floor;
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
    
    $$.formatValue = function(val) {
        return Math.round(val * 100) / 100;
    };
    
    $$.generateColors = function() {
        
        $$.type = randomSchemeType();
        $$.hue  = random(360);
        $$.saturation = random(0.8,0.6),
        $$.value = random(0.8,0.6)
        
        $$.colors = Please.make_scheme(
        {
            h: $$.hue,
            s: $$.saturation,
            v: $$.value
        },{
            scheme_type: $$.type,
            format: 'hex'
        });
        
        if (DEBUG_MODE) {
            logColorSettings();
        }
        
        
        $timeout( function() { morphie() });
        $timeout( function() { $('button')[0].click() } )
    }
    
    $$.copiedSASS = function() {
        $$.justCopiedSASS = true;
        $timeout( function() {
            $$.justCopiedSASS = false;
        }, 1500);
    };
    
    $$.copiedLESS = function() {
        $$.justCopiedLESS = true;
        $timeout( function() {
            $$.justCopiedLESS = false;
        }, 1500);
    };
    
    $$.copiedJS = function() {
        $$.justCopiedJS = true;
        $timeout( function() {
            $$.justCopiedJS = false;
        }, 1500);
    };
    
    
    function logColorSettings() {
        log('Hue:', $$.formatValue( $$.hue ));
        log('Sat:', $$.formatValue( $$.saturation ));
        log('Val:', $$.formatValue( $$.value ));
        log($$.colors);
    }
    
    $$.getCode = function(color, format) {
        switch( format ) {
            case 'sass': return '$my-color: ' + color + ';';
            case 'less': return '@my-color: ' + color + ';';
            case 'js':   return 'var myColor = ' + color + ';';
        }
    }
    
    
    $$.init();
    // $$.api.getPictures(17993529);
});
