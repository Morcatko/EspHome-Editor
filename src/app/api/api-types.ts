export type TParams<T> = {
    params: Promise<T>;
};

export type TDeviceId = {
    device_id: string;
}

export type TDeviceIdAndPath = TDeviceId & {
    path: string;
};
