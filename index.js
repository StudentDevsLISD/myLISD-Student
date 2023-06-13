/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App/Navigation';
import {name as appName} from './app.json';
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => App);
