import React, { useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export interface RadialGradientViewProps {
  colors: readonly string[];

  /**
   * Position of the gradient center.
   *
   * Examples:
   * "center"
   * "top"
   * "topLeft"
   * "bottomRight"
   */
  center?: {
    x: number;
    y: number;
  };

  /**
   * Radius of the gradient.
   * 0.5 means approximately 50% of the view.
   */
  radius?: number;

  /**
   * Optional color positions.
   *
   * Example:
   * [0, 0.5, 1]
   */
  locations?: readonly number[];

  style?: StyleProp<ViewStyle>;

  children?: React.ReactNode;

  gradientOpacity?: number;
}

let gradientIdCounter = 0;

function createGradientId() {
  gradientIdCounter += 1;

  return `rn-radial-gradient-${gradientIdCounter}`;
}

export function RadialGradientView({
  colors,
  center = {
    x: 0.5,
    y: 0.5,
  },
  radius = 0.5,
  locations,
  style,
  children,
  gradientOpacity = 1,
}: RadialGradientViewProps) {
  const gradientId = useRef(createGradientId()).current;

  if (colors.length === 0) {
    return (
      <View style={style}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <RadialGradient
            id={gradientId}
            cx={`${center.x * 100}%`}
            cy={`${center.y * 100}%`}
            r={`${radius * 100}%`}
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
          </RadialGradient>
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
