import * as path from 'path';
import ImageminPlugin from 'imagemin-webpack-plugin'

module.exports = {
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production'
		? `/`
		: '/',

  configureWebpack: {
    plugins: [
      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production',
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '95-100'
        },
        // plugins: [
        //   imageminMozjpeg({
        //     quality: 100,
        //     progressive: true
        //   })
        // ]
      })
    ],
    // optimization: {
    //   minimizer: [
    //     new ImageMinimizerPlugin({
    //       minimizer: {
    //         implementation: ImageMinimizerPlugin.imageminMinify,
    //         options: {
    //           // Lossless optimization with custom option
    //           // Feel free to experiment with options for better result for you
    //           plugins: [
    //             ["gifsicle", { interlaced: true }],
    //             ["jpegtran", { progressive: true }],
    //             ["optipng", { optimizationLevel: 5 }],
    //             // Svgo configuration here https://github.com/svg/svgo#configuration
    //             [
    //               "svgo",
    //               {
    //                 plugins: [
    //                   {
    //                     name: "preset-default",
    //                     params: {
    //                       overrides: {
    //                         removeViewBox: false,
    //                         addAttributesToSVGElement: {
    //                           params: {
    //                             attributes: [
    //                               { xmlns: "http://www.w3.org/2000/svg" },
    //                             ],
    //                           },
    //                         },
    //                       },
    //                     },
    //                   },
    //                 ],
    //               },
    //             ],
    //           ],
    //         },
    //       },
    //     }),
    //   ],
    // },
  }
		
}
