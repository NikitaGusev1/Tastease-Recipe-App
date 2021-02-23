import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {DrawerNavigator} from './DrawerNavigator';
import {RecipeDetailsScreen} from '../screens/RecipeDetailsScreen';
import {LoginScreen} from '../screens/LoginScreen';
import {MealPlanSearchScreen} from '../screens/MealPlanSearchScreen';
import {MealPlanAddScreen} from '../screens/MealPlanAddScreen';

export function StackNavigator() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={() => ({headerShown: true})}>
      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetailsScreen}
        options={{title: 'Recipe Details'}}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="MealPlanSearchScreen"
        options={{title: 'Add Dish'}}
        component={MealPlanSearchScreen}
      />
      <Stack.Screen name="Meal Plan" component={MealPlanAddScreen} />
    </Stack.Navigator>
  );
}
