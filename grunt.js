/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      grunt : ['grunt.js'],
      src : ['src/**/*.js'],
      test : ['test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      vendor: {
        src: [
          'vendor/jquery*.js',
          'vendor/underscore*.js',
          'vendor/backbone*.js'
        ],
        dest: 'dist/vendor.js'
      },
      'vendor-test-js': {
        src: [
          'vendor/mocha*.js',
          'vendor/chai*.js',
          'vendor/sinon*.js',
          'vendor/grunt-mocha-helper*.js'
        ],
        dest: 'dist/vendor-test.js'
      },
      'vendor-test-css': {
        src: [
          'vendor/mocha*.css'
        ],
        dest: 'dist/vendor-test.css'
      },
      test: {
        src: [
          'test/**/*.js'
        ],
        dest: 'dist/test.js'
      },
      src: {
        src: ['src/**/*.js'],
        dest: 'dist/src.js'
      },
      dist: {
        src: [
          '<banner:meta.banner>',
          'dist/src.js',
          'dist/templates.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: [
        'src/**/*',
        'test/**/*',
        'index.html'
      ],
      tasks: 'build reload'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {},
      test: {
        globals: {
          sinon: true,
          expect: true,
          describe: true,
          it: true
        }
      }
    },
    uglify: {},
    server: {
      port: 8999,
      base: '.'
    },
    reload: {
      port: 8001,
      proxy: {
        port: 8999,
        host: 'localhost'
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "Taxi.templates"
        },
        files: {
          "dist/templates.js": "src/templates/**/*.hbs"
        }
      }
    },
    less: {
      development: {
        options: {
          // Scan for imports:
          // paths: ["assets/css"]
        },
        files: {
          "dist/taxi.css": "src/styles/**/*.less"
        }
      },
      production: {
        options: {
          // paths: ["assets/css"],
          yuicompress: true
        },
        files: {
          "dist/taxi.css": "src/styles/**/*.less"
        }
      }
    },
    mocha: {
      index: ['test/index.html']
    }
  });

  // Default task.
  grunt.registerTask('default', 'server reload build watch');
  grunt.registerTask('build', 'lint qunit handlebars less concat');
  grunt.registerTask('test', 'build mocha');

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
};
