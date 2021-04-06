import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from './src/LoginPage';
import RegisterPage from './src/RegisterPage';
import MainPage from './src/MainPage';
import ContactList from './src/ContactList';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Alert,
  Text,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


function HomeScreen({navigation}) {
  const addman = (name, number) => {
    var newPerson = {
      phoneNumbers: [
        {
          label: 'mobile',
          number: number,
        },
      ],      
      givenName: name,
    }
    Contacts.addContact(newPerson);
  };
  const PermissionFlow = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS);
  };
  const [code, setCode] = React.useState({code: ''});

  const codeFunc = () => {
    
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS);
    fetch('https://gethem2020.herokuapp.com/getList', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code.code,
      }),
    })
      .then((responseData) => responseData.json())
      .then((responsejson) => {
        if (responsejson.message === 'unKnone code') {
          Alert.alert("Unknown code");
          return;
        } else if (responsejson.message === 'List is empty') {
          Alert.alert(responsejson.message);
          return;
        }
        for (var i = 0; responsejson[i] != null; i++) {
          addman(responsejson[i].name, responsejson[i].phone);
        }
        Alert.alert('All Contacts saved');
      })
      .catch((error) => {
        Toast.show(error);
        return;
      });
  };
  const changeCode = (val) => {
    setCode({code: val});
  };
  return (
    
    <View style={styles.container}>
      <View style={styles.buttonSpace}>
        <TouchableOpacity style={styles.loginbutton} onPress={() => navigation.navigate('Login')} >
          <Text style={styles.buttonsText}>Login</Text>
          </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerbutton}
          onPress={() => navigation.navigate('Register')}>
           <Text style={styles.buttonsText}>Register</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <TextInput
          style={styles.input}
          placeholder="Enter code here"
          placeholderTextColor="white"
          onChangeText={(text) => changeCode(text)}
          autoCapitalize="none"
          selectionColor="white"
        />
        <TouchableOpacity style={{height:40 ,
          backgroundColor:"indianred",
          paddingVertical:5,
          paddingHorizontal:50,
          borderRadius:25}} onPress={() => codeFunc()} >
          <Text style={{fontSize:20,color:'white'}}>  Enter</Text>
          </TouchableOpacity>
        
      </View>
      
    </View>
    
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="ContactList" component={ContactList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4682b4',
  },
  center: {
    alignSelf: 'center',
    top:'25%'
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    margin: 10,
    fontSize: 18,
    width: 150,
  },
  buttonSpace: {
    width:'100%',
    height:80,
    flexDirection:'row',
  },
  loginbutton:{
    height:'40%',
    width:100,
    top:'35%',
    left:'25%',
    backgroundColor:"indianred",
    borderRadius:25,
  },
  registerbutton:{
    height:'40%',
    width:100,
    top:'35%',
    left:'25%',
    backgroundColor:"indianred",
    borderRadius:25,
  },
  buttonsText:{
    textAlign:'center',
    fontSize:20,
    color:'white'
  }
});
export default App;
