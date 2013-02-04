/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg:'<json:package.json>',
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
				'*  - <%= _.pluck(pkg.licenses, "url").join("\n*  - ") %>\n' +
				'*/'
		},
		concat:{
			emerge:{
				src:[
					'<banner:meta.emerge>',
					'<file_strip_banner:vendor/qoopido.js/src/base.js>',
					'<file_strip_banner:vendor/qoopido.js/src/unique.js>',
					'<file_strip_banner:vendor/qoopido.js/src/jquery/plugins/emerge.js>'
				],
				dest:'packages/qoopido.emerge.js'
			}
		},
		min:{
			emerge:{
				src:['<config:concat.emerge.dest>'],
				dest:'packages/qoopido.emerge.min.js'
			}
		},
		qmin: {
			all:{
				src:    ['src/**/*.js'],
				root:   'src/',
				dest:   'min/'
			}
		},
		dependencygraph: {
			targetPath: './src',
			outputPath: './info/dependencies',
			format: 'amd'
		},
		lint:{
			files:[
				'grunt.js',
				'src/**/*.js'
			]
		},
		compress:{
			emerge:{
				options:{
					mode:'zip',
					basePath:'',
					level:1,
					flatten:true
				},
				files:{
					'packages/qoopido.emerge.zip': ['packages/qoopido.emerge*.js']
				}
			}
		},
		clean: {
			all: ['min/**/*', 'packages/**/*']
		},
		watch:{
			files:'<config:lint.files>',
			tasks:'lint'
		},
		jshint:{
			options:{
				curly:true,
				eqeqeq:true,
				immed:true,
				latedef:true,
				newcap:true,
				noarg:true,
				sub:true,
				undef:true,
				boss:true,
				eqnull:true,
				browser:true,
				proto:true,
				expr:true
			},
			globals:{
				jQuery: true,
				define: true,
				require: true
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint clean qmin concat min compress dependencygraph');

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-qmin');
	grunt.loadNpmTasks('grunt-dependencygraph');
};
