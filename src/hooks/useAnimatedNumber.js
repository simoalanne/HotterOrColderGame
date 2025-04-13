import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const useAnimatedNumber = (initialValue = 0) => {
  const [animatedTemp, setAnimatedTemp] = useState(initialValue);
  const animatedValue = useRef(new Animated.Value(initialValue))
  useEffect(() => {
    const currentVal = animatedValue.current;
    const listener = currentVal.addListener((v) => {
      setAnimatedTemp(v.value);
    });

    return () => {
      currentVal.removeListener(listener);
    };
  }, []);

  const animateTo = (toValue = 0, duration = 3000) => {
    animatedValue.current.setValue(0);
    return new Promise((resolve) =>
      Animated.timing(animatedValue.current, {
        toValue,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(resolve)
    );
  };

  return { animatedTemp, animateTo };
};

export default useAnimatedNumber;