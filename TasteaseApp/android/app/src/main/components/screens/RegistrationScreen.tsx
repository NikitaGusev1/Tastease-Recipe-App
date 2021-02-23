import * as yup from 'yup';
import {Formik} from 'formik';
import React from 'react';
import {TextInput, Text, Button} from 'react-native';
import {AuthContext} from '../context';
import {CONSTANTS, JSHash} from 'react-native-hash';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export function RegistrationScreen() {
  const {signUp} = React.useContext(AuthContext);
  const navigation = useNavigation();

  const handleSubmit = (username, password) => {
    JSHash(password, CONSTANTS.HashAlgorithms.sha256)
      .then((hashedPassword) => {
        signUp(username, hashedPassword);
      })
      .catch((error) => alert(error));
  };

  return (
    <Formik
      initialValues={{username: '', password: '', passwordConfirmation: ''}}
      onSubmit={(values) => {}}
      validationSchema={yup.object().shape({
        username: yup.string().required(),
        password: yup
          .string()
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/,
            'Must contain 12 characters, one uppercase, one lowercase, one number and one special character',
          )
          .required(),
        passwordConfirmation: yup
          .string()
          .oneOf([yup.ref('password'), null], 'Passwords must match')
          .required('Confirming password is required'),
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
          <TextInput
            value={values.passwordConfirmation}
            onChangeText={handleChange('passwordConfirmation')}
            placeholder="Confirm Password"
            onBlur={() => setFieldTouched('passwordConfirmation')}
            secureTextEntry={true}
            style={{fontSize: 16}}
          />
          {touched.passwordConfirmation && errors.passwordConfirmation && (
            <Text style={{fontSize: 16, color: 'red'}}>
              {errors.passwordConfirmation}
            </Text>
          )}
          <Button
            title="Sign Up"
            disabled={!isValid}
            onPress={() => handleSubmit(values.username, values.password)}
          />
          <TouchableOpacity
            style={{marginTop: 5}}
            onPress={() => navigation.navigate('SignInScreen')}>
            <Text style={{fontSize: 16}}>
              Already have an account? Press here to sign in {'>>'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Formik>
  );
}
