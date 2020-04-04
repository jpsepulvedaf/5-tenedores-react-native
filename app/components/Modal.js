import React from "react";
import { StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";

export default function Modal(props) {
  const { isVisible, setIsVisible, children } = props;

  const closeModal = () => setIsVisible(false);

  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0,.5)"
      overlayStyle={styles.oberlay}
      onBackdropPress={closeModal}
    >
      {children}
    </Overlay>
  );
}

const styles = StyleSheet.create({
  oberlay: {
    height: "auto",
    width: "90%",
    backgroundColor: "#fff"
  }
});
