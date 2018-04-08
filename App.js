import React from 'react'
import { YellowBox } from 'react-native';
import { StackNavigator , SwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen'
import AskAuthScreen from './src/screens/AskAuthScreen'
import HomeScreen from './src/screens/HomeScreen'

// Dismiss in-app warnings about deprecated lifecycle functions in react-native
// https://github.com/facebook/react-native/issues/18175#issuecomment-370575211
YellowBox.ignoreWarnings([
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
]);

// StackNavigator is a React Component!
const AppStack = StackNavigator(
    {
        Home: {
            screen: HomeScreen
        }
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            headerTitleStyle: {
                fontWeight: 'normal'
            }
        }
    }
);

export default SwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        AskAuth: AskAuthScreen,
        App: AppStack
    },
    {
        initialRouteName: 'AuthLoading'
    }
)