import { Facebook } from 'expo';
import { FACEBOOK_APP_ID } from './Config'

/**
 * Show a Facebook sign-in dialog
 * @return {token , userId , userName} on success login
 * @throws Error on failure / cancel
 */
export async function login(){
    // show login dialog and retreive access token
    // https://docs.expo.io/versions/latest/sdk/facebook.html
    const { type , token } = await Facebook.logInWithReadPermissionsAsync( FACEBOOK_APP_ID , {
        permissions: ['public_profile']
    });

    if(type === "success"){
        return getUserData(token);
    }

    if(type === "cancel"){
        throw new Error("cancelled");
    }

    // https://stackoverflow.com/a/42453705
    throw new Error("login-failed");
}

/**
 * Fetch user data from Facebook Graph Api
 * @param token
 * @return {token , userId , userName} on success load
 * @throws Error on failure
 */
export async function getUserData(token){
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const userData = await response.json();

    if(userData.id && userData.name){
        return {
            'token': token,
            'userId': userData.id,
            'userName': userData.name
        }
    }

    throw new Error("getMe-failed");
}