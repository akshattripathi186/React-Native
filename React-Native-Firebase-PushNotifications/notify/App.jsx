import { View, Text, Alert } from 'react-native'
import React, {useEffect} from 'react' 
import messaging from '@react-native-firebase/messaging'


const App = () => {
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if(enabled){
         console.log('Notification permission status:', authStatus)
         getFcmToken();
        } else {
            Alert.alert('Push Notification permission denied');
        }
    };

    const getFcmToken = async () => {
        try{
            const fcmToken = await messaging().getToken();

            if(fcmToken){
                console.log("Fcm Token", fcmToken);
            }else {
                console.log("Failed to get Fcm token")
            }
        }catch (error) {
            console.error('Error fetching FCM token:', error);
        }
    }

    useEffect(() => {
        requestUserPermission();

        const unsubscribe = messaging().onMessage(async remoteMessage =>{
            Alert.alert('New Notification', JSON.stringify(remoteMessage.notification?.body || ""));
        })

        messaging().onNotificationOpenedApp(remoteMessage =>{
            console.log('Notification opened from background state:', remoteMessage.notification)
        });

        messaging().getInitialNotification().then(remoteMessage => {
            console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        });

        return unsubscribe;

    }, []);

  return (
    <View style={{flex:1, backgroundColor:'#000', justifyContent:'center', alignItems:'center'}}>
      <Text style={{color:'#fff'}} >Hello everyone Welcome to Hurricane web</Text>
    </View>
  )
}

export default App