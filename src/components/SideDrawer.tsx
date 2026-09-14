
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Animated,
  BackHandler,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

type DrawerSide = 'left' | 'right';

export interface SideDrawerProps extends PropsWithChildren {
  /**
   * Whether the drawer is open.
   */
  visible: boolean;

  /**
   * Called when the drawer requests to close.
   */
  onClose: () => void;

  /**
   * Drawer width.
   *
   * Examples:
   *   width={300}
   *   width="80%"
   *
   * Default: "80%"
   */
  width?: number | `${number}%`;

  /**
   * Drawer position.
   *
   * Default: "left"
   */
  side?: DrawerSide;

  /**
   * Enable tapping the backdrop to close.
   *
   * Default: true
   */
  closeOnBackdropPress?: boolean;

  /**
   * Enable Android hardware back to close.
   *
   * Default: true
   */
  closeOnBackPress?: boolean;

  /**
   * Enable opening by swiping from the screen edge.
   *
   * Default: true
   */
  swipeToOpen?: boolean;

  /**
   * Enable closing by swiping the drawer.
   *
   * Default: true
   */
  swipeToClose?: boolean;

  /**
   * Width of the invisible edge gesture area.
   *
   * Default: 24
   */
  edgeWidth?: number;

  /**
   * Animation duration.
   *
   * Default: 280ms
   */
  animationDuration?: number;

  /**
   * Backdrop opacity when fully open.
   *
   * Default: 0.45
   */
  backdropOpacity?: number;

  /**
   * Additional styles for the drawer.
   */
  drawerStyle?: ViewStyle;

  /**
   * Called after drawer opens.
   */
  onOpenComplete?: () => void;

  /**
   * Called after drawer closes.
   */
  onCloseComplete?: () => void;
}

const DEFAULT_WIDTH = '80%';
const DEFAULT_EDGE_WIDTH = 24;
const DEFAULT_ANIMATION_DURATION = 280;
const DEFAULT_BACKDROP_OPACITY = 0.45;

const SWIPE_DISTANCE_THRESHOLD = 0.35;
const SWIPE_VELOCITY_THRESHOLD = 0.5;

function resolveDrawerWidth(
  width: number | `${number}%`,
  screenWidth: number,
): number {
  if (typeof width === 'number') {
    return Math.min(Math.max(width, 0), screenWidth);
  }

  const percentage = Number.parseFloat(width);

  if (Number.isNaN(percentage)) {
    return screenWidth * 0.8;
  }

  return Math.min(
    Math.max(screenWidth * (percentage / 100), 0),
    screenWidth,
  );
}

