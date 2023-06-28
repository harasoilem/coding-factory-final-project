import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RegexHelper {

  public static isDayMonthYear(value: string) {
    return value.match(/^([1-9]|0[1-9]|[12][0-9]|3[01])([- \/.])([1-9]|0[1-9]|1[012])\2(19|20)\d\d/g);
  }

  public static isMonthYear(value: string) {
    return value.match(/^([1-9]|0[1-9]|1[012])([- \/.])(19|20)\d\d/g);
  }

  public static isYearMonth(value: string) {
    return value.match(/^(19|20)\d\d([- \/.])([1-9]|0[1-9]|1[012])/g);
  }

  public static isYearMonthDay(value: string) {
    return value.match(/^(19|20)\d\d([- \/.])([1-9]|0[1-9]|1[012])\2([1-9]|0[1-9]|[12][0-9]|3[01])/g);
  }

  static isValidURL(value: string) {
    return value == null ? false : value.match(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i);
  }

}
