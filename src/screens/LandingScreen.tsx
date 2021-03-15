
import React, { useState, useReducer, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions , Image } from 'react-native'

import * as Location from 'expo-location'


import { useNavigation } from '../utils'
import { HomeScreen } from './HomeScreen'
import { add } from 'react-native-reanimated'


const screenWidth = Dimensions.get('screen').width

export const LandingScreen = () => {

    const { navigate } = useNavigation()

    const [errorMsg, setErrorMsg] = useState("")
    const [address, setAddress] = useState<Location.Address>()
    
    const [displayAddress, setDisplayAddress] = useState("Waiting for Current Location")

    useEffect(() => {


        (async () => {

            let { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted'){
                setErrorMsg('Permission to access location is not granted')
            }

            let location: any = await Location.getCurrentPositionAsync({});

            const { coords } = location;
            console.log("coords",coords);

            if(coords){

                const { latitude, longitude} = coords;
                try {
                    let addressResponse: any = await Location.reverseGeocodeAsync({ latitude, longitude})
                    console.log("address Response",addressResponse);
    
                    for(let item of addressResponse){
                        setAddress(item)
                        let currentAddress = `${item.name},${item.city}, ${item.postalCode}, ${item.country}`
                        setDisplayAddress(currentAddress)
    
                        if(currentAddress.length > 0){
                            setTimeout(() =>{
                                navigate('homeStack')
                            }, 2000)
                        }
    
    
                        return;
                    }
                }
                catch(e){
                   console.log("Yup")
                   navigate('homeStack');
                }

            }else{
                //notify user something went wrong with location
                return <HomeScreen />
            }

        })();



    }, [])

     
    return (
        <View style={styles.container}>
            <View style={styles.navigation} /> 
                
            <View style={styles.body}>
                <Image source={require('../images/delivery_icon.png')} style={styles.deliveryIcon} />
                <View style={styles.addressContainer}>
                    <Text style={styles.addressTitle}>Your Delivery Address</Text>
                </View>
                <Text style={styles.addressText}> {displayAddress}</Text>
            </View>
            <View style={styles.footer} />
        </View>
    )

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgba(242,242,242,1)'
     },
    navigation: {
        flex: 2,
     },
    body: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deliveryIcon:{
        width: 120,
        height: 120
    },
    addressContainer: {
        width: screenWidth - 100,
        borderBottomColor: 'red',
        borderBottomWidth: 0.5,
        padding: 5,
        marginBottom: 10,
        alignItems: 'center',
        
    },
    addressTitle:{
        fontSize: 22,
        fontWeight: '700',
        color: '#7D7D7D'
    },
    addressText: {
        fontSize: 20,
        fontWeight: '200',
        color: '#4F4F4F'
    },

    footer: {
        flex: 1,
     }

})

