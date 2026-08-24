import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type RoundedIconButtonProps = PropsWithChildren & {
  onPress?: () => void;
  size?: number;
};

export const RoundedIconButton = ({
  onPress,
  size = 28,
  ...rest
}: RoundedIconButtonProps) => {
  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.checkboxBase,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: '#D1D1D6',
          backgroundColor: '#6080ff',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      {...rest}
    >
      {/* <Plus color="#FFFFFF" size={size * 0.6} strokeWidth={3} /> */}

      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <Path d="M5 12h14" />
        <Path d="M12 5v14" />
      </Svg>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});
