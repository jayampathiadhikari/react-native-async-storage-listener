"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-community/async-storage"));
const react_native_uuid_1 = __importDefault(require("react-native-uuid"));
const ACTIVITY_INFO = "ACTIVITY_INFO";
class Subscriber {
    constructor(callback, channel) {
        this.update = (state) => {
            this.callback(state);
        };
        this.callback = callback;
        this.channel = channel;
    }
}
class StorageListener {
    constructor() {
        this.state = {};
        this.subscribers = {};
        this.setItem = (value, channelKey) => {
            this.state[channelKey] = value;
            this.notifySubscribers(channelKey);
            async_storage_1.default.setItem(ACTIVITY_INFO, JSON.stringify(this.state)).then();
        };
        this.getItem = (channelKey) => {
            return this.state[channelKey];
        };
        this.getChannels = () => {
            return Object.keys(this.state);
        };
        this.notifySubscribers = (channelKey) => {
            for (let key in this.subscribers) {
                let subscriber = this.subscribers[key];
                if (subscriber.channel === channelKey) {
                    subscriber.update(this.state[channelKey]);
                }
            }
        };
        this.addSubscriber = (callback, channelKey) => {
            if (this.state[channelKey]) {
                const key = react_native_uuid_1.default.v4().toString();
                this.subscribers[key] = new Subscriber(callback, channelKey);
                this.subscribers[key].update(this.state[channelKey]);
                return { success: true, subscriber_id: key };
            }
            else {
                return { success: false, message: "channel not found. use an existing channel key" };
            }
        };
        this.removeSubscriber = (key) => {
            if (this.subscribers[key]) {
                return (delete this.subscribers[key]);
            }
            else {
                return false;
            }
        };
        this.removeAllSubscribers = () => {
            this.subscribers = {};
        };
        async_storage_1.default.getItem(ACTIVITY_INFO).then(res => {
            if (res) {
                this.state = JSON.parse(res);
            }
        });
    }
    ;
}
exports.default = StorageListener;
