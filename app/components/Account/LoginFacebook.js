import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    await Facebook.initializeAsync(FacebookApi.application_id);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: FacebookApi.permissions
    });

    setIsLoading(true);
    if (type === "success") {
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          navigation.navigate("MyAccount");
        })
        .catch(() => {
          toastRef.current.show(
            "Error accediendo con Facebook. Inténtelo más tarde."
          );
        });
    } else if (type === "cancel") {
      toastRef.current.show("Inicio de sessión cancelado.");
    } else {
      toastRef.current.show("Error desconocido, inténtelo más tarde.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <SocialIcon
        title="Iniciar sesión con Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={isLoading} text="Iniciando sessión." />
    </>
  );
}
