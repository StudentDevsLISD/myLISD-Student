import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';

export const injectFontAwesome = () => {
  const iconFontStyles = `@font-face {
    src: url(${iconFont});
    font-family: FontAwesome;
  }`;

  const style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }

  document.head.appendChild(style);
};
