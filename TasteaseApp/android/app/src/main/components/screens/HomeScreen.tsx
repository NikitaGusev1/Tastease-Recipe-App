import * as React from 'react';
import {Button, Modal, ScrollView, View} from 'react-native';
import {TextInput} from 'react-native';
import axios from 'axios';
import {useState} from 'react';
import {base_url, API_KEY} from '../../utils/values';
import {RecipeCard} from '../RecipeCard';
import MultiSelect from 'react-native-multiple-select';

export function HomeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const cuisines = [
    {
      id: 'African',
      name: 'African',
    },
    {
      id: 'American',
      name: 'American',
    },

    {
      id: 'British',
      name: 'British',
    },
    {
      id: 'Cajun',
      name: 'Cajun',
    },
    {
      id: 'Caribbean',
      name: 'Caribbean',
    },
    {
      id: 'Chinese',
      name: 'Chinese',
    },
    {
      id: 'Eastern European',
      name: 'Eastern European',
    },
    {
      id: 'European',
      name: 'European',
    },
    {
      id: 'French',
      name: 'French',
    },

    {
      id: 'German',
      name: 'German',
    },
    {
      id: 'Greek',
      name: 'Greek',
    },
    {
      id: 'Indian',
      name: 'Indian',
    },
    {
      id: 'Irish',
      name: 'Irish',
    },
    {
      id: 'Italian',
      name: 'Italian',
    },
    {
      id: 'Japanese',
      name: 'Japanese',
    },
    {
      id: 'Jewish',
      name: 'Jewish',
    },
    {
      id: 'Korean',
      name: 'Korean',
    },
    {
      id: 'Latin American',
      name: 'Latin American',
    },
    {
      id: 'Mediterranean',
      name: 'Mediterranean',
    },
    {
      id: 'Mexican',
      name: 'Mexican',
    },
    {
      id: 'Middle Eastern',
      name: 'Middle Eastern',
    },
    {
      id: 'Southern',
      name: 'Southern',
    },
    {
      id: 'Spanish',
      name: 'Spanish',
    },
    {
      id: 'Thai',
      name: 'Thai',
    },
    {
      id: 'Vietnamese',
      name: 'Vietnamese',
    },
  ];

  const diets = [
    {
      id: 'Gluten Free',
      name: 'Gluten Free',
    },
    {
      id: 'Ketogenic',
      name: 'Ketogenic',
    },
    {
      id: 'Vegetarian',
      name: 'Vegetarian',
    },
    {
      id: 'Lacto-Vegetarian',
      name: 'Lacto-Vegetarian',
    },
    {
      id: 'Ovo-Vegetarian',
      name: 'Ovo-Vegetarian',
    },
    {
      id: 'Vegan',
      name: 'Vegan',
    },
    {
      id: 'Pescetarian',
      name: 'Pescetarian',
    },
    {
      id: 'Paleo',
      name: 'Paleo',
    },
    {
      id: 'Primal',
      name: 'Primal',
    },
    {
      id: 'Whole30',
      name: 'Whole30',
    },
  ];

  const mealTypes = [
    {
      id: 'Main Course',
      name: 'Main Course',
    },
    {
      id: 'Side Dish',
      name: 'Side Dish',
    },
    {
      id: 'Dessert',
      name: 'Dessert',
    },
    {
      id: 'Appetizer',
      name: 'Appetizer',
    },
    {
      id: 'Salad',
      name: 'Salad',
    },
    {
      id: 'Bread',
      name: 'Bread',
    },
    {
      id: 'Breakfast',
      name: 'Breakfast',
    },
    {
      id: 'Soup',
      name: 'Soup',
    },
    {
      id: 'Beverage',
      name: 'Beverage',
    },
    {
      id: 'Sauce',
      name: 'Sauce',
    },
    {
      id: 'Marinade',
      name: 'Marinade',
    },
    {
      id: 'Fingerfood',
      name: 'Fingerfood',
    },
    {
      id: 'Snack',
      name: 'Snack',
    },
    {
      id: 'Drink',
      name: 'Drink',
    },
  ];

  const onSelectedCuisinesChange = (selectedCuisines) => {
    setSelectedCuisines(selectedCuisines);
  };

  const onSelectedDietsChange = (selectedDiets) => {
    setSelectedDiet(selectedDiets);
  };

  const onSelectedMealTypesChange = (selectedMealTypes) => {
    setSelectedMealTypes(selectedMealTypes);
  };

  async function fetchData() {
    try {
      const res = await axios.get(
        `${base_url}/recipes/complexSearch?query=${searchTerm}&type=${selectedMealTypes}&instructionsRequired=true&cuisine=${selectedCuisines}&diet=${selectedDiet}&apiKey=${API_KEY}`,
      );
      const recipesList = res.data.results;
      setRecipes(recipesList);
    } catch (error) {
      alert(error);
    }
  }

  const handleSearch = () => {
    fetchData();
  };

  return (
    <>
      <TextInput
        style={{fontSize: 16}}
        placeholder="What would you like to eat?"
        onChangeText={(text) => setTerm(text)}
        value={searchTerm}
      />

      <Button title="Search" onPress={handleSearch} />
      <RecipeCard recipes={recipes} />

      <Button
        title="Filters"
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      />

      <Modal visible={modalVisible}>
        <ScrollView style={{flex: 1, marginTop: 5}}>
          <View>
            <MultiSelect
              items={cuisines}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedCuisinesChange}
              selectedItems={selectedCuisines}
              selectText="Cuisines"
              searchInputPlaceholderText="Search Cuisines..."
              altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor="blue"
              submitButtonText="Submit"
              fixedHeight={true}
              hideSubmitButton
            />
          </View>
          <View style={{marginTop: 40}}>
            <MultiSelect
              single={true}
              items={diets}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedDietsChange}
              selectedItems={selectedDiet}
              selectText="Diets"
              searchInputPlaceholderText="Search Diets..."
              altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor="blue"
              submitButtonText="Submit"
              fixedHeight
              hideSubmitButton
            />
          </View>
          <View style={{marginTop: 40}}>
            <MultiSelect
              single={true}
              items={mealTypes}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedMealTypesChange}
              selectedItems={selectedMealTypes}
              selectText="Meal Type"
              searchInputPlaceholderText="Search Meal Types..."
              altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor="blue"
              submitButtonText="Submit"
              fixedHeight
              hideSubmitButton
            />
          </View>
          <View style={{marginBottom: 10, marginTop: 50}}>
            <Button
              onPress={() => {
                setSelectedCuisines([]);
                setSelectedDiet([]);
                setSelectedMealTypes([]);
              }}
              title="Clear Filters"
            />
          </View>
          <Button
            onPress={() => {
              setModalVisible(false);
            }}
            title="Close"
          />
        </ScrollView>
      </Modal>
    </>
  );
}
