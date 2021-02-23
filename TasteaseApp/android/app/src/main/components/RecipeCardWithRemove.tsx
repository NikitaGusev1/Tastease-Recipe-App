import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import * as React from 'react';
import {
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';
import {API_KEY, base_url} from '../utils/values';

export function RecipeCardWithRemove(props) {
  const navigation = useNavigation();

  async function deleteRecipe(recipeId, gen, hash) {
    try {
      const res = await axios.delete(
        `${base_url}/mealplanner/${gen}/items/${recipeId}?hash=${hash}&apiKey=${API_KEY}`,
      );
    } catch (error) {
      alert(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
      centerContent
      alwaysBounceVertical>
      {props.recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          onPress={() => {
            navigation.navigate('RecipeDetails', {
              id: recipe.value.id,
            });
          }}>
          <View style={styles.container}>
            <ImageBackground
              imageStyle={{justifyContent: 'center', alignContent: 'center'}}
              style={styles.image}
              source={{uri: recipe.value.image}}
            />
            <Text style={{fontSize: 18}}>{recipe.value.title}</Text>
          </View>
          <View style={{marginBottom: 15}}>
            <Button
              title="Remove >>"
              onPress={() => {
                deleteRecipe(recipe.id, props.gen, props.hash);
                props.updateRecipes(props.recipes, recipe.id);
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
