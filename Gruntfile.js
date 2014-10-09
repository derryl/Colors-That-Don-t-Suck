
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
                src: ['**/*'],
                cwd: 'src/',
                dest: 'dist',
                expand: true
            },
            // js: {
            //     src: ['**/*.js'],
            //     cwd: 'src/',
            //     dest: 'dist',
            //     expand: true
            // },
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
                files: ['src/**/*.html','src/**/*.js','src/**/*.css'],
                tasks: ['copy']
            },
            
            // includes: {
            //     files: 'templates/*.html',
            //     tasks: ['includes']
            // },
            dist: {
                files: [
                    'dist/*.html',
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
        
        
        // Concatenate bower components
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
        },
        
        // Append additional vendor components
        concat: {
            dist: {
                src: [
                    'dist/scripts/vendor.js',
                    'src/scripts/vendor/modernizr.custom.js',
                    'src/scripts/vendor/classie.js',
                    'src/scripts/vendor/uiMorphingButton_fixed.js'
                ],
                dest: 'dist/scripts/vendor.js'
            }
        },
        
        shell: {
            openBrowser: {
                command: 'open http://0.0.0.0:' + server_port
            }
        },
        
        
        
        // Comment out the aws stuff if you're seeing errors. It will fail for you,
        // because you don't have a copy of my AWS keys locally :)
        aws: grunt.file.readJSON('config/grunt-aws.json'),
        
        // www.colorsthatdontsuck.com
        // www.colorsthatdontsuck.com.s3-website-us-east-1.amazonaws.com
        
        aws_s3: {
            options: {
                accessKeyId:     '<%= aws.key %>',
                secretAccessKey: '<%= aws.secret %>',
                region: 'us-east-1',
                uploadConcurrency: 15
            },
            staging_gzipped: {
                options: { 
                    bucket: 'www.colorsthatdontsuck.com',
                    params: { 
                        // ContentEncoding: 'gzip',
                        CacheControl: 'max-age=60'
                    }
                },
                files: [{ expand: true, cwd: 'dist/', src: ['**/*'], dest: ''}]
            }
        },
        
        // includes: {
        //     files: {
        //         src: ['templates/index.html'],
        //         includePath: ['templates'],
        //         dest: '.',
        //         flatten: true
        //     }
        // }
        
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-aws-s3');

    // grunt.registerTask('build', ['sass', 'includes', 'copy']);
    
    grunt.registerTask('deploy', [
        'build',
        'aws_s3'    
    ])
    
    grunt.registerTask('build', [
        // 'sass', 
        // 'includes',
        'copy',
        'less',
        'bower_concat',
        'concat'
    ]);
    
    grunt.registerTask('default', [
        'clean',
        'build',
        'connect',
        'shell:openBrowser',
        'watch'
    ]);
}