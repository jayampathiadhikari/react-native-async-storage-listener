# react-native-async-storage-listener #

A wrapper around React Native's AsyncStorage with a listener. Multiple Channels are supported.
Can be used where redux is not available.

## Usage
````js

import StorageListener from react-native-async-storage-listener

//test classes for subscribe demonstration
class TestClassA{
    callback = (text:string)=> {
        console.log('CALLBACK CALLED FOR CLASS A:', text)
    }
    callbackSecond = (text:string)=> {
        console.log('SECOND CALLBACK CALLED FOR CLASS A:', text)
    }
}

class TestClassB{
    callback = (text:string)=> {
        console.log('CALLBACK CALLED FOR CLASS B:', text)
    }
}

// demo
const a = new TestClassA();
const b = new TestClassB();

//initiating channels by setting values
StorageListener.setItem("test value 1", "CHANNEL 1");
StorageListener.setItem("test value 2", "CHANNEL 2");

//get available channels for subscription
const channels = StorageListener.getChannels()


const response = StorageListener.addSubscriber(a.callback, channels[0])
// console.log(response)
// {  success: true, message: 'subscribed to channel', subscriber_id: 'a13151d6-1336-4096-933c-eb8e12cd0b10'}
// subscriber_id is required to remove the subscription 
 
StorageListener.addSubscriber(b.callback, channels[0])
StorageListener.addSubscriber(a.callbackSecond, channels[1])
StorageListener.setItem("test value A", "CHANNEL 1");
StorageListener.setItem("test value A", "CHANNEL 2");
//callbacks will be called for any update

const remove = StorageListener.removeSubscriber(subscriber_id);
// console.log(remove)
// returns true if subscriber_id is a valid id

StorageListener.removeAllSubscribers();
// removes all subscribers
````

## API Reference

### setItem
creates new channel or updates the value of an existing channel

**parameters**

`value:string` - The value to update with 

`channelKey:string` - new channel key or a existing channel key  

**returns**: `void`

### getItem
get value of an existing channel

**parameters**

`channelKey:string` - existing channel key  

**returns**: `string`

### getChannels
get all available existing channels

**parameters**: none

**returns**: `Array<string>`

### addSubscriber
add a new subscriber

**parameters**

`callback: (state:string)=>void` - callback function with void return 

`channelKey:string` - existing channel key that wish to subscribe 

**returns**: `{success: true, message: "subscribed to channel", subscriber_id: key} | {success:false , message: "channel not found. use an existing channel key"}`

### removeSubscriber
remove a subscriber

**parameters**

`key:string` - _subscriber_id_ returned from addSubscriber response  

**returns**: `boolean`

### removeAllSubscribers
remove all subscribers

**parameters**: none
 
**returns**: `void`
