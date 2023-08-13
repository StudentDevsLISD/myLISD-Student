import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './WebApp/Navigation.jsx';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import { injectFontAwesome } from './fontUtils';

// Call the utility function to inject the FontAwesome stylesheet
injectFontAwesome();

if (module.hot) {
  module.hot.accept();
}
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});