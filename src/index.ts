import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const ACTIVITY_INFO = "ACTIVITY_INFO";

class Subscriber {
    private readonly callback : (state:string)=>void;
    public channel: string;

    constructor(callback: (state:string)=>void, channel:string){
        this.callback = callback;
        this.channel = channel;
    }

    update = (state: string)=> {
        this.callback(state)
    }
}

interface Subscribers {
    [key:string] : Subscriber
}

interface State {
    [key:string] : string
}

class StorageListener {
    private state:State = {};
    private subscribers: Subscribers = {};

    constructor(){
        AsyncStorage.getItem(ACTIVITY_INFO).then( res => {
            if(res){
                if (typeof res === "string") {
                    this.state = JSON.parse(res);
                }
            }
        }).catch((e:any) => {
            throw Error(e.message)
        })
    };

    setItem = (value:string, channelKey:string) : void => {
        this.state[channelKey] = value;
        this.notifySubscribers(channelKey);
        AsyncStorage.setItem(ACTIVITY_INFO, JSON.stringify(this.state)).then()
    };

    getItem = (channelKey:string) : string => {
        return this.state[channelKey];
    };

    getChannels = () : Array<string> => {
        return Object.keys(this.state)
    };

     private notifySubscribers = (channelKey:string): void => {
        for (let key in this.subscribers) {
            let subscriber:Subscriber = this.subscribers[key];
            if(subscriber.channel === channelKey){
                subscriber.update(this.state[channelKey])
            }
        }
    };

    addSubscriber = (callback: (state:string)=>void, channelKey:string) : any => {
        if(this.state[channelKey]){
            const key = uuid.v4().toString();
            this.subscribers[key] = new Subscriber(callback, channelKey);
            this.subscribers[key].update(this.state[channelKey]);
            return {success: true, message: "subscribed to channel", subscriber_id: key}
        }else{
            return {success:false , message: "channel not found. use an existing channel key"}
        }
    };

    removeSubscriber = (key:string): boolean => {
        if(this.subscribers[key]){
            return (delete this.subscribers[key])
        }else{
            return false
        }
    };

    removeAllSubscribers = (): void => {
        this.subscribers = {}
    };
}

export default new StorageListener();
