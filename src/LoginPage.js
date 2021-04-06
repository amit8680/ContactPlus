import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import {createStackNavigator} from '@react-navigation/stack';
import MainPage from './MainPage';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
    };
  }
  login = () => {
    fetch('https://gethem2020.herokuapp.com/login', {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((responseData) => responseData.json())
      .then((responsejson) => {
        if (responsejson.message === 'sucsess') {
          this.props.navigation.navigate('Main', {
            username: this.state.username,
          });
        } else {
          Alert.alert(responsejson.message);
        }
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBoxes}
          placeholder={'username'}
          placeholderTextColor="white"
          autoCapitalize="none"
          backgroundColor="rgba(255,255,255,0.3)"
          selectionColor="white"
          onChangeText={(val) => this.setState({username: val})}
        />
        <TextInput
          style={styles.inputBoxes}
          placeholder={'password'}
          placeholderTextColor="white"
          autoCapitalize="none"
          backgroundColor="rgba(255,255,255,0.3)"
          selectionColor="white"
          secureTextEntry={true}
          onChangeText={(val) => this.setState({password: val})}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.login()} >
          <Text style={{fontSize:20,color:"white"}}>Login</Text>
          </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4682b4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBoxes: {
    width: 300,
    borderRadius: 25,
    marginVertical: 10,
  },
  button:{
    height:40 ,
    backgroundColor:"indianred",
    paddingVertical:5,
    paddingHorizontal:50,
    borderRadius:25,
  }
});
