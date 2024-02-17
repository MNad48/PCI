import React, {useEffect} from 'react';
import {Image,View,StyleSheet} from 'react-native'; // Import Image component
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import DrawingCanvas from './app/DrawingCanvas';
import Details from './app/Details';

const Stack = createStackNavigator();

// Define your splash screen component
const SplashScreen = ({navigation}) => {
  // Simulate a delay before navigating to the main screen
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the 'Home' screen after 2 seconds
      navigation.replace('Home');
    }, 2000); // Adjust the delay time as needed

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    // Render the PNG or JPEG image
    <View style={styles.container}>
      <Image source={require('./res/images/logo.png')} style={styles.image} />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" // Set initial route to 'Splash'
        screenOptions={{
          gestureEnabled: true,
          headerShown:true
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={DrawingCanvas} options={{headerShown:false}}/>
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain', // Use 'contain' to fit the image within the container
  },
});
export default App;
