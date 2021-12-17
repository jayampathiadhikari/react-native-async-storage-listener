export declare const ACTIVITY_INFO = "ACTIVITY_INFO";
declare class StorageListener {
    private state;
    private subscribers;
    constructor(initialState?: string);
    setItem: (value: string) => void;
    getItem: () => string;
    notifySubscribers: () => void;
    addSubscriber: (callback: Function) => void;
    removeAllSubscribers: () => void;
}
export default StorageListener;
