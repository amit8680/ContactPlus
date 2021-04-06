import React, {Component} from 'react';
import 'react-native-gesture-handler';
import Contacts from 'react-native-contacts';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
  FlatList,
  PermissionsAndroid,
} from 'react-native';

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      username: '',
      code: '',
    };
  }

  addContacts = () => {
    this.props.navigation.navigate('ContactList', {
      code: this.state.code,
    });
  };
  removeContact = (item) => {
    console.log(item.id);
    fetch('https://gethem2020.herokuapp.com/removeContact', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.state.code,
        id:item.id
      }),
    })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  removeAllContacts = () => {
    fetch('https://gethem2020.herokuapp.com/removeList', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.state.code,
      }),
    })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCode() {
    fetch('https://gethem2020.herokuapp.com/getCode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.props.route.params.username,
      }),
    })
      .then((responseData) => responseData.json())
      .then((responsejson) => {
        this.setState({code: responsejson[0].code});
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }
  getList() {
    fetch('https://gethem2020.herokuapp.com/getList', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.state.code,
      }),
    })
      .then((responseData) => responseData.json())
      .then((responsejson) => {
        this.setState({contacts: responsejson});
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }
  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS);
    this.getCode();
    
  }
  componentDidUpdate(){
    this.getList();
}
  renderItem = ({item, index}) => {
    return (
        <View style={styles.row}>
          <Text style={styles.nameTxt} >
            {item.name}
          </Text>
          <TouchableOpacity
           style={{left:'95%',position:'absolute'}}
           onPress={() => {
            Alert.alert(
              'Remove',
              'Remove contact',
              [   
                {       
                  text: 'Cancel',     
                },     
                {
                  text: 'OK', 
                  onPress: () => this.removeContact(item)
                },   
              ],   
              { cancelable: false }, 
            );
          }}
           >
            <Text style={{fontSize:26,color:'indianred'}} >x</Text>
          </TouchableOpacity>
        </View>

    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonSpace}>
          <TouchableOpacity  
          style={styles.addButton}       
          onPress={() => this.addContacts()}
          > 
          <Text style={styles.buttonsText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
           style={styles.removeButton}
           onPress={() => {
            Alert.alert(
              'Remove',
              'Remove all contacts',
              [   
                {       
                  text: 'Cancel',     
                },     
                {
                  text: 'OK', 
                  onPress: () => this.removeAllContacts()
                },   
              ],   
              { cancelable: false }, 
            );
          }}>
            <Text style={styles.buttonsText}>Remove</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <View >
            <Text style={{padding:11, fontSize: 22, color: 'white'}}>
              {'Hello ' +
                this.props.route.params.username +
                '\nyour code is ' +
                this.state.code}
            </Text>
          </View>
          <FlatList
          style={{backgroundColor:'rgba(255,255,255,0.3)'}}
            data={this.state.contacts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4682b4',
  },
  center: {
    position:'absolute',
    alignSelf: 'center',
    top:'25%',
    height:310,
    width:210
  },
  buttonSpace: {
    width:'100%',
    height:80,
    flexDirection:'row',
    
    
  },
  addButton:{
    height:'40%',
    width:100,
    top:'10%',
    left:'25%',
    backgroundColor:"indianred",
    borderRadius:25,
  },
  removeButton:{
    height:'40%',
    width:100,
    top:'10%',
    left:'25%',
    backgroundColor:"indianred",
    borderRadius:25,
  },
  buttonsText:{
    textAlign:'center',
    fontSize:20,
    color:'white'
  },
  row: {
    flexDirection:'row',
    borderColor: 'black',
    borderBottomWidth: 1,
    padding: 10,
    
  },
  nameTxt: {
    color: 'white',
    fontSize: 18,
    
  },
});
