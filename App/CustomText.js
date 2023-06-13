import React from 'react';
import { Text } from 'react-native';

const CustomText = (props) => {
  const { style, ...rest } = props;
  const mergedStyle = [style, { fontWeight: 'normal' }];

  return <Text style={mergedStyle} {...rest} />;
};


export default CustomText;
