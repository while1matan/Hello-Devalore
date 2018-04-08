import React from 'react'
import {View , Text , Button , StyleSheet , AsyncStorage} from 'react-native';
import {login} from '../FacebookApi'

/**
 * Welcome & Sign-In screen
 */

export default class AskAuthScreen extends React.Component {
    constructor(props){
        super(props);
        this.handleUserLoggedIn = this.handleUserLoggedIn.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    /**
     * User just logged in.
     * Navigate to home screen (inside AppStack)
     */
    handleUserLoggedIn(){
        this.props.navigation.navigate('App');
    }

    /**
     * Handle click on a login button.
     * Show a Facebook sign-in dialog, and store user info if authenticated
     */
    handleLoginClick(){
        login()
            .then(({token, userId, userName}) => {
                // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#token
                AsyncStorage.multiSet([["token" , token] , ["userId" , userId]] , (errors) => {
                    if(!errors){
                        this.handleUserLoggedIn();
                    }
                });
            })
            .catch((reason) => {
                // for future use: login failed or cancelled
            });
    }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Hi stranger!</Text>
                
                <Button
                    title="Sign In via Facebook"
                    onPress={this.handleLoginClick} />

                <Text style={styles.or}>- Or -</Text>

                <Text style={[styles.knockText , styles.spacingText]}>You can simply knock here:</Text>

                <Button
                    title="Backdoor"
                    color="#AAAAAA"
                    onPress={() => {
                        this.handleUserLoggedIn();
                    }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center'
    },

    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10
    },

    or: {
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 40
    },

    knockText: {
        fontSize: 16,
        marginTop: 5,
        marginBottom: 5
    }
});