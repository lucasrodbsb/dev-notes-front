import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Overlay } from "react-native-elements";

const { height } = Dimensions.get("window");

type Props = {
  show: boolean;
  close: () => void;
  children: JSX.Element | JSX.Element[] | undefined;
  bgColor: string;
};

const CustomBottomModal = ({ show, close, bgColor, children }: Props) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const [isOverlayOpen, setIsOverlayOpen] = React.useState<boolean>(false);

  const handleCloseOverlay = () => {
    setTimeout(() => {
      setIsOverlayOpen(false);
    }, 100);
  };

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        useNativeDriver: true,
        tension: 10,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    handleCloseOverlay();
  };

  React.useEffect(() => {
    if (show) {
      setIsOverlayOpen(true);
      openModal();
    } else {
      closeModal();
    }
  }, [show]);

  return (
    <Overlay
      isVisible={isOverlayOpen}
      onBackdropPress={close}
      overlayStyle={{
        width: "100%",
        display: "flex",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        bottom: 0,
        padding: 0,
      }}
      backdropStyle={{
        backgroundColor: '#00000042'
    }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: state.opacity,
            transform: [{ translateY: state.container }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY: state.modal }],
              backgroundColor: bgColor,
            },
          ]}
        >
          <View style={styles.indicator} />
          {children}
        </Animated.View>
      </Animated.View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgb(255, 255, 255)",
    position: "absolute",
  },
  modal: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: "#cccccc45",
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default CustomBottomModal;
