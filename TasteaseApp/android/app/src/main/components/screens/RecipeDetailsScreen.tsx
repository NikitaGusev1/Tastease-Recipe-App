import axios from 'axios';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, Button, Image, Modal} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {base_url, API_KEY} from '../../utils/values';
import {RecipeCardWithoutImage} from '../RecipeCardWithoutImage';

export function RecipeDetailsScreen({route, navigation}) {
  const {id} = route.params;

  const title = '';
  const image = '';
  const readyInMinutes = Number;
  const cuisines = [];
  const dishTypes = [];
  const diets = [];
  const extendedIngredients = [];
  const instructions = '';
  const vegan = Boolean;
  const vegetarian = Boolean;
  const servings = Number;

  const [recipeInfo, setInfo] = useState({
    title,
    image,
    readyInMinutes,
    cuisines,
    instructions,
    vegan,
    vegetarian,
    servings,
    dishTypes,
    diets,
    extendedIngredients,
  });
  const [recipeInstructions, setInstructions] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  async function fetchData() {
    try {
      const res = await axios.get(
        `${base_url}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`,
      );
      const info = res.data;
      setInfo(info);
    } catch (error) {
      alert(error);
    }
  }

  async function getSimilarRecipes() {
    try {
      const res = await axios.get(
        `${base_url}/recipes/${id}/similar?apiKey=${API_KEY}`,
      );
      const info = res.data;
      setSimilarRecipes(info);
    } catch (error) {
      alert(error);
    }
  }

  async function getInstructions() {
    try {
      const res = await axios.get(
        `${base_url}/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`,
      );
      const info = res.data;
      setInstructions(info);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getInstructions();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getSimilarRecipes();
  }, []);

  const toggleModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView>
      <View>
        <View style={{alignSelf: 'center'}}>
          <Image
            style={{width: 260, height: 150}}
            source={{uri: recipeInfo.image}}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 5,
            alignSelf: 'center',
            marginLeft: 5,
          }}>
          {recipeInfo.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            marginLeft: 5,
          }}>{`Ready in ${recipeInfo.readyInMinutes} minutes`}</Text>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            marginLeft: 5,
          }}>{`${recipeInfo.servings} servings`}</Text>
        <View>
          {recipeInfo.cuisines.length > 0 ? (
            <Text
              style={{
                textTransform: 'capitalize',
                fontSize: 16,
                marginBottom: 5,
                marginLeft: 5,
              }}>{`${recipeInfo.cuisines} cuisine`}</Text>
          ) : (
            <Text style={{fontSize: 16, marginBottom: 5, marginLeft: 5}}>
              Worldwide cuisine
            </Text>
          )}
        </View>
        <Text
          style={{
            fontSize: 16,
            textTransform: 'capitalize',
            marginBottom: 5,
            marginLeft: 5,
          }}>{`Suitable for: ${recipeInfo.dishTypes}`}</Text>
        <Text
          style={{
            textTransform: 'capitalize',
            fontSize: 16,
            marginLeft: 5,
          }}>{`${recipeInfo.diets}`}</Text>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>
            You will need:
          </Text>
          <View>
            {recipeInfo.extendedIngredients.map((ingredient) => (
              <View key={ingredient.id}>
                <View style={{alignSelf: 'center'}}>
                  <Image source={ingredient.image} />
                </View>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      fontSize: 16,
                      marginLeft: 5,
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    {`${ingredient.name}`}
                    <Text style={{flex: 1, flexDirection: 'row'}}>:</Text>{' '}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        flex: 1,
                        flexDirection: 'row',
                        textTransform: 'none',
                      }}>
                      {`${ingredient.measures.metric.amount}`}{' '}
                      <Text
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          textTransform: 'none',
                        }}>{`${ingredient.measures.metric.unitShort}`}</Text>
                    </Text>
                  </Text>
                </View>
              </View>
            ))}

            <ScrollView style={{marginLeft: 5, marginTop: 10}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  flex: 1,
                  flexDirection: 'row',
                  textTransform: 'none',
                  marginBottom: 5,
                }}>
                To Prepare:
              </Text>
              <View>
                {recipeInstructions.length > 0 ? (
                  <View>
                    {recipeInstructions.map((element) => (
                      <View>
                        <View style={{marginTop: 5}}>
                          {element.steps.map((step) => (
                            <View style={{marginBottom: 10}}>
                              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                {step.number}
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                  }}>{`. `}</Text>
                                <Text
                                  style={{fontSize: 16, fontWeight: 'normal'}}>
                                  {step.step}
                                </Text>
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View>
                    <Text style={{fontSize: 16}}>
                      Sorry, this recipe does not have instructions
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <Button
          title="Find Similar Recipes"
          onPress={() => setModalVisible(!modalVisible)}
        />
      </View>
      <Modal visible={modalVisible}>
        <View>
          <Text style={{alignSelf: 'center', fontSize: 20, marginBottom: 10}}>
            Similar Recipes
          </Text>
        </View>
        <ScrollView>
          <RecipeCardWithoutImage
            recipes={similarRecipes}
            onPress={() => toggleModal()}
          />
          <Button title="Close" onPress={() => setModalVisible(false)}></Button>
        </ScrollView>
      </Modal>
      <View style={{marginTop: 10}}>
        <Button title="Go Back" onPress={navigation.goBack} />
      </View>
    </ScrollView>
  );
}
