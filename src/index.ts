import AsyncStorage from "@react-native-community/async-storage";

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

class Storage {
    private state:string = "{}";
    private subscribers:Array<Subscriber> = [];

    constructor(){
        AsyncStorage.getItem(ACTIVITY_INFO).then( res => {
            if(res){
                this.state = res;
            }else{
                this.state = "[]";
            }

        }).catch( err => {
            this.state = "[]"
        })
    };

    setItem = (value:string) => {
        this.state = value;
        this.notifySubscribers();
        AsyncStorage.setItem(ACTIVITY_INFO, value).then(r => {
        })
    };

    getItem = () => {
        return this.state;
    };

    notifySubscribers = () => {
        this.subscribers.forEach( subscriber => {
            subscriber.update(this.state)
        })
    };

    addSubscriber = (callback: Function) => {
        this.subscribers.push(new Subscriber(callback));
        this.subscribers[this.subscribers.length - 1].update(this.state);
    };

    removeAllSubscribers = () => {
        this.subscribers = []
    };
}

const storageListener = new Storage();

export default storageListener;
