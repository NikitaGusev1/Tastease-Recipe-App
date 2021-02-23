import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  ImageBackground,
} from 'react-native';

export function RecipeCard({recipes}) {
  const navigation = useNavigation();

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
              // style={{width: 100, height: 100}}
              style={styles.image}
              source={{uri: recipe.image}}
            />

            <Text style={{fontSize: 18}}>{recipe.title}</Text>
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
