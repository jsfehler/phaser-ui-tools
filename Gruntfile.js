module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {separator: ';'},
            dist: {
                src: ['src/utils.js', 'src/containers/frame.js', 'src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        copy: {
            main: {
                src: 'dist/phaser-ui-tools.js',
                dest: 'docs/examples/lib/phaser-ui-tools.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']}
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'tests/*.js']
        },
        jsdoc: {
            dist: {
                src: ['src/**/*.js'],
                options: {
                    destination: 'docs',
                    template : "node_modules/ink-docstrap/template",
                    configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },
        mocha: {
            all: {
                src: ['tests/testrunner.html']
            },
            options: {
                run: false,
                page: {
                    settings: {
                        webSecurityEnabled: false,
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('default', ['jshint', 'mocha', 'concat', 'uglify', 'jsdoc', 'copy']);
    grunt.registerTask('travis', ['jshint', 'mocha']);
};
