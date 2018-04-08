import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_KEY } from '../Config'

// https://github.com/FaridSafi/react-native-google-places-autocomplete
export default class LocationSearch extends React.Component {
    constructor(props){
        super(props);
        this.handleResultPress = this.handleResultPress.bind(this);
    }

    /**
     * Handle click on a location result from the auto-complete.
     * Lift state up to home screen
     */
    handleResultPress(data, details = null){
        // 'details' is provided when fetchDetails = true
        if(details && details.geometry){
            this.props.onResultClick(
                details.geometry.location.lat,
                details.geometry.location.lng,
                data.description
            );
        }
    }

    render(){
        return (
            <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2}                               // minimum length of text to search
                debounce={200}                              // debounce the requests in ms
                autoFocus={true}
                currentLocation={false}
                returnKeyType={'search'}
                renderDescription={row => row.description}
                fetchDetails={true}
                onPress={this.handleResultPress}
                query={{
                    // https://developers.google.com/places/web-service/autocomplete
                    key: GOOGLE_MAPS_KEY,
                    language: 'en',                         // language of the results
                    types: 'geocode'
                }}
                styles={{
                    textInputContainer: {
                        width: '100%'
                    },
                    description: {
                        fontWeight: 'bold'
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    }
                }}
                GooglePlacesSearchQuery={{
                    // https://developers.google.com/places/web-service/search
                    rankby: 'prominence'                    // rank by importance
                }}
                predefinedPlaces={[
                    {
                        description: 'Devalore',
                        geometry: {
                            location: {
                                lat: 32.100964,
                                lng: 34.850871
                            }
                        }
                    }
                ]}
            />
        );
    }
}