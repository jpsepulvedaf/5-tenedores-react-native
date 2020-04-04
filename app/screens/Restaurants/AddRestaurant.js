import React, { useState, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";

export default function AddRstaurant(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const [isLoadin, setIsLoading] = useState(false);

  return (
    <View>
      <AddRestaurantForm
        navigation={navigation}
        toastRef={toastRef}
        setIsLoading={setIsLoading}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoadin} text="Creando Restaurante" />
    </View>
  );
}
