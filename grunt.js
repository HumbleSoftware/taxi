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
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      basic: {
        src: ['vendor/**/*.js'],
        dest: 'dist/vendor.js'
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
      files: ['<config:lint.files>', 'index.html', 'templates/*'],
      tasks: 'lint qunit handlebars concat reload'
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
      globals: {}
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
          "dist/templates.js": "templates/**/*.hbs"
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'server reload watch');

  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
};
