import { Injectable } from '@angular/core';
import { BaseStore } from '../store/base.store';
import { combineLatest, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ParentService } from './parent.service';

@Injectable({ providedIn: 'root' })
export class ParentStore extends BaseStore<ParentState> {
  count$ = this.select('count');
  posts$ = this.select('posts');
  loading$ = this.select('loading');
  user$ = this.select('users');

  readonly vm$ = this.selectMany('count', 'loading', 'posts', 'users');

  constructor(
    private httpClient: HttpClient,
    private parentService: ParentService
  ) {
    super({ count: 10, posts: [], loading: false, users: [] });
  }

  setCount(count: number): void {
    this.set('count', count);
  }

  resetCount(): void {
    this.resetKeys('count');
  }

  getPosts(): void {
   
  }

  getUsers(): void {
    
  }
}

export interface ParentState {
  count: number;
  posts: { userId: any; id: any; title: any; body: any }[];
  loading: boolean;
  users: User[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}
