module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/unit/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    staticinline: {
      main: {
        options: {
          prefix: '@{',
          suffix: '}@',
          vars: {
            'lighting': '<%= grunt.file.read("src/shaders/lighting.glsl") %>',
            'level_of_detail': '<%= grunt.file.read("src/shaders/level_of_detail.glsl") %>',
            'simplex_noise': '<%= grunt.file.read("src/shaders/simplex_noise.glsl") %>',

            'lod_vertex': '<%= grunt.file.read("src/shaders/lod_vertex.glsl") %>',
            'lod_fragment': '<%= grunt.file.read("src/shaders/lod_fragment.glsl") %>',

            'terrain': '<%= grunt.file.read("examples/js/terrain.js") %>'
          }
        },
        files: {
          'examples/terrain.html': 'examples/templates/terrain-template.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-static-inline');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'staticinline', 'qunit', 'concat', 'uglify']);

};
