module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      // options: {
      //   compile: true, // perform compilation. [true (default) | false]
      //   comments: false, // same as !removeComments. [true | false (default)]
      //   target: 'es6', // target javascript language. [es3 | es5 (grunt-ts default) | es6]
      //   module: 'amd', // target javascript module style. [amd (default) | commonjs]
      //   sourceMap: true, // generate a source map for every output js file. [true (default) | false]
      //   sourceRoot: 'src', // where to locate TypeScript files. [(default) '' == source ts location]
      //   mapRoot: '', // where to locate .map.js files. [(default) '' == generated js location.]
      //   declaration: false, // generate a declaration .d.ts file for every output js file. [true | false (default)]
      //   fast: 'never', // see https://github.com/TypeStrong/grunt-ts/blob/master/docs/fast.md ["watch" (default) | "always" | "never"]
      // },
      // // a particular target
      // dev: {
      //   src: ['src/**/*.ts'], // The source typescript files, http://gruntjs.com/configuring-tasks#files
      //   //out: 'dist/scripts/main.js', // If specified, generate an out.js file which is the merged js file
      //   options: {
      //     module: 'amd',
      //     moduleResolution: 'node',
      //   },
      // },

      default: {
        tsconfig: true,
      },
      options: {
        fast: 'never',
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/assets',
            src: '**',
            dest: 'dist/assets',
            filter: 'isFile',
          },
          {
            expand: true,
            cwd: 'src',
            src: 'index.html',
            dest: 'dist',
            filter: 'isFile',
          },
        ],
      },
    },
    watch: {
      scripts: {
        options: { livereload: true },
        files: ['src/**/*'],
        tasks: ['ts:dev'],
      },
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          livereload: true,
          base: 'dist',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['ts', 'copy:main', 'connect', 'watch']);
};
