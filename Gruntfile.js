module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      files: ['Gruntfile.js', 'assets/javascripts/**/*.js', 'lib/**/*.js']
    },
    nodemon: {
      dev: {
        script: 'bin/www',
        options: {
          ignore: ['node_modules/**', 'assets/**', 'public/**'],
          ext: 'js,json'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};
