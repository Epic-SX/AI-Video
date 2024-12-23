module.exports = {
    module: {
      rules: [
        {
          test: /\.(mp4)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash].[ext]',
                outputPath: 'videos',
              },
            },
          ],
        },
      ],
      resolve: {
        fallback: {
          "buffer": require.resolve("buffer/"),
          "stream": require.resolve("stream-browserify"),
        },
      },
    },
  };
  