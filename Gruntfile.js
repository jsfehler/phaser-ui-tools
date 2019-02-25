/* eslint-disable */
var babel = require('rollup-plugin-babel');
var multiEntry = require("rollup-plugin-multi-entry");

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            main: {
                src: "dist/phaser-ui-tools.js",
                dest: "docs/examples/lib/phaser-ui-tools.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {"dist/<%= pkg.name %>.min.js": ["dist/<%= pkg.name %>.js"]}
            }
        },
        jshint: {
            files: ["tests/*.js"]
        },
        eslint: {
            target: ["Gruntfile.js", "src/**/*.js"]
        },
        jsdoc: {
            dist: {
                src: ["src/**/*.js"],
                options: {
                    destination: "docs",
                    template : "node_modules/ink-docstrap/template",
                    configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },
        mocha: {
            all: {
                src: ["tests/testrunner.html"]
            },
            options: {
                run: false,
                page: {
                    settings: {
                        webSecurityEnabled: false,
                    }
                }
            }
        },
        rollup: {
            options: {
                plugins: function() {
                    return [
                        babel({
                          exclude: './node_modules/**'
                      }),
                        multiEntry()
                    ];
                },
                moduleName: "uiWidgets",
                format: 'umd',
            },
            files: {
              dest: "dist/phaser-ui-tools.js",
              src: ["src/01_group.js", "src/**/*.js"]
            },
          }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks('grunt-rollup');

    grunt.registerTask("default", ["jshint", "eslint", "rollup", "uglify", "mocha", "jsdoc", "copy"]);
    grunt.registerTask("travis", ["jshint", "eslint", "mocha"]);
};
