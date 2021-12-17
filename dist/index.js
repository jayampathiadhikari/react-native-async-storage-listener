"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVITY_INFO = void 0;
const async_storage_1 = __importDefault(require("@react-native-community/async-storage"));
//todo: add channels
exports.ACTIVITY_INFO = "ACTIVITY_INFO";
class Subscriber {
    constructor(callback) {
        this.update = (state) => {
            this.callback(state);
        };
        this.callback = callback;
    }
}
class StorageListener {
    constructor(initialState) {
        this.state = "";
        this.subscribers = [];
        this.setItem = (value) => {
            this.state = value;
            this.notifySubscribers();
            async_storage_1.default.setItem(exports.ACTIVITY_INFO, value).then();
        };
        this.getItem = () => {
            return this.state;
        };
        this.notifySubscribers = () => {
            this.subscribers.forEach(subscriber => {
                subscriber.update(this.state);
            });
        };
        this.addSubscriber = (callback) => {
            this.subscribers.push(new Subscriber(callback));
            this.subscribers[this.subscribers.length - 1].update(this.state);
        };
        this.removeAllSubscribers = () => {
            this.subscribers = [];
        };
        async_storage_1.default.getItem(exports.ACTIVITY_INFO).then(res => {
            if (res) {
                this.state = res;
            }
            else {
                initialState ? this.state = initialState : this.state = "";
            }
        }).catch(err => {
            initialState ? this.state = initialState : this.state = "";
        });
    }
    ;
}
exports.default = StorageListener;
