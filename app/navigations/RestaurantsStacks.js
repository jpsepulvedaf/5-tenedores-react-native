import { createStackNavigator } from "react-navigation-stack";
import RestaurantsScreens from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";

const RestaurantsScreenStacks = createStackNavigator({
  Restaurants: {
    screen: RestaurantsScreens,
    navigationOptions: () => ({
      title: "Restaurantes"
    })
  },
  AddRestaurants: {
    screen: AddRestaurantScreen,
    navigationOptions: () => ({
      title: "Nuevo Restaurante"
    })
  }
});

export default RestaurantsScreenStacks;
