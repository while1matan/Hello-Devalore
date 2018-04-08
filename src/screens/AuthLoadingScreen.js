import React from 'react';
import {View , ActivityIndicator , StyleSheet , AsyncStorage} from 'react-native';
import {getUserData} from '../FacebookApi'

/**
 * A simple loading screen,
 * while checking if there is a logged in user
 */

export default class AuthLoadingScreen extends React.Component {
    constructor(props){
        super(props);
        this.checkLogin();
    }

    /**
     * Check if a user already logged in
     */
    async checkLogin(){ 
        const token = await AsyncStorage.getItem("token");

        if(token){

            try {
                // get user data from facebook,
                // to verify that the user is still authenticated
                const userData = await getUserData(token);

                if(userData){
                    // logged in - go to main app screen
                    this.props.navigation.navigate('App');
                    return;
                }
            }
            catch(error){
                // couldn't verify user authentication
            }
        }

        // NOT logged in - go to auth screen
        this.props.navigation.navigate('AskAuth');
    }

    render(){
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});