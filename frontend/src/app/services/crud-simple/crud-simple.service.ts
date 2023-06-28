import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Paginated} from '../../models/paginated';

@Injectable({
  providedIn: 'root'
})
export class CrudSimpleService<T> {

  constructor(
    protected http: HttpClient,
    @Inject(String) protected path: string,
    @Inject(String) protected pathPaginated: string
  ) {

  }

  endpoint = environment.http + '://' + environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  add(model: T): Promise<T> {
    return this.http.post<T>(this.endpoint + '/' + this.path, JSON.stringify(model), this.httpOptions).toPromise();
  }

  addViaFormData(formData: FormData): Promise<T> {
    return this.http.post<T>(this.endpoint + '/' + this.path, formData).toPromise();
  }

  update(model: T): Promise<T> {
    // tslint:disable-next-line:max-line-length
    // @ts-ignore
    const modelId = model.id;
    return this.http.put<T>(this.endpoint + '/' + this.path
      + '/' + modelId, JSON.stringify(model), this.httpOptions).toPromise();
  }

  getAll(): Promise<Array<T>> {
    return this.http.get<Array<T>>(this.endpoint + '/' + this.path).toPromise();
  }

  getAllSearchFilter({search = null, filters = null}: GetAllParams): Promise<Array<T>> {

    let url = this.endpoint + '/' + this.path;


    if ((search != null && search.trim() !== '') || filters != null) {
      url += '?';
    }

    if (filters != null) {
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          url += '&' + key + '=' + filters[key];
        }
      }
    }

    if (search != null && search.trim() !== '') {
      url += '&search=' + search;
    }

    return this.http.get<Array<T>>(url).toPromise();
  }

  getAllPaginated({search = null, pageSize = 50, pageIndex = 0}: GetAllPaginatedParams): Promise<Paginated<T>> {

    let url = this.endpoint + '/' + this.pathPaginated;

    pageIndex += 1;

    url += '?page=' + pageIndex + '&page_size=' + pageSize.toString();

    if (search != null && search.trim() !== '') {
      url += '&search=' + search;
    }

    return this.http.get<Paginated<T>>(url).toPromise();
  }


  getAllFilteredPaginated({
                            filters = null,
                            pageSize = 50,
                            pageIndex = 0
                          }: GetAllPaginatedParams): Promise<Paginated<T>> {
    let url = this.endpoint + '/' + this.pathPaginated;
    pageIndex += 1;
    url += '?page=' + pageIndex + '&page_size=' + pageSize.toString();

    if (filters != null) {
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          url += '&' + key + '=' + filters[key];
        }
      }
    }

    return this.http.get<Paginated<T>>(url).toPromise();
  }

  getAllFiltered(filters: object): Promise<Array<T>> {
    let url = this.endpoint + '/' + this.path + '?';

    if (filters != null) {
      let filterCount = 0;
      // tslint:disable-next-line:forin
      for (const key in filters) {
        filterCount++;
        if (filters.hasOwnProperty(key)) {
          url += key + '=' + filters[key];
          if (filterCount < Object.keys(filters).length) {
            url += '&';
          }
        }
      }
    }

    return this.http.get<Array<T>>(url).toPromise();
  }

  getById(id): Promise<T> {
    return this.http.get<T>(this.endpoint + '/' + this.path + '/' + id).toPromise();
  }

  delete(id): Promise<any> {
    return this.http.delete(this.endpoint + '/' + this.path + '/' + id).toPromise();
  }

}

interface GetAllPaginatedParams {
  filters?: object;
  search?: string;
  pageUrl?: string;
  pageSize?: number;
  pageIndex?: number;
}

interface GetAllParams {
  filters?: object;
  search?: string;
}
