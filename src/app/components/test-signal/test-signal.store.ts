import { DestroyRef, effect, inject } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { combineLatest } from 'rxjs';
import { debounceTime, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface TestSignalState {
  address: string;
  name: string;
}

const InitState: TestSignalState = {
  address: '',
  name: '',
};

export const TestSignalStore = signalStore(
  { providedIn: 'root' },
  withState(InitState),
  withMethods((store, http = inject(HttpClient)) => {
    return {
      setAddress(address: string) {
        patchState(store, { address });
      },
      setName(name: string) {
        patchState(store, { name });
      },
    };
  })
);
