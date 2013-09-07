/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    name: 'taxi',
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      release: {
        files: {
          '<%= name %>.js' : ['dist/<%= name %>.js'],
          '<%= name %>.css' : ['dist/<%= name %>.css']
        }
      },
      taxi: {
        options : {
          banner : '/*!\n* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n*/\n' + 
            ';(function (Backbone, _) {',
          footer : 'taxi.version = "<%= pkg.version %>";\n})(Backbone.noConflict(), _.noConflict());'
        },
        src: [
          'src/taxi.js',
          'src/DriverModel.js',
          'src/**/*.js',
          'dist/templates.js'
        ],
        dest: 'dist/<%= name %>.js'
      },
      develop: {
        files: {
          // Testing:
          'dist/vendor-test.js': [
            'vendor/mocha*.js',
            'vendor/chai*.js',
            'vendor/sinon*.js',
            'vendor/grunt-mocha-helper*.js'
          ],
          'dist/vendor-test.css': [
            'vendor/mocha*.css'
          ],
          'dist/test.js': [
            'test/**/*.js'
          ],
          // Source:
          'dist/vendor.js': [
            'vendor/jquery*.js',
            'vendor/underscore*.js',
            'vendor/backbone*.js'
          ],
          'dist/<%= name %>-complete.js' : [
            'dist/vendor.js',
            '<%= concat.taxi.dest %>'
          ]
        }
      }
    },
    watch: {
      // Separate task for livereload for CSS-no-refresh:
      livereload: {
        files: [
          'dist/**/*'
        ],
        options: {
          livereload: 35730
        }
      },
      css: {
        files: [
          'src/**/*.less'
        ],
        tasks: [
          'less:development'
        ]
      },
      scripts: {
        files: [
          'src/**/*.js',
          'src/**/*.html',
          'test/**/*',
          'index.html'
        ],
        tasks: [
          'build'
        ]
      }
    },
    jst: {
      compile: {
        options: {
          processName: function (name) {
            // strip src/templates/ and .html
            return name.split('/').slice(2).join('/').slice(0, -5);
          },
          templateSettings: {
            interpolate : /\{\{(.+?)\}\}/g
          },
          namespace: "<%= name %>.templates"
        },
        files: {
          "dist/templates.js": ["src/templates/**/*.html"]
        }
      }
    },
    less: {
      development: {
        options: {
          // Scan for imports:
          paths: []
        },
        files: {
          "dist/<%= name %>.css": "src/styles/**/*.less"
        }
      },
      production: {
        options: {
          // paths: ["assets/css"],
          yuicompress: true
        },
        files: {
          "dist/<%= name %>.css": "src/styles/**/*.less"
        }
      }
    },

    // Testing:
    mocha: {
      index: ['test/index.html']
    },

    // The server:
    connect: {
      server: {
        options: {
          port: 8999,
          base: '.',
          middleware : function (connect, options) {
            return [
              // Connect middleware to inject livereload script.
              require('connect-livereload')({
                port : 35730
              }),
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    release: {
      options: {
        npm: false,
        npmtag: false
      }
    }
  });

  // Default task.
  grunt.registerTask('build', ['jst', 'less', 'concat:develop', 'concat:taxi']);
  grunt.registerTask('test', ['build', 'mocha']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);
  grunt.registerTask('taxi-release', ['build', 'concat:release']);

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');
};
