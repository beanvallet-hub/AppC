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

import { GradientView } from './GradientView';

export interface GradientButtonProps {
  title: string;

  onPress: () => void;

  colors: readonly string[];

  direction?:
    | 'leftToRight'
    | 'rightToLeft'
    | 'topToBottom'
    | 'bottomToTop'
    | 'topLeftToBottomRight'
    | 'topRightToBottomLeft'
    | 'bottomLeftToTopRight'
    | 'bottomRightToTopLeft';

  disabled?: boolean;

  loading?: boolean;

  style?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;

  borderRadius?: number;

  /**
   * Minimum height of the button.
   */
  height?: number;

  /**
   * Colors used when disabled.
   */
  disabledColors?: readonly string[];

  /**
   * Reduces opacity while pressing.
   */
  pressedOpacity?: number;

  /**
   * Accessibility label.
   */
  accessibilityLabel?: string;

  testID?: string;
}

export function GradientButton({
  title,
  onPress,
  colors,
  direction = 'leftToRight',
  disabled = false,
  loading = false,
  style,
  textStyle,
  borderRadius = 12,
  height = 52,
  disabledColors = ['#BDBDBD', '#9E9E9E'],
  pressedOpacity = 0.85,
  accessibilityLabel,
  testID,
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  const activeColors = isDisabled
    ? disabledColors
    : colors;

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
      <GradientView
        colors={activeColors}
        direction={direction}
        style={[
          styles.gradient,
          {
            minHeight: height,
            borderRadius,
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
      </GradientView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },

  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
