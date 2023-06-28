import {Inject, Injectable} from '@angular/core';
import {APIResponse} from '../../models/token';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  constructor(
    protected http: HttpClient,
    @Inject(String) protected path: string
  ) {}

  endpoint = environment.http + '://' + environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  add(model: T): Promise<APIResponse<T>> {
    return this.http.post<APIResponse<T>>(this.endpoint + '/' + this.path, JSON.stringify(model), this.httpOptions).toPromise();
  }

  update(model: T): Promise<APIResponse<T>> {
    // @ts-ignore
    const modelId = model.id;
    return this.http.put<APIResponse<T>>(this.endpoint + '/' + this.path
      + '/' + modelId, JSON.stringify(model), this.httpOptions).toPromise();
  }

  getAll(): Promise<APIResponse<Array<T>>> {
    return this.http.get<APIResponse<Array<T>>>(this.endpoint + '/' + this.path).toPromise();
  }

  getById(id): Promise<APIResponse<T>> {
    return this.http.get<APIResponse<T>>(this.endpoint + '/' + this.path + '/' + id).toPromise();
  }
}
