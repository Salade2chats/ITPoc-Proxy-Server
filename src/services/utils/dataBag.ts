export interface IDataBagData {
  [key: string]: any;
}
export class DataBag {

  private readonly data: IDataBagData;

  constructor() {
    this.data = {};
  }

  set(key: string, value: any) {
    this.data[key] = value;
    return this;
  }

  get(key: string) {
    if (Object.hasOwnProperty.call(this.data, key)) {
      return this.data[key];
    }
    return null;
  }

  remove(key: string) {
    if (Object.hasOwnProperty.call(this.data, key)) {
      delete this.data[key];
    }
    return this;
  }
}
export default DataBag;
