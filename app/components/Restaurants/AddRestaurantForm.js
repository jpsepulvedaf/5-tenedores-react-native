import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [imagesSelected, setImagesSelected] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = () => {
    if (!restaurantName || !restaurantAddress || !restaurantDescription) {
      toastRef.current.show(
        "Todos los campos del formulario son obligatorios.",
        3000
      );
    } else if (imagesSelected.length === 0) {
      toastRef.current.show(
        "El restaurante debe tener al menos una foto.",
        3000
      );
    } else if (!locationRestaurant) {
      toastRef.current.show("Debes localizar el restaurante en el mapa.", 3000);
    } else {
      //setIsLoading(true);
      uploadImagesStorage(imagesSelected);
    }
  };

  const create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  const uploadImagesStorage = async imageArray => {
    const imageBlob = [];
    await Promise.all(
      imageArray.map(async image => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase
          .storage()
          .ref("restaurant-images")
          .child(create_UUID());
        await ref.put(blob).then(result => {
          console.log(result);
        });
      })
    );
  };

  return (
    <ScrollView>
      <ImageRestaurant
        imagenRestaurant={imagesSelected[imagesSelected.length - 1]}
      />
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
        toastRef={toastRef}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function ImageRestaurant(props) {
  const { imagenRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      {imagenRestaurant ? (
        <Image
          source={{ uri: imagenRestaurant }}
          style={{ width: widthScreen, height: 200 }}
        />
      ) : (
        <Image
          source={require("../../../assets/no-image.png")}
          style={{ width: widthScreen, height: 200 }}
        />
      )}
    </View>
  );
}

function UploadImage(props) {
  const { imagesSelected, setImagesSelected, toastRef } = props;
  const imageSelect = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galería. Si los has rechazado tienes que ir a ajustes y activarlos manualmente.",
        5000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galería sin seleccionar ninguna imagen.",
          3000
        );
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = image => {
    const arrayImages = imagesSelected;
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro de que quieres eliminar la imagen?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () =>
            setImagesSelected(
              arrayImages.filter(imageUrl => imageUrl !== image)
            )
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImage}>
      {imagesSelected.length < 5 && (
        <Icon
          tyle="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {imagesSelected.map((imageRestaurant, indx) => (
        <Avatar
          key={indx}
          onPress={() => removeImage(imageRestaurant)}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
        />
      ))}
    </View>
  );
}

function FormAdd(props) {
  const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
    setIsVisibleMap,
    locationRestaurant
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={e => setRestaurantName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true)
        }}
        onChange={e => setRestaurantAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción del restaurante"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={e => setRestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setIsVisibleMap,
    setLocationRestaurant,
    toastRef
  } = props;

  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
      const statusPermissions = resultPermissions.permissions.location.status;
      if (statusPermissions !== "granted") {
        toastRef.current.show(
          "Para poder crear un restaurante tienes que aceptar los permisos de localización.",
          5000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({
          enableHighAccurracy: true
        });
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localización guardada correctamente.", 3000);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicación"
            onPress={confirmLocation}
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
          />
          <Button
            title="Cancelar Ubicación"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0
  },
  mapStyle: {
    width: "100%",
    height: 500
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  viewMapBtnContainerSave: {
    paddingRight: 3
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680"
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 3
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d"
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20
  }
});
