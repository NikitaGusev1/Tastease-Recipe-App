import React, {useContext} from 'react';
import {Button} from 'react-native';

import {AuthContext} from '../context';

export function DrawerContent(props) {
  const {signOut} = useContext(AuthContext);

  return (
    <Button
      title="Sign Out"
      onPress={() => {
        signOut();
      }}
    />
  );
}
