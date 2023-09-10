const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);
const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  // Add every react-native package that needs compiling
  // 'react-native-gesture-handler',
  'react-native-progress', 'react-native-vector-icons', 'react-native-ratings', 'react-native-elements', 'react-native-circular-progress', 'react-native-calendars', 'react-native-calendar-strip', 'react-native-swipe-gestures'
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(__dirname, 'index.web.js'),
    path.resolve(__dirname, 'App.web.jsx'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, "./WebApp/Navigation.jsx"),
    path.resolve(appDirectory, "./WebApp/Login.jsx"),
    path.resolve(appDirectory, "./WebApp/AppRunner.jsx"),
    path.resolve(appDirectory, "./WebApp/ThemeContext.jsx"),
    path.resolve(appDirectory, "./WebApp/SplashScreen.jsx"),
    path.resolve(appDirectory, "./WebApp/SettingsDropdown.jsx"),
    path.resolve(appDirectory, "./WebApp/Portal.jsx"),
    path.resolve(appDirectory, "./WebApp/Home.jsx"),
    path.resolve(appDirectory, "./WebApp/HAC.jsx"),
    path.resolve(appDirectory, "./WebApp/Grades.jsx"),
    path.resolve(appDirectory, "./WebApp/GPA.jsx"),
    path.resolve(appDirectory, "./WebApp/ContactTeachers.jsx"),
    path.resolve(appDirectory, "./WebApp/ClassSchedule.jsx"),
    path.resolve(appDirectory, "./WebApp/Attendance.jsx"),
    path.resolve(appDirectory, "./WebApp/AssignmentScreen.jsx"),
    path.resolve(appDirectory, "./WebApp/CalendarEvent.jsx"),
    path.resolve(appDirectory, "./WebApp/PeriodTimer.jsx"),
    path.resolve(appDirectory, "./WebApp/PortalButton.jsx"),
    path.resolve(__dirname, 'WebApp'),
    /node_modules\/(@?react-(navigation|native)).*\.(ts|js)x?$/, // add this line
    ...compileNodeModules,
  ],
  exclude: [/react-native-web/, /\.(native|ios|android)\.(ts|js)x?$/],
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets,
        plugins: ['react-native-web'],
      },
    },
  ],
};


const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
      esModule: false,
    }
  }
};
const fontLoaderConfiguration = {
  test: /\.ttf$/,
  loader: "url-loader", // or directly file-loader
  include: path.resolve(__dirname, "node_modules/react-native-vector-icons"),
}

module.exports = {
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'rnw_blogpost.bundle.js',
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx'],    
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  externals: {
    "react-native": false,
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      fontLoaderConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(true),
    }),
  ],
  devServer: {
    https: {
      key: fs.readFileSync('/Users/sujithalluru/key.pem'), // Adjust the path as necessary
      cert: fs.readFileSync('/Users/sujithalluru/cert.pem'), // Adjust the path as necessary
    },
  }
};
