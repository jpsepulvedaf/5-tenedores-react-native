import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function LoginFacebook() {
  const login = async () => {
    await Facebook.initializeAsync(FacebookApi.application_id);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: FacebookApi.permissions
    });

    console.log(type);
  };

  return (
    <SocialIcon
      title="Iniciar sesión con Facebook"
      button
      type="facebook"
      onPress={login}
    />
  );
}
