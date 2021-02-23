import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, Modal, ToastAndroid} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {API_KEY, base_url} from '../../utils/values';
import Unorderedlist from 'react-native-unordered-list';

export function ShoppingListScreen() {
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);

  const navigation = useNavigation();

  const getGeneratedUsername = async () => {
    try {
      const gen = await AsyncStorage.getItem('generatedUsername');
      if (gen !== null) {
        return gen;
      }
    } catch (error) {
      alert(error);
    }
  };

  const getApiHash = async () => {
    try {
      const hash = await AsyncStorage.getItem('hash');
      if (hash !== null) {
        return hash;
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getShoppingList();
    });
  }, []);

  async function getShoppingList() {
    const generatedUsername = await getGeneratedUsername();
    const hash = await getApiHash();

    axios
      .get(
        `${base_url}/mealplanner/${generatedUsername}/shopping-list?hash=${hash}&apiKey=${API_KEY}`,
      )
      .then(function (response) {
        setItems(response.data.aisles);
      })
      .catch(function (error) {
        alert(error);
      });
  }

  async function addToShoppingList(item) {
    const generatedUsername = await getGeneratedUsername();
    const hash = await getApiHash();

    axios
      .post(
        `${base_url}/mealplanner/${generatedUsername}/shopping-list/items?hash=${hash}&apiKey=${API_KEY}`,
        {
          item: item,
          parse: true,
        },
      )
      .then(function (response) {
        const addedItem = response.data.aisles;
        items.concat(addedItem);
      })
      .catch(function (error) {
        alert(error);
      });
  }

  async function removeFromShoppingList(id) {
    const generatedUsername = await getGeneratedUsername();
    const hash = await getApiHash();

    axios
      .delete(
        `${base_url}/mealplanner/${generatedUsername}/shopping-list/items/${id}?hash=${hash}&apiKey=${API_KEY}`,
      )
      .then(function (response) {
        setItems([]);
        getShoppingList();
      })
      .catch(function (error) {
        alert(error);
      });
  }

  const handleChange = (text) => {
    let regex = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g;
    return regex.test(text);
  };

  return (
    <ScrollView>
      {items.length > 0 ? (
        <View>
          <ScrollView>
            {items.map((item, index) => (
              <View key={index}>
                {item.items.map((product) => (
                  <View key={product.id}>
                    <Unorderedlist style={{fontSize: 16}}>
                      <Text
                        style={{
                          marginBottom: 10,
                          fontSize: 18,
                          textTransform: 'capitalize',
                        }}>
                        {product.name}
                      </Text>
                    </Unorderedlist>
                    <View style={{alignSelf: 'flex-end'}}>
                      <Button
                        title="Remove"
                        onPress={() => {
                          removeFromShoppingList(product.id);
                        }}></Button>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
          <View style={{marginTop: 10}}>
            <Button
              title="Add New Product"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
          <Modal visible={modalVisible}>
            <TextInput
              placeholder="Add something to the list..."
              onChangeText={(text) => setText(text)}
              value={text}
              style={{fontSize: 16}}
            />
            <Button
              title="Add >>"
              onPress={() => {
                if (text.trim() == '') {
                  ToastAndroid.show(
                    "Product field can't be empty",
                    ToastAndroid.SHORT,
                  );
                } else if (!handleChange(text)) {
                  ToastAndroid.show(
                    'Special characters are not allowed',
                    ToastAndroid.SHORT,
                  );
                } else if (text) {
                  addToShoppingList(text);
                  ToastAndroid.show('Product Added', ToastAndroid.SHORT);
                }
              }}
            />
            <View style={{marginTop: 10}}>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  getShoppingList();
                }}
                title="Close"
              />
            </View>
          </Modal>
        </View>
      ) : (
        <View style={{marginTop: 5}}>
          <Text style={{fontSize: 16}}>
            Nothing added! Press the button to plan your shopping!
          </Text>
          <Modal visible={modalVisible}>
            <TextInput
              placeholder="Add something to the list..."
              onChangeText={(text) => setText(text)}
              value={text}
              style={{fontSize: 16}}
            />
            <Button
              title="Add >>"
              onPress={() => {
                if (!text) {
                  ToastAndroid.show(
                    "Product field can't be empty",
                    ToastAndroid.SHORT,
                  );
                }
                if (!handleChange(text)) {
                  ToastAndroid.show(
                    'Special characters are not allowed',
                    ToastAndroid.SHORT,
                  );
                } else {
                  addToShoppingList(text);
                }
              }}
            />
            <View style={{marginTop: 10}}>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  getShoppingList();
                }}
                title="Close"
              />
            </View>
          </Modal>
          <View style={{marginTop: 10}}>
            <Button
              title="Add New Product"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
