
var server_port = 8799;

module.exports = function(grunt) {
    
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    port: server_port,
                    base: 'dist',
                    hostname: '*',
                    // open: true
                }
            }
        },
        
        clean: {
            dist: ['dist']
        },
        
        copy: {
            main: {
                src: ['*'],
                cwd: 'src/',
                dest: 'dist',
                expand: true
            },
            js: {
                src: ['**/*.js'],
                cwd: 'src/',
                dest: 'dist',
                expand: true
            }
        },
        
        watch: {
            grunt: { 
                files: ['Gruntfile.js']
            },
            less: {
                files: 'src/**/*.less',
                tasks: ['less']
            },
            src: {
                files: ['src/**/*.html','src/**/*.js'],
                tasks: ['copy']
            },
            
            // includes: {
            //     files: 'templates/*.html',
            //     tasks: ['includes']
            // },
            dist: {
                files: [
                    'dist/**/*.html',
                    'dist/**/*.js',
                    'dist/**/*.css'
                ],
                options: { livereload: true }
            }
        },
        
        less: {
            master: {
                files: {
                    'dist/styles/master.css': 'src/styles/master.less'
                }
            }  
        },
        
        bower_concat: {
            all: {
                dest: 'dist/scripts/vendor.js',
                dependencies: {
                    'underscore': 'jquery',
                    'angular-sanitize': 'angular',
                    'angular-route': 'angular'
                },
                mainFiles: {
                    'pleasejs': 'dist/Please.js'
                }
            }
        }
        
        // includes: {
        //     files: {
        //         src: ['templates/index.html'],
        //         includePath: ['templates'],
        //         dest: '.',
        //         flatten: true
        //     }
        // }
        
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-concat');
    // grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // grunt.registerTask('build', ['sass', 'includes', 'copy']);
    
    grunt.registerTask('build', [
        // 'sass', 
        // 'includes',
        'copy',
        'less',
        'bower_concat'
    ]);
    
    grunt.registerTask('default', [
        'clean',
        'build',
        'connect',
        'watch'
    ]);
}