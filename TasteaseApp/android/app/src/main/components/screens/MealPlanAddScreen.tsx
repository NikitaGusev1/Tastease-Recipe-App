import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_KEY, base_url} from '../../utils/values';
import {useNavigation} from '@react-navigation/native';
import {RecipeCardWithRemove} from '../RecipeCardWithRemove';

export function MealPlanAddScreen({route}) {
  const {selectedDate, generatedUsername, hash} = route.params;

  const [planItems, setPlanItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();

    wait(2000).then(() => setRefreshing(false));
  }, []);

  async function fetchData() {
    try {
      const res = await axios.get(
        `${base_url}/mealplanner/${generatedUsername}/day/${selectedDate}?hash=${hash}&apiKey=${API_KEY}`,
      );
      if (res.status === 200) {
        const result = res.data.items;
        setPlanItems(result);
      } else if ((res.status = 400)) {
        setPlanItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function generateShoppingList() {
    try {
      const res = await axios.post(
        `${base_url}/mealplanner/${generatedUsername}/shopping-list/${selectedDate}/${selectedDate}?hash=${hash}&apiKey=${API_KEY}`,
      );
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchData();
    });
  }, []);

  const updateRecipes = (recipes, id) => {
    const newArray = recipes.filter((recipe) => recipe.id !== id);
    setPlanItems(newArray);
  };

  return (
    <View>
      {planItems.length > 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 10,
              marginTop: 10,
              alignSelf: 'center',
            }}>
            {selectedDate}
          </Text>

          <TouchableOpacity>
            <RecipeCardWithRemove
              recipes={planItems}
              gen={generatedUsername}
              hash={hash}
              updateRecipes={updateRecipes}
            />
          </TouchableOpacity>

          <View style={{marginTop: 15}}>
            <Button
              title="Add New Dish"
              onPress={() =>
                navigation.navigate('MealPlanSearchScreen', {
                  selectedDate: selectedDate,
                })
              }
            />
            <View style={{marginTop: 10}}>
              <Button
                title="Generate Shopping List"
                onPress={() => {
                  alert('Shopping list generated!');
                  generateShoppingList();
                }}
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{marginTop: 5}}>
          <Text style={{fontSize: 18, marginLeft: 5}}>
            Nothing planned! Press the button to add a dish!
          </Text>
          <View style={{marginTop: 15}}>
            <Button
              title="Add New Dish"
              onPress={() =>
                navigation.navigate('MealPlanSearchScreen', {
                  selectedDate: selectedDate,
                })
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}
