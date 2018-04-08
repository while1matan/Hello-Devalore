import React from 'react'
import {View , StyleSheet , Button , BackHandler , AsyncStorage} from 'react-native';
import {MapView} from 'expo';
import HeaderButtons from 'react-navigation-header-buttons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import LocationSearch from '../components/LocationSearch'

/**
 * App's Home Screen
 * includes an action bar, map and location-search ability
 */

export default class HomeScreen extends React.Component {
    // set StackNavigator options for this screen 
    static navigationOptions = ({navigation}) => {
        //https://reactnavigation.org/docs/header-buttons.html#header-interaction-with-its-screen-component
        const params = navigation.state.params || {};

        // available icons: https://github.com/oblador/react-native-vector-icons
        return {
            title: 'My Map',
            headerRight: (
                <HeaderButtons IconComponent={Ionicons} iconSize={23} color="black">
                    <HeaderButtons.Item title="Search" iconName="md-search" onPress={params.search} />
                    <HeaderButtons.Item title="Logout" iconName="md-exit" onPress={params.logout} />
                </HeaderButtons>
            )
        };
    };

    constructor(props){
        super(props);

        this.state = {
            showSearch: false,
            latitude: 32.100964,
            longitude: 34.850871,
            markerTitle: "Devalore"
        },

        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleSearchResultClick = this.handleSearchResultClick.bind(this);
        this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
        this.saveLocation = this.saveLocation.bind(this);
        this.loadLastLocation = this.loadLastLocation.bind(this);
    }

    componentWillMount(){
        // attack functions in this context, to the navigation context
        // (for action bar buttons)
        this.props.navigation.setParams({
            search: this.handleSearchClick,
            logout: this.handleLogoutClick
        });

        this.loadLastLocation();
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    /**
     * Save location for next startup
     */
    async saveLocation(lat, lng, title){
        AsyncStorage.setItem("lastLocation",
            JSON.stringify({
                'latitude': lat,
                'longitude': lng,
                'title': title
            })
        );
    }

    /**
     * Load last location placed on the map
     */
    async loadLastLocation(){
        const lastLocation = await AsyncStorage.getItem("lastLocation");

        if(lastLocation){
            const locationData = JSON.parse(lastLocation);
            this.setState({
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                markerTitle: locationData.title
            });
        }
    }

    /**
     * Handle click on a search button.
     * Toggle the search view
     */
    handleSearchClick(){
        this.setState((prevState) => {
            return {
                showSearch: !prevState.showSearch
            }
        });
    }

    /**
     * Handle click on a logout button.
     * Logout the user and switch to Auth screen
     */
    async handleLogoutClick(){
        await AsyncStorage.multiRemove(["token", "userId"]);
        this.props.navigation.navigate('AskAuth');
    }

    /**
     * Handle click on a location-search result
     * @param lat - latitude
     * @param lng - longitude
     * @param title - location name
     */
    handleSearchResultClick(lat, lng, title){
        this.setState({
            showSearch: false,
            latitude: lat,
            longitude: lng,
            markerTitle: title
        });

        this.saveLocation(lat, lng, title);
    }

    /**
     * Handle hardware-back-click on Android
     */
    onBackButtonPressAndroid(){
        if(this.state.showSearch){
            // if LocationSearch is visible - close it
            this.setState({
                showSearch: false
            });

            return true;
        }

        return false;
    }

    render(){
        if(this.state.showSearch){
            return (
                <LocationSearch
                    onResultClick={this.handleSearchResultClick} />
            );
        }

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    provider="google"
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }} >

                    <MapView.Marker
                        title={this.state.markerTitle}
                        coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude
                        }} />
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});