import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export function RecipeCardWithoutImage({recipes, onPress}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
      centerContent
      alwaysBounceVertical>
      {recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          onPress={() => {
            navigation.push('RecipeDetails', {
              id: recipe.id,
            });
            onPress();
          }}>
          <View style={styles.container}>
            <Text style={{fontSize: 18}}>{`${recipe.title} >`}</Text>
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
