import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {LoginScreen} from './android/app/src/main/components/screens/LoginScreen';
import {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigator} from './android/app/src/main/components/navigators/StackNavigator';
import {API_KEY, base_url} from './android/app/src/main/utils/values';
import axios from 'axios';
import {AuthContext} from './android/app/src/main/components/context';
import SQLite from 'react-native-sqlite-storage';
import {RegistrationScreen} from './android/app/src/main/components/screens/RegistrationScreen';

const Stack = createStackNavigator();

export default function App() {
  const [duplicated, setDuplicated] = useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const successCB = () => {
    console.log('Database Opened');
  };

  const errorCB = (error) => {
    alert(`SQL Error: ${error}`);
    alert('Something wrong happened, try again');
  };

  const db = SQLite.openDatabase(
    {name: 'db', location: 'default'},
    successCB,
    errorCB,
  );

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  async function sendUsernameToApi(userName) {
    try {
      const res = await axios.post(
        `${base_url}/users/connect?apiKey=${API_KEY}`,
        {
          username: userName,
        },
      );

      return res.data;
    } catch (error) {
      alert(error);
    }
  }

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (userName, password) => {
        let userToken;
        db.transaction((tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, generatedUsername TEXT NOT NULL UNIQUE, hash TEXT PRIMARY KEY NOT NULL UNIQUE, listOfFavourites TEXT)',
            [],
            (tx, results) => {},
            errorCB,
          );
        });

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [userName, password],
            async (tx, results) => {
              let datalength = results.rows.length;
              if (datalength == 1) {
                for (let i = 0; i < datalength; i++) {
                  let row = results.rows.item(i);

                  const generatedUsername = row.generatedUsername;
                  const hash = row.hash;

                  try {
                    userToken = 'loggedIn';
                    await AsyncStorage.setItem('userToken', userToken);
                    await AsyncStorage.setItem(
                      'generatedUsername',
                      generatedUsername,
                    );
                    await AsyncStorage.setItem('hash', hash);
                  } catch (error) {
                    alert(error);
                  }

                  dispatch({type: 'LOGIN', id: userName, token: userToken});

                  db.close();
                }
              } else if (datalength == 0) {
                alert('Username or password are incorrect');
              } else {
                alert('Something went wrong');
              }
            },
            errorCB,
          );
        });
      },

      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (error) {
          alert(error);
        }

        dispatch({type: 'LOGOUT'});
      },

      signUp: async (userName, password) => {
        let userToken = null;

        db.transaction((tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, generatedUsername TEXT NOT NULL UNIQUE, hash TEXT PRIMARY KEY NOT NULL UNIQUE, listOfFavourites TEXT)',
            [],
            (tx, results) => {},
            errorCB,
          );
        });

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM users WHERE username = ?',
            [userName],
            (tx, results) => {
              let datalength = results.rows.length;
              if (datalength > 0) {
                setDuplicated(true);
              }
            },
            errorCB,
          );
        });

        if (duplicated === true) {
          alert('Username already taken');
          setDuplicated(false);
        } else {
          const result = await sendUsernameToApi(userName);

          const status = result.status;

          if (status === 'failure') {
            alert('Username already taken');
          } else if (status === 'success') {
            const genUsername = result.username;
            const hashValue = result.hash;

            db.transaction((tx) => {
              tx.executeSql(
                'INSERT INTO users(username, password, generatedUsername, hash) VALUES (?,?,?,?)',
                [userName, password, genUsername, hashValue],
                (tx, results) => {},
                errorCB,
              );
            });

            db.close();

            try {
              userToken = 'loggedIn';
              await AsyncStorage.setItem('userToken', userToken);
              await AsyncStorage.setItem(`generatedUsername`, genUsername);
              await AsyncStorage.setItem(`hash`, hashValue);
            } catch (error) {
              alert(error);
            }
          }
        }

        dispatch({type: 'REGISTER', id: userName, token: userToken});
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (error) {
        console.log(error);
      }

      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken != null ? <StackNavigator /> : <LoginStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

export function LoginStack() {
  return (
    <Stack.Navigator screenOptions={() => ({headerShown: false})}>
      <Stack.Screen name="SignInScreen" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}
