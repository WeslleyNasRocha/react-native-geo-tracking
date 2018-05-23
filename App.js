import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Geolocation
} from 'react-native';
import Axios from 'axios';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        latitude: null,
        longitude: null
      },
      error: null
    };
  }

  componentWillMount = () => {
    this.requestLocationPermision();
    this.getLocation();
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  requestLocationPermision = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log('granted :', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  getLocation() {
    this.watchId = navigator.geolocation.watchPosition(
      this.handleLocationSuccess.bind(this),
      this.handleLocationError.bind(this),
      this.options
    );
  }

  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 1000,
    distanceFilter: 10,
    useSignificantChanges: true
  };

  handleLocationSuccess(pos) {
    console.log(pos);
    let location = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };
    Axios.post('https://blooming-shelf-90338.herokuapp.com/location', location);
    this.setState({ location });
  }
  handleLocationError(error) {
    this.setState({ error: error });
  }

  render() {
    let text = 'Carregando ...';
    if (this.state.location !== null) {
      text = JSON.stringify(this.state.location);
    }
    return (
      <View
        style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text>{text}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}
