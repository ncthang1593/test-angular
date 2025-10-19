import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { take, map } from 'rxjs/operators';

export class BaseStore<T extends Record<string, any>> {
  private readonly subjects: { [K in keyof T]: BehaviorSubject<T[K]> };

  constructor(private readonly initialState: T) {
    this.subjects = {} as any;
    (Object.keys(initialState) as (keyof T)[]).forEach((key) => {
      this.subjects[key] = new BehaviorSubject(initialState[key]);
    });
  }

  select<K extends keyof T>(key: K): Observable<T[K]> {
    return this.subjects[key].asObservable();
  }

  selectOnce<K extends keyof T>(key: K): Observable<T[K]> {
    return this.select(key).pipe(take(1));
  }

  selectMany(...keys: (keyof T)[]): Observable<Partial<T>> {
    return combineLatest(keys.map((k) => this.select(k))).pipe(
      map((values) =>
        keys.reduce((acc, key, i) => {
          acc[key] = values[i];
          return acc;
        }, {} as Partial<T>)
      )
    );
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.subjects[key].getValue();
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    if (this.subjects[key].getValue() !== value) {
      this.subjects[key].next(value);
    }
  }

  patch(partial: Partial<T>): void {
    (Object.keys(partial) as (keyof T)[]).forEach((key) => {
      const value = partial[key];
      if (value !== undefined && this.subjects[key].getValue() !== value) {
        this.subjects[key].next(value);
      }
    });
  }

  reset(): void {
    (Object.keys(this.initialState) as (keyof T)[]).forEach((key) =>
      this.subjects[key].next(this.initialState[key])
    );
  }

  resetKeys<K extends keyof T>(...keys: K[]): void {
    keys.forEach((key) => this.subjects[key].next(this.initialState[key]));
  }
}

// import {
//   BehaviorSubject,
//   Observable,
//   from,
//   combineLatest,
//   Subscription,
// } from 'rxjs';
// import { take, finalize, catchError, map } from 'rxjs/operators';

// export class BaseStore<T extends Record<string, any>> {
//   private readonly subjects: { [K in keyof T]: BehaviorSubject<T[K]> };
//   private apiSubscriptions = new Map<string, Subscription>();

//   constructor(private readonly initialState: T) {
//     this.subjects = {} as any;
//     (Object.keys(initialState) as (keyof T)[]).forEach((key) => {
//       this.subjects[key] = new BehaviorSubject(initialState[key]);
//     });
//   }

//   /** Select 1 key */
//   select<K extends keyof T>(key: K): Observable<T[K]> {
//     return this.subjects[key].asObservable();
//   }

//   /** Select 1 key once */
//   selectOnce<K extends keyof T>(key: K): Observable<T[K]> {
//     return this.select(key).pipe(take(1));
//   }

//   /** Select nhiều key */
//   selectMany(...keys: (keyof T)[]): Observable<Partial<T>> {
//     return combineLatest(keys.map((k) => this.select(k))).pipe(
//       map((values) => {
//         const result = {} as Partial<T>;
//         keys.forEach((key, i) => (result[key] = values[i]));
//         return result;
//       })
//     );
//   }

//   /** Get current value */
//   get<K extends keyof T>(key: K): T[K] {
//     return this.subjects[key].getValue();
//   }

//   /** Set 1 key */
//   set<K extends keyof T>(key: K, value: T[K]): void {
//     if (this.subjects[key].getValue() !== value) {
//       this.subjects[key].next(value);
//     }
//   }

//   /** Patch nhiều key */
//   patch(partial: Partial<T>): void {
//     (Object.keys(partial) as (keyof T)[]).forEach((key) => {
//       const value = partial[key];
//       if (value !== undefined && this.subjects[key].getValue() !== value) {
//         this.subjects[key].next(value);
//       }
//     });
//   }

//   /** Reset toàn bộ state */
//   reset(): void {
//     (Object.keys(this.initialState) as (keyof T)[]).forEach((key) => {
//       const initialValue = this.initialState[key];
//       if (this.subjects[key].getValue() !== initialValue) {
//         this.subjects[key].next(initialValue);
//       }
//     });
//   }

//   /** Reset 1 key */
//   resetKey<K extends keyof T>(key: K): void {
//     const initialValue = this.initialState[key];
//     if (this.subjects[key].getValue() !== initialValue) {
//       this.subjects[key].next(initialValue);
//     }
//   }

//   /** Reset nhiều key */
//   resetKeys<K extends keyof T>(...keys: K[]): void {
//     keys.forEach((key) => {
//       const initialValue = this.initialState[key];
//       if (this.subjects[key].getValue() !== initialValue) {
//         this.subjects[key].next(initialValue);
//       }
//     });
//   }

//   /** Cancel API request theo dataKey */
//   private cancelRequest(cancelKey: string) {
//     const sub = this.apiSubscriptions.get(cancelKey);
//     if (sub) {
//       sub.unsubscribe();
//       this.apiSubscriptions.delete(cancelKey);
//     }
//   }

//   /** Call API (auto cancel theo dataKey) */
//   fetch<Data>(
//     apiCall: Promise<Data> | Observable<Data>,
//     options: {
//       dataKey?: keyof T;
//       loadingKey?: keyof T;
//       errorKey?: keyof T;
//       onSuccess?: (data: Data) => void;
//       onError?: (error: any) => void;
//     } = {}
//   ): void {
//     const { dataKey, loadingKey, errorKey, onSuccess, onError } = options;
//     const cancelKey = dataKey ? String(dataKey) : Symbol().toString();

//     this.cancelRequest(cancelKey);

//     if (loadingKey) this.set(loadingKey, true as any);
//     if (errorKey) this.set(errorKey, null as any);

//     const sub = from(apiCall)
//       .pipe(
//         catchError((err) => {
//           if (errorKey) this.set(errorKey, err as any);
//           onError?.(err);
//           throw err;
//         }),
//         finalize(() => {
//           if (loadingKey) this.set(loadingKey, false as any);
//           this.apiSubscriptions.delete(cancelKey);
//         })
//       )
//       .subscribe((data) => {
//         if (dataKey) this.set(dataKey, data as any);
//         onSuccess?.(data);
//       });

//     this.apiSubscriptions.set(cancelKey, sub);
//   }

//   /** Destroy store (unsubscribe API subscriptions) */
//   destroy(): void {
//     this.apiSubscriptions.forEach((sub) => sub.unsubscribe());
//     this.apiSubscriptions.clear();
//   }
// }
