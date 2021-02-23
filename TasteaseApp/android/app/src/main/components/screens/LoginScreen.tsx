import * as yup from 'yup';
import {Formik} from 'formik';
import React from 'react';
import {TextInput, Text, Button} from 'react-native';
import {AuthContext} from '../context';
import {CONSTANTS, JSHash} from 'react-native-hash';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export function LoginScreen() {
  const {signIn} = React.useContext(AuthContext);
  const navigation = useNavigation();

  const handleSubmit = (username, password) => {
    JSHash(password, CONSTANTS.HashAlgorithms.sha256).then((hash) =>
      signIn(username, hash),
    );
  };

  return (
    <Formik
      initialValues={{username: '', password: ''}}
      onSubmit={(values) => {}}
      validationSchema={yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
      })}>
      {({values, handleChange, errors, setFieldTouched, touched, isValid}) => (
        <>
          <TextInput
            value={values.username}
            onChangeText={handleChange('username')}
            onBlur={() => setFieldTouched('username')}
            placeholder="Username"
            style={{fontSize: 16}}
          />
          {touched.username && errors.username && (
            <Text style={{fontSize: 16, color: 'red'}}>{errors.username}</Text>
          )}
          <TextInput
            value={values.password}
            onChangeText={handleChange('password')}
            placeholder="Password"
            onBlur={() => setFieldTouched('password')}
            secureTextEntry={true}
            style={{fontSize: 16}}
          />
          {touched.password && errors.password && (
            <Text style={{fontSize: 16, color: 'red'}}>{errors.password}</Text>
          )}
          <Button
            title="Sign In"
            disabled={!isValid}
            onPress={() => handleSubmit(values.username, values.password)}
          />
          <TouchableOpacity
            style={{marginTop: 5}}
            onPress={() => navigation.navigate('SignUp')}>
            <Text style={{fontSize: 16}}>
              Don't have an account? Press here to sign up {'>>'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Formik>
  );
}
