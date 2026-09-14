import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface GradientButtonProps {
  title: string;

  onPress: () => void;

  disabled?: boolean;

  loading?: boolean;

  style?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;

  pressedOpacity?: number;

  accessibilityLabel?: string;

  testID?: string;
}

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  pressedOpacity = 0.85,
  accessibilityLabel,
  testID,
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={({ pressed }) => [
        styles.pressable,
        style,
        pressed &&
        !isDisabled && {
          opacity: pressedOpacity,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color="#FFFFFF"
        />
      ) : (
        <Text
          numberOfLines={1}
          style={[styles.text, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
    minHeight: 52,
    borderRadius: 8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
