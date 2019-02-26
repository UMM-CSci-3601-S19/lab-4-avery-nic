import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Todo} from './todo';
import {environment} from '../../environments/environment';

@Injectable()
export class TodoListService {
  readonly baseUrl: string = environment.API_URL + 'todos';
  private userUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }
}
