import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput
} from 'react-native';
import Contacts from 'react-native-contacts';
export default class ContactList extends Component {
  
  constructor() {
    super();
    this.state = {
      contacts: [],
    };
    this.arrayholder = [];
  }

  onSelected = (item) => {
    item.isSelected = !item.isSelected;
    this.setState(this.state.contacts);
  };
   done() {
    for (let contact of this.arrayholder) {
      if (contact.isSelected == true) {
        if(contact.phoneNumbers[0]==undefined){
          var phone='';
        }else{
          var phone=contact.phoneNumbers[0].number;
        }
        
        fetch('https://gethem2020.herokuapp.com/list', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: this.props.route.params.code,
            name: contact.givenName + ' ' + contact.familyName,
            phone: phone ,
          }),
        })
          .then((responseData) => responseData.json())
          .then((responsejson) => {
            Alert.alert(responsejson.message);
            return;
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      }
    }
    this.props.navigation.goBack();
  };
  
  loadContacts() {
    Contacts.getAll()
      .then(contacts => {
        contacts.sort(function(a, b) {
          var textA = a.givenName;
          var textB = b.givenName;
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
        this.setState({ contacts:contacts});
        this.arrayholder=contacts;
      })
      
      
  }
  Search = text => {
    const newContacts = this.arrayholder.filter(item => {
      if(item.givenName!=null&&item.familyName!=null){
        const itemData = `${item.givenName.toUpperCase()}   
        ${item.givenName.toUpperCase()} ${item.familyName.toUpperCase()}`;
         const textData = text.toUpperCase();
         return itemData.indexOf(textData) > -1;
      }      
    });
    this.setState({ contacts: newContacts });
  };
  componentDidMount() {
      this.loadContacts();
  }
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onSelected(item);
        }}>
        <View style={[item.isSelected ? styles.row : styles.row2]}>
          <Text style={styles.nameTxt} >
            {item.givenName + ' ' + item.familyName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View>
        <View style={{backgroundColor:'#4682b4'}}>
        <TouchableOpacity
          style={{backgroundColor: 'indianred', alignItems: 'center', height: 40,borderRadius:25}}
          onPress={() => {
            this.done();
          }}>
          <Text style={{fontSize: 26}}>Done</Text>
        </TouchableOpacity>
        <TextInput
        style={{backgroundColor:'rgba(255,255,255,0.3)',borderWidth:1}}
        placeholder="search.."
        onChangeText={text => this.Search(text)}
        autoCorrect={false}
        />
          <FlatList
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
  row: {
    textAlign: "center",
    backgroundColor: '#32cd32',
    borderBottomWidth: 1,
    padding: 11,
  },
  row2: {
    textAlign: "center",
    backgroundColor: '#4682b4',
    borderBottomWidth: 1,
    padding: 11,
  },
  nameTxt: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 20,
  },
});
