import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import dayjs, {unix} from 'dayjs';
import * as React from 'react';
import {useEffect, useState} from 'react';
import 'dayjs/plugin/timezone';
import 'dayjs/plugin/utc';
import {
  Text,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import {API_KEY, base_url} from '../utils/values';

export function RecipeCardWithAdd({recipes, selectedDate}) {
  const navigation = useNavigation();
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [apiHash, setApiHash] = useState('');

  function fetchData(recipeId, recipeTitle, recipeImage) {
    try {
      const res = axios
        .post(
          `${base_url}/mealplanner/${generatedUsername}/items/?hash=${apiHash}&apiKey=${API_KEY}`,
          {
            date: dayjs(selectedDate).add(1, 'day').unix(),
            position: 0,
            type: 'RECIPE',
            value: {
              id: recipeId,
              title: recipeTitle,
              image: recipeImage,
              servings: 1,
            },
          },
        )
        .then(function (response) {
          navigation.navigate('Meal Plan', {
            recipeId: recipeId,
            title: recipeTitle,
            image: recipeImage,
            itemId: response.data.id,
          });
        });
    } catch (error) {
      alert(error);
    }
  }

  const getGeneratedUsername = async () => {
    try {
      const generatedUsername = await AsyncStorage.getItem(
        'generatedUsername',
      ).then((generatedUsername) => {
        setGeneratedUsername(generatedUsername);
      });
    } catch (error) {
      alert(error);
    }
  };

  const getApiHash = async () => {
    try {
      const apiHash = await AsyncStorage.getItem('hash').then((hash) => {
        setApiHash(hash);
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getGeneratedUsername();
  }, []);

  useEffect(() => {
    getApiHash();
  }, []);

  const handleSearch = (recipeId, recipeTitle, recipeImage) => {
    fetchData(recipeId, recipeTitle, recipeImage);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
      centerContent
      alwaysBounceVertical>
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          onPress={() => {
            navigation.navigate('RecipeDetails', {
              id: recipe.id,
            });
          }}>
          <View style={styles.container}>
            <ImageBackground
              imageStyle={{justifyContent: 'center', alignContent: 'center'}}
              style={styles.image}
              source={{uri: recipe.image}}
            />

            <Text style={{fontSize: 18}}>{recipe.title}</Text>
            <Button
              title="Add >>"
              onPress={() => {
                handleSearch(recipe.id, recipe.title, recipe.image);
              }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
