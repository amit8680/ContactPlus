import React, {Component} from 'react';
import 'react-native-gesture-handler';

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

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmpassword: '',
    };
  }
  register = () => {
    if (this.state.password == '' || this.state.username == '') {
      Alert.alert('filed cannot be empty');
      return;
    }
    if(this.state.username.length<4||this.state.username.length>12){
      Alert.alert('Username must be between 4 and 12 characters');
      return;
    }
    if(this.state.password.length<4||this.state.password.length>12){
      Alert.alert('Password must be between 4 and 12 characters');
      return;
    }

    if (this.state.password != this.state.confirmpassword) {
      Alert.alert("confirm password doesn't match");
      return;
    }
    fetch('https://gethem2020.herokuapp.com/register', {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
    .then((responseData) => responseData.json())
    .then((responsejson) => {
      if(responsejson.message==='sucsess'){
        this.props.navigation.navigate('Main', {
          username: this.state.username,
        });
      }else{
        Alert.alert(responsejson.message);
      }
    })
      .catch((error) => {
        console.log(error);
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
        <TextInput
          style={styles.inputBoxes}
          placeholder={'confirm password'}
          placeholderTextColor="white"
          autoCapitalize="none"
          backgroundColor="rgba(255,255,255,0.3)"
          selectionColor="white"
          secureTextEntry={true}
          onChangeText={(val) => this.setState({confirmpassword: val})}
        />
        <TouchableOpacity title="register" style={styles.button} onPress={() => this.register()} >
          <Text style={{fontSize:20,color:"white"}}>register</Text>
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
