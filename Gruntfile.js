/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta:{
			emerge:'/*!\n' +
				'* Qoopido Emerge jQuery plugin\n' +
				'*\n' +
				'* Source:  <%= pkg.title || pkg.name %>\n' +
				'* Version: <%= pkg.version %>\n' +
				'* Date:    <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* Author:  <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
				'* Website: <%= pkg.homepage %>\n' +
				'*\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'*\n' +
				'* Licensed under the <%= _.pluck(pkg.licenses, "type").join(" and ") %> license.\n' +
				'*  - <%= _.pluck(pkg.licenses, "url").join("\\n*  - ") %>\n' +
				'*/\n'
		},
		jshint:{
			options: {
				jshintrc: '.jshintrc'
			},
			build:[
				'Gruntfile.js',
				'src/**/*.js'
			]
		},
		clean: {
			options: {
				force: true
			},
			build: ['dist/<%= pkg.version %>/**/*'],
			package: ['packages/qoopido.emerge.<%= pkg.version %>*']
		},
		copy: {
			build: {
				files: [
					{src: ['src/**/*.js'], dest: 'dist/<%= pkg.version %>/'}
				]
			}
		},
		uglifyrecursive: {
			build: {
				files: [
					{ strip: 'src', src: ['src/**/*.js'], dest: 'dist/<%= pkg.version %>/min/'}
				]
			}
		},
		concat:{
			options: {
				banner: '<%= meta.emerge %>',
				stripBanners: true
			},
			package:{
				src:[
					'vendor/qoopido.js/src/base.js',
					'vendor/qoopido.js/src/unique.js',
					'src/jquery/plugins/emerge.js'
				],
				dest:'packages/qoopido.emerge.<%= pkg.version %>.js'
			}
		},
		uglify:{
			package:{
				files:{
					'packages/qoopido.emerge.<%= pkg.version %>.min.js': ['packages/qoopido.emerge.<%= pkg.version %>.js']
				}
			}
		},
		compress:{
			package:{
				options:{
					mode:'zip',
					level:1,
					pretty:true,
					archive: 'packages/qoopido.emerge.<%= pkg.version %>.zip'
				},
				src: ['packages/qoopido.emerge.<%= pkg.version %>*.js'],
				flatten: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-uglifyrecursive');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['jshint:build', 'clean:build', 'copy:build', 'uglifyrecursive:build', 'clean:package', 'concat:package', 'uglify:package', 'compress:package']);
	grunt.registerTask('build', ['jshint:build', 'clean:build', 'copy:build', 'uglifyrecursive:build']);
	grunt.registerTask('package', ['jshint:build', 'clean:package', 'concat:package', 'uglify:package', 'compress:package']);
};
