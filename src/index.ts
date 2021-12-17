import AsyncStorage from "@react-native-community/async-storage";
import uuid from 'react-native-uuid';

//todo: add channels

export const ACTIVITY_INFO = "ACTIVITY_INFO";

class Subscriber {
    private readonly callback : Function;

    constructor(callback: Function){
        this.callback = callback
    }

    update = (state: string | null)=> {
        this.callback(state)
    }
}

interface Subscribers {
    [key:string] : Subscriber
}

class StorageListener {
    private state:string = "";
    private subscribers: Subscribers = {};

    constructor(initialState?:string){
        AsyncStorage.getItem(ACTIVITY_INFO).then( res => {
            if(res){
                this.state = res;
            }else{
                initialState ? this.state = initialState: this.state = ""
            }
        }).catch( err => {
            initialState ? this.state = initialState: this.state = ""
        })
    };

    setItem = (value:string) : void => {
        this.state = value;
        this.notifySubscribers();
        AsyncStorage.setItem(ACTIVITY_INFO, value).then()
    };

    getItem = () : string => {
        return this.state;
    };

    notifySubscribers = (): void => {
        for (let key in this.subscribers) {
            let subscriber:Subscriber = this.subscribers[key];
            subscriber.update(this.state)
        }
    };

    addSubscriber = (callback: Function) : string => {
        const key = uuid.v4().toString();
        this.subscribers[key] = new Subscriber(callback);
        this.subscribers[key].update(this.state);
        return key
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

export default StorageListener;
