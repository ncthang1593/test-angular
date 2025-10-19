import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TestSignalStore } from './test-signal.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime } from 'rxjs';

@Component({
  selector: 'app-test-signal',
  imports: [NzInputModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './test-signal.component.html',
  styleUrl: './test-signal.component.scss',
})
export class TestSignalComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly testSignalStore = inject(TestSignalStore);
  readonly destroyRef = inject(DestroyRef);

  form = this.fb.group({
    address: this.fb.control(''),
    name: this.fb.control(''),
  });

  constructor() {
    combineLatest([
      toObservable(this.testSignalStore.address),
      toObservable(this.testSignalStore.name),
    ])
      .pipe(debounceTime(300))
      .subscribe(([address, name]) => {
        console.log('Address from signal:', address);
        console.log('Name from signal:', name);
      });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      // console.log(this.form.value);
    });
    this.form.get('address')?.valueChanges.subscribe((address) => {
      this.testSignalStore.setAddress(address as string);
    });
    this.form.get('name')?.valueChanges.subscribe((name) => {
      this.testSignalStore.setName(name as string);
    });
  }
}
