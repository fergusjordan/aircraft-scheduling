const path = require( "path" );
const fs = require( 'fs' );
const webpack = require( 'webpack' );

const DIST_DIR = path.resolve( __dirname, "dist" );
const SRC_DIR = path.resolve( __dirname, "src" );

const DEV = process.env.NODE_ENV === 'dev';

let config = {
	resolve: {
		modules: [ "node_modules" ],
		descriptionFiles: [ "package.json" ],
	},
	entry: SRC_DIR + "/index.js",
	output: {
		path: DIST_DIR,
		filename: "bundle.js"
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.js?/,
			include: SRC_DIR,
			loader: "babel-loader",
			query: {
				presets: [ "react", "es2015", "stage-2" ]
			}

			// CSS LOADER
		},{
			test: /\.css$/,
			loader: "style-loader!css-loader"

			// MULTIMEDIA LOADER
		},{
			test: /\.(jpe?g|png|gif|mp4)$/i,
			loader: "image-webpack-loader!file-loader?name=/images/[sha512:hash:base64:7].[ext]"

			// FONT LOADER
		},{
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: [
				'file-loader?name=/fonts/[name].[ext]'
			]

			// HTML LOADER
		},{
			test: /\.html$/,
			use: [
				'html-loader'
			]
		}]
	}, plugins: [

		new webpack.DefinePlugin({
			DEBUG: JSON.stringify( DEV )
		})
	]
};

if ( process.env.NODE_ENV === 'production' ) {
	config.output.filename = "bundle-[hash].js";

	// HASHING PLUGIN FOR VERSION BUSTING
	config.plugins.push(
		function () {
			this.plugin( "done", function ( stats ) {
				let replaceInFile = function ( filePath, toReplace, replacement ) {

					let replacer = function ( match ) {
						console.log( 'Replacing in %s: %s => %s', filePath, match, replacement );
						return replacement
					};

					let str = fs.readFileSync( filePath, 'utf8' );

					let out = str.replace( new RegExp( toReplace, 'g' ), replacer );
					fs.writeFileSync( filePath, out );
				};

				let hash = stats.hash; // Build's hash, found in `stats` since build lifecycle is done.

				replaceInFile( path.join( DIST_DIR, 'index.html' ),
					'bundle.js',
					'bundle-' + hash + '.js'
				);
			} );
		}
	);

} else config.output.filename = "bundle.js";

console.log( "Running " + process.env.NODE_ENV + " build" );

module.exports = config;
