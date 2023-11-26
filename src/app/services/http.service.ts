import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  getPosts(numberPost: number): Observable<TypePost> {
    return this.httpClient.get<TypePost>(
      `https://jsonplaceholder.typicode.com/posts/${numberPost}`
    );
  }
}

export interface TypePost {
  userId?: string;
  id?: number;
  title?: string;
  body?: string;
}
