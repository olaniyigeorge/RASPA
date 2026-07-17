export interface serviceLocation {
    id : string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    service: string;
    speed: number;
    sl_operator_info: Record<string, string>;

}
