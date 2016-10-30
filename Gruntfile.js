module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        shell: {
            options: {
                stdout: true
            },
            server: {
                command: 'hugo server --theme=honeytrap --buildDrafts --watch'
            },
            build: {
                command: 'hugo -d dist/'
            }
        },
        sass: {
            dev: {
                paths: ['scss/'],
                src: ['scss/main.scss'],
                dest: 'static/css/main.css'
            },
            dist: {
                paths: ['scss/'],
                src: ['scss/main.scss'],
                dest: 'static/css/main.css',
            }
        },
        uglify: {
            options: {
                /*        sourceMap: true,
                        sourceMapIn: 'static/js/main.js.map'*/
                mangle: {
                    except: ['jquery.min.js']
                }
            },
            dist: {
                src: 'static/js/**.js',
                dest: 'static/js/main.min.js'
            }
        },
        watch: {
            options: {
                atBegin: true,
                livereload: true
            },
            sass: {
                files: ['scss/*.scss'],
                tasks: 'sass:dev'
            },

            /*     all: {
                     files: ['Gruntfile.js'],
                     tasks: 'dev'
                 }*/
        },
        open: {
            dev: {
                path: 'http://localhost:1313/'
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: {
                tasks: ["watch", "shell:server"]
            },
            build: {

            }
        },
        useminPrepare: {
            options: {
                dest: 'dist'
            },
            html: 'dist/index.html'
        },
        usemin: {
            html: ['dist/index.html']
        },
	copy: {
	    dist: {
		files: [{
		    expand: true,
		    dot: true,
		    src: ['CNAME'],
		    dest: "dist",
		}],
	    }
	},
        clean: {
            dist: ["dist/"]
        },
        'gh-pages': {
            options: {
                base: 'dist',
                branch: 'gh-pages',
                repo: 'git@github.com:internetsecure/www-internetsecure-today.git'
            },
            src: ['**']
        }
    });

    grunt.registerTask('serve', [ 'concurrent:dev', 'env:server']);
    // grunt.registerTask('serve', [ 'open:dev','concurrent:dev', 'env:server']);
    grunt.registerTask('build', ['sass:dist', 'clean:dist', 'shell:build', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin', 'copy']);
    grunt.registerTask('deploy', ['build', 'gh-pages']);
};