export function SideDrawer({
  visible,
  onClose,
  width = DEFAULT_WIDTH,
  side = 'left',
  closeOnBackdropPress = true,
  closeOnBackPress = true,
  swipeToOpen = true,
  swipeToClose = true,
  edgeWidth = DEFAULT_EDGE_WIDTH,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  backdropOpacity = DEFAULT_BACKDROP_OPACITY,
  drawerStyle,
  onOpenComplete,
  onCloseComplete,
  children,
}: SideDrawerProps) {
  const { width: screenWidth } = useWindowDimensions();

  const drawerWidth = useMemo(
    () => resolveDrawerWidth(width, screenWidth),
    [width, screenWidth],
  );

  /**
   * Drawer progress:
   *
   * 0 = closed
   * 1 = open
   */
  const progress = useRef(new Animated.Value(0)).current;

  /**
   * Keep a JS-side copy of progress.
   *
   * This avoids relying on Animated.Value.__getValue().
   */
  const progressRef = useRef(0);

  /**
   * Whether the drawer is currently mounted visually.
   */
  const mountedRef = useRef(false);

  /**
   * Prevent overlapping animations.
   */
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  /**
   * Current visible prop.
   */
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  /**
   * Keep progressRef synchronized when React controls
   * the value programmatically.
   */
  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      progressRef.current = value;
    });

    return () => {
      progress.removeListener(listenerId);
    };
  }, [progress]);

  /**
   * Stop current animation.
   */
  const stopAnimation = useCallback(() => {
    animationRef.current?.stop();
    animationRef.current = null;
  }, []);

  /**
   * Animate drawer to a target.
   */
  const animateTo = useCallback(
    (
      target: 0 | 1,
      callback?: () => void,
    ) => {
      stopAnimation();

      animationRef.current = Animated.timing(progress, {
        toValue: target,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      animationRef.current.start(({ finished }) => {
        animationRef.current = null;

        if (finished) {
          progressRef.current = target;
          callback?.();
        }
      });
    },
    [
      animationDuration,
      progress,
      stopAnimation,
    ],
  );

  /**
   * Open drawer.
   */
  const openDrawer = useCallback(() => {
    mountedRef.current = true;

    animateTo(1, () => {
      onOpenComplete?.();
    });
  }, [
    animateTo,
    onOpenComplete,
  ]);

  /**
   * Close drawer.
   */
  const closeDrawer = useCallback(() => {
    animateTo(0, () => {
      onCloseComplete?.();
    });
  }, [
    animateTo,
    onCloseComplete,
  ]);

  /**
   * React-controlled open/close state.
   */
  useEffect(() => {
    if (visible) {
      mountedRef.current = true;
      openDrawer();
    } else if (mountedRef.current) {
      closeDrawer();
    }
  }, [
    visible,
    openDrawer,
    closeDrawer,
  ]);

  /**
   * Android hardware back.
   */
  useEffect(() => {
    if (!visible || !closeOnBackPress) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onClose();
        return true;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [
    visible,
    closeOnBackPress,
    onClose,
  ]);

  /**
   * Drawer translation.
   */
  const closedTranslation =
    side === 'left'
      ? -drawerWidth
      : drawerWidth;

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      closedTranslation,
      0,
    ],
  });

  /**
   * Backdrop opacity.
   */
  const backdropOpacityValue = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      0,
      backdropOpacity,
    ],
  });

  /**
   * Determine whether the gesture is moving
   * in the direction of opening.
   */
  const isOpeningGesture = useCallback(
    (dx: number) => {
      if (side === 'left') {
        return dx > 0;
      }

      return dx < 0;
    },
    [side],
  );

  /**
   * Determine whether the gesture is moving
   * in the direction of closing.
   */
  const isClosingGesture = useCallback(
    (dx: number) => {
      if (side === 'left') {
        return dx < 0;
      }

      return dx > 0;
    },
    [side],
  );

  /**
   * Convert gesture dx into progress.
   */
  const progressFromGesture = useCallback(
    (
      dx: number,
      startingProgress: number,
    ) => {
      const signedDx =
        side === 'left'
          ? dx
          : -dx;

      return Math.max(
        0,
        Math.min(
          1,
          startingProgress + signedDx / drawerWidth,
        ),
      );
    },
    [
      drawerWidth,
      side,
    ],
  );

  /**
   * Common gesture responder.
   */
  const createPanResponder = useCallback(
    (edgeOnly: boolean) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,

        onMoveShouldSetPanResponder: (
          _,
          gestureState,
        ) => {
          const {
            dx,
            dy,
          } = gestureState;

          const horizontalMovement =
            Math.abs(dx);

          const verticalMovement =
            Math.abs(dy);

          /**
           * Ignore vertical gestures.
           */
          if (
            verticalMovement >
            horizontalMovement
          ) {
            return false;
          }

          /**
           * Ignore tiny movements.
           */
          if (
            horizontalMovement < 8
          ) {
            return false;
          }

          /**
           * Drawer currently open.
           */
          if (visibleRef.current) {
            if (!swipeToClose) {
              return false;
            }

            return isClosingGesture(dx);
          }

          /**
           * Drawer currently closed.
           */
          if (
            !swipeToOpen ||
            !edgeOnly
          ) {
            return false;
          }

          return isOpeningGesture(dx);
        },

        onPanResponderGrant: () => {
          stopAnimation();
        },

        onPanResponderMove: (
          _,
          gestureState,
        ) => {
          const startingProgress =
            visibleRef.current
              ? 1
              : 0;

          const nextProgress =
            progressFromGesture(
              gestureState.dx,
              startingProgress,
            );

          progress.setValue(
            nextProgress,
          );
        },

        onPanResponderRelease: (
          _,
          gestureState,
        ) => {
          const currentProgress =
            progressRef.current;

          const directionalVelocity =
            side === 'left'
              ? gestureState.vx
              : -gestureState.vx;

          /**
           * Fast swipe.
           */
          if (
            directionalVelocity >
            SWIPE_VELOCITY_THRESHOLD
          ) {
            animateTo(
              1,
              onOpenComplete,
            );
            return;
          }

          if (
            directionalVelocity <
            -SWIPE_VELOCITY_THRESHOLD
          ) {
            animateTo(
              0,
              onCloseComplete,
            );

            if (
              visibleRef.current
            ) {
              onClose();
            }

            return;
          }

          /**
           * Otherwise settle based on position.
           */
          if (
            currentProgress >=
            SWIPE_DISTANCE_THRESHOLD
          ) {
            animateTo(
              1,
              onOpenComplete,
            );
          } else {
            animateTo(
              0,
              onCloseComplete,
            );

            if (
              visibleRef.current
            ) {
              onClose();
            }
          }
        },

        onPanResponderTerminate: () => {
          const currentProgress =
            progressRef.current;

          if (
            currentProgress >=
            SWIPE_DISTANCE_THRESHOLD
          ) {
            animateTo(
              1,
              onOpenComplete,
            );
          } else {
            animateTo(
              0,
              onCloseComplete,
            );

            if (
              visibleRef.current
            ) {
              onClose();
            }
          }
        },

        onPanResponderTerminationRequest:
          () => true,
      }),
    [
      animateTo,
      isClosingGesture,
      isOpeningGesture,
      onClose,
      onCloseComplete,
      onOpenComplete,
      progress,
      progressFromGesture,
      side,
      stopAnimation,
      swipeToClose,
      swipeToOpen,
    ],
  );

  /**
   * Drawer gesture responder.
   *
   * Handles closing an already-open drawer.
   */
  const drawerPanResponder = useMemo(
    () =>
      createPanResponder(false),
    [createPanResponder],
  );

  /**
   * Edge gesture responder.
   *
   * Handles opening a closed drawer.
   */
  const edgePanResponder = useMemo(
    () =>
      createPanResponder(true),
    [createPanResponder],
  );

  /**
   * The drawer remains mounted during
   * the closing animation.
   */
  if (
    !mountedRef.current &&
    !visible
  ) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.root}
    >
      {/* Backdrop */}
      <Animated.View
        pointerEvents={
          visible
            ? 'auto'
            : 'none'
        }
        style={[
          StyleSheet.absoluteFillObject,
          styles.backdrop,
          {
            opacity:
              backdropOpacityValue,
          },
        ]}
      >
        <Pressable
          style={
            StyleSheet.absoluteFillObject
          }
          disabled={
            !closeOnBackdropPress
          }
          onPress={
            closeOnBackdropPress
              ? onClose
              : undefined
          }
          accessibilityRole="button"
          accessibilityLabel="Close drawer"
        />
      </Animated.View>

      {/* Edge swipe zone */}
      {!visible &&
        swipeToOpen && (
          <View
            {...edgePanResponder.panHandlers}
            pointerEvents="auto"
            style={[
              styles.edgeGesture,
              side === 'left'
                ? {
                  left: 0,
                }
                : {
                  right: 0,
                },
              {
                width: edgeWidth,
              },
            ]}
          />
        )}

      {/* Drawer */}
      <Animated.View
        {...drawerPanResponder.panHandlers}
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            [side]: 0,
            transform: [
              {
                translateX,
              },
            ],
          },
          drawerStyle,
        ]}
        accessibilityViewIsModal
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,

    /**
     * Important:
     *
     * box-none allows the underlying screen
     * to remain interactive where the drawer
     * and backdrop are not consuming touches.
     */
    pointerEvents: 'box-none',
  },

  backdrop: {
    backgroundColor: '#000',
  },

  edgeGesture: {
    position: 'absolute',
    top: 0,
    bottom: 0,

    zIndex: 20,
  },

  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,

    backgroundColor: '#fff',

    zIndex: 30,

    elevation: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
});

