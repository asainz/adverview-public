// Generated on 2014-11-29 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var _ = require('underscore'); // jshint ignore:line

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var pushState = require('connect-pushstate');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    targets: [
      { name: 'dev' },
      { name: 'staging' },
      { name: 'prod' }
    ],

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/,*/*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(pushState()).use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/,*/*/}*.js',
          '!<%= yeoman.app %>/scripts/components/autocomplete/autocomplete.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      'compiled-templates': 'app/scripts/config/compiled-templates.js',
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'IE 9']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.dist %>/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        sourcemap: true,
        require: ['compass', 'breakpoint'],
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css'
          // ,'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          // ,'<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'mock-data/{,*/,*/*/}*.json',
            'data/{,*/,*/*/}*.json',
            'images/**',
            'styles/fonts/{,*/}*.*',
            'utils/**'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      'robots-staging':{
        src: 'robots/staging.txt',
        dest: '<%= yeoman.dist %>/robots.txt'
      },
      'robots-prod':{
        src: 'robots/prod.txt',
        dest: '<%= yeoman.dist %>/robots.txt'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        // 'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    run_java: {// jshint ignore:line
      options: { //Default is true
        stdout: false,
        stderr: false,
        stdin: false,
        failOnError: false
      },
      mockey: {
        execOptions:{
          cwd: 'tools/mockey'
        },
        command: 'java',
        jarName: 'mockey.jar',
        javaArgs: '--location .',
        dir: 'tools/mockey/'
      }
    },
    replace: {
      dev:{
        options: {
          patterns: [{
            json: grunt.file.readJSON('./environment-config/envs/dev.json')
          },
          {
            match: /<base .*>/,
            replacement: '<base href="http://localhost:9000/">'
          }]
        },
        files: [
          {expand: false, flatten: true, src: ['./environment-config/environment-config.js'], dest: 'app/scripts/config/environment.js'},
          {expand: false, flatten: true, src: ['app/index.html'], dest: 'app/index.html'}
        ]
      },
      staging:{
        options: {
          patterns: [{
            json: grunt.file.readJSON('./environment-config/envs/staging.json')
          },
          {
            match: /<base .*>/,
            replacement: function(){
              return '<base href="https://www.adverview.com/dev/fe/'+process.env.NEW_BUILD_DIR_NAME+'/">';
            }
          },{
            match: /http:\/\/service\.prerender\.io\/(.*)\/\$2/,
            replacement: function(){
              return 'http://service.prerender.io/https://www.adverview.com/dev/fe/' + process.env.NEW_BUILD_DIR_NAME + '/$2';
            }
          }]
        },
        files: [
          {expand: false, flatten: true, src: ['./environment-config/environment-config.js'], dest: 'app/scripts/config/environment.js'},
          {expand: false, flatten: true, src: ['app/index.html'], dest: 'app/index.html'},
          {expand: false, flatten: true, src: ['app/.htaccess'], dest: 'app/.htaccess'}
        ]
      },
      prod:{
        options: {
          patterns: [{
            json: grunt.file.readJSON('./environment-config/envs/prod.json')
          },
          {
            match: /<base .*>/,
            replacement: function(){
              return '<base href="https://www.adverview.com/">';
            }
          },{
            match: /http:\/\/service\.prerender\.io\/(.*)\/\$2/,
            replacement: function(){
              return 'http://service.prerender.io/https://www.adverview.com/$2';
            }
          }]
        },
        files: [
          {expand: false, flatten: true, src: ['./environment-config/environment-config.js'], dest: 'app/scripts/config/environment.js'},
          {expand: false, flatten: true, src: ['app/index.html'], dest: 'app/index.html'},
          {expand: false, flatten: true, src: ['app/.htaccess'], dest: 'app/.htaccess'}
        ]
      }
    },
    ngtemplates: {
      AdverView: {
        cwd: 'app',
        src: 'views/**/*.html',
        dest: 'app/scripts/config/compiled-templates.js',
        options: {
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true, // Only if you don't use comment directives!
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'replace:dev',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', function(targetName){
    var target = _.findWhere(grunt.config('targets'), {name: targetName});

    if (!_.isObject(target)) {
      console.log('Target "' + targetName + '" is invalid.');
      return;
    }

    grunt.task.run([
      'clean:dist',
      'replace:' + target.name,
      'ngtemplates',
      'wiredep',
      'useminPrepare',
      'concurrent:dist',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'copy:robots-' + target.name,
      'cdnify',
      'cssmin',
      'uglify',
      'filerev',
      'usemin',
      'autoprefixer:build',
      'clean:compiled-templates'
    ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('mockey', ['run_java:mockey']);

  grunt.registerTask('create-countries-tree', 'create-countries-tree', function () {
        var path = require('path');
        var json = require('jsonfile');
        var _ = require('underscore');

        var ORIGIN = path.resolve('countries.json');
        var DEST = path.resolve('app/data/countries.json');
        var output = {records: []};

        var countries = json.readFileSync(ORIGIN);

        _.each(countries, function(country){
            var item = {
              n: country.name.common,
              cu: country.currency[0],
              co: country.cca2
            };

            output.records.push(item);
        });

        json.writeFileSync(DEST, output);
    });
};
