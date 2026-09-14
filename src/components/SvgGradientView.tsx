import React, { useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

type GradientDirection =
  | 'leftToRight'
  | 'rightToLeft'
  | 'topToBottom'
  | 'bottomToTop'
  | 'topLeftToBottomRight'
  | 'topRightToBottomLeft'
  | 'bottomLeftToTopRight'
  | 'bottomRightToTopLeft';

export interface GradientViewProps {
  colors: readonly string[];

  /**
   * Optional positions for each color.
   *
   * Example:
   * [0, 0.5, 1]
   */
  locations?: readonly number[];

  direction?: GradientDirection;

  style?: StyleProp<ViewStyle>;

  children?: React.ReactNode;

  /**
   * Controls the opacity of the gradient itself.
   */
  gradientOpacity?: number;
}

let gradientIdCounter = 0;

function getGradientId(): string {
  gradientIdCounter += 1;
  return `rn-gradient-${gradientIdCounter}`;
}

function getGradientCoordinates(
  direction: GradientDirection,
) {
  switch (direction) {
    case 'rightToLeft':
      return {
        x1: '100%',
        y1: '0%',
        x2: '0%',
        y2: '0%',
      };

    case 'topToBottom':
      return {
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
      };

    case 'bottomToTop':
      return {
        x1: '0%',
        y1: '100%',
        x2: '0%',
        y2: '0%',
      };

    case 'topLeftToBottomRight':
      return {
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
      };

    case 'topRightToBottomLeft':
      return {
        x1: '100%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
      };

    case 'bottomLeftToTopRight':
      return {
        x1: '0%',
        y1: '100%',
        x2: '100%',
        y2: '0%',
      };

    case 'bottomRightToTopLeft':
      return {
        x1: '100%',
        y1: '100%',
        x2: '0%',
        y2: '0%',
      };

    case 'leftToRight':
    default:
      return {
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%',
      };
  }
}

export function SvgGradientView({
  colors,
  locations,
  direction = 'leftToRight',
  style,
  children,
  gradientOpacity = 1,
}: GradientViewProps) {
  const gradientId = useRef(getGradientId()).current;

  if (colors.length === 0) {
    return <View style={style}>{children}</View>;
  }

  const coordinates = getGradientCoordinates(direction);

  return (
    <View style={[styles.container, style]}>
      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient
            id={gradientId}
            {...coordinates}
          >
            {colors.map((color, index) => {
              const defaultOffset =
                colors.length === 1
                  ? 0
                  : index / (colors.length - 1);

              const offset =
                locations?.[index] ?? defaultOffset;

              return (
                <Stop
                  key={`${color}-${index}`}
                  offset={offset}
                  stopColor={color}
                  stopOpacity={gradientOpacity}
                />
              );
            })}
          </LinearGradient>
        </Defs>

        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={`url(#${gradientId})`}
        />
      </Svg>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
