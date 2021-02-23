import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useContext} from 'react';
import {Button} from 'react-native';
import {AuthContext} from '../context';
import {HomeScreen} from '../screens/HomeScreen';
import {MealPlannerScreen} from '../screens/MealPlannerScreen';
import {ShoppingListScreen} from '../screens/ShoppingListScreen';

export function DrawerNavigator() {
  const Drawer = createDrawerNavigator();
  const {signOut} = useContext(AuthContext);

  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => ({
        headerShown: true,
        headerLeft: () => (
          <Button title={'Menu'} onPress={() => navigation.toggleDrawer()} />
        ),
        headerRight: () => (
          <Button
            title="Sign Out"
            onPress={() => {
              signOut();
            }}
          />
        ),
      })}
      initialRouteName="Search">
      <Drawer.Screen name="Search" component={HomeScreen} />
      <Drawer.Screen name="Meal Planner" component={MealPlannerScreen} />
      <Drawer.Screen name="Shopping List" component={ShoppingListScreen} />
    </Drawer.Navigator>
  );
}
