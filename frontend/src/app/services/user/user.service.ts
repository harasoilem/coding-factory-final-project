import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudSimpleService} from '../crud-simple/crud-simple.service';
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})

export class UserService extends CrudSimpleService<User> {
  constructor(protected override http: HttpClient) {
    super(http, 'user', 'userPaginated');
  }
}
