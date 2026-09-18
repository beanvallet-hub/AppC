import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import PlusIcon from '@assets/icons/plus.svg';

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
      <PlusIcon width={24} height={24} />
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
