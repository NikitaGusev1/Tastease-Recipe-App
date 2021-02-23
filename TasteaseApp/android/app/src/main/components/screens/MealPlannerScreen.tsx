import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import dayjs from 'dayjs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

export function MealPlannerScreen() {
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

  const getFormattedDates = () => {
    let dates = [];
    for (let i = 0; i <= 7; i++) {
      dates.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
    }

    return dates;
  };
  const formattedDates = getFormattedDates();

  return (
    <SafeAreaView>
      <Text style={{marginBottom: 10, alignSelf: 'center', fontSize: 18}}>
        Select a day to plan your meals for:
      </Text>
      {formattedDates.map((day) => (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          key={day}
          onPress={async () => {
            navigation.navigate('Meal Plan', {
              selectedDate: day,
              generatedUsername: await getGeneratedUsername(),
              hash: await getApiHash(),
            });
          }}>
          <Text style={{marginBottom: 5, fontSize: 18}}>
            {`${dayjs(day).format('dddd, MMM DD')} >`}
          </Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}
