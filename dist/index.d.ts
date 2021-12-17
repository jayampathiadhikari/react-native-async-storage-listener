declare class StorageListener {
    private state;
    private subscribers;
    constructor();
    setItem: (value: string, channelKey: string) => void;
    getItem: (channelKey: string) => string;
    getChannels: () => Array<string>;
    notifySubscribers: (channelKey: string) => void;
    addSubscriber: (callback: (state: string) => void, channelKey: string) => any;
    removeSubscriber: (key: string) => boolean;
    removeAllSubscribers: () => void;
}
declare const _default: StorageListener;
export default _default;
