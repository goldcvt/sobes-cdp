export interface IHistoricalRepo {
    save(element: any): Promise<any>;
    get_Last_Few(quantity: number): Promise<any[]>;
}