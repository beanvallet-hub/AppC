import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

let gradientIdCounter = 0;

function getGradientId(): string {
  gradientIdCounter += 1;
  return `rn-gradient-${gradientIdCounter}`;
}

type LoadingBarProps = {
  backgroudColor?: string;
  progress?: number; // 0 - 1
  width?: number;
  height?: number;
  duration?: number;
  colors?: readonly string[];

  /**
   * Optional positions for each color.
   *
   * Example:
   * [0, 0.5, 1]
   */
  locations?: readonly number[];
};

export function LoadingBar({
  backgroudColor = '#3A3A3A',
  colors = ['#1dde77', '#00A94F'],
  locations,
  progress = 0,
  width = 300,
  height = 8,
  duration = 500,
}: LoadingBarProps) {
  const gradientId = useRef(getGradientId()).current;

  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const value = Math.min(Math.max(progress, 0), 1);

    Animated.spring(animatedProgress, {
      toValue: value,
      useNativeDriver: true,
    }).start();
  }, [progress, duration]);

  const animatedWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const radius = height / 2;

  const coordinates = {
    x1: '100%',
    y1: '0%',
    x2: '0%',
    y2: '0%',
  };

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Background */}
      <Defs>
        <LinearGradient id={gradientId} {...coordinates}>
          {colors.map((color, index) => {
            const defaultOffset =
              colors.length === 1 ? 0 : index / (colors.length - 1);

            const offset = locations?.[index] ?? defaultOffset;

            return (
              <Stop
                key={`${color}-${index}`}
                offset={offset}
                stopColor={color}
                stopOpacity={1}
              />
            );
          })}
        </LinearGradient>
      </Defs>

      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={radius}
        fill={backgroudColor}
      />

      {/* Progress */}
      <AnimatedRect
        x={0}
        y={0}
        height={height}
        rx={radius}
        fill={`url(#${gradientId})`}
        width={animatedWidth}
      />
    </Svg>
  );
}
