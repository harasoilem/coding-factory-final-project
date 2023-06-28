
export class GenericLocalStorageItem {

  key_name = 'access_token';

  public getItem() {
    return localStorage.getItem(this.key_name);
  }

  public setItem(token: string) {
    return localStorage.setItem(this.key_name, token);
  }

  public removeItem() {
    return localStorage.removeItem(this.key_name);
  }

}
