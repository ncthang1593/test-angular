import { Component, inject } from '@angular/core';
import { ParentStore } from './parent.store';
import { CommonModule } from '@angular/common';
import { ManoEllipsisTooltipDirective } from './ellipsis-tooltip.directive';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { CustomCheckboxComponent } from '../checkbox/checkbox.component';
import {
  ReusableTableComponent,
  TableHeader,
} from '../reusable-table/reusable-table.component';
import { TestSignalComponent } from '../test-signal/test-signal.component';

@Component({
  selector: 'app-parent',
  imports: [
    CommonModule,
    ManoEllipsisTooltipDirective,
    MultiSelectComponent,
    CustomCheckboxComponent,
    ReusableTableComponent,
    TestSignalComponent
  ],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.scss',
})
export class ParentComponent {
  isShow = true;
  headers: TableHeader[] = [
    { label: 'Name', key: 'name', type: 'text' },
    { label: 'Age', key: 'age', type: 'number' },
    { label: 'Birthday', key: 'birthday', type: 'date' },
    { label: 'Salary', key: 'salary', type: 'currency' },
  ];
  data: any[] = [];
  pageIndex = 0;

  onSelectionChange(selectedRows: any[]) {
    console.log('Selected Rows:', selectedRows);
  }

  onPageIndexChange(pageIndex: number) {
    console.log({ pageIndex });
    this.pageIndex = pageIndex;
    if (pageIndex === 1) {
      this.data = [
        {
          name: 'Alice',
          age: 25,
          birthday: '1999-05-12',
          salary: 12000000,
          id: 1,
        },
        {
          name: 'Bob',
          age: 30,
          birthday: '1994-02-20',
          salary: 15000000,
          id: 2,
        },
        {
          name: 'Charlie',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 3,
        },
          {
          name: '3423',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 31,
        },
          {
          name: '4324234234',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 32,
        },
      ];
    } else if (pageIndex === 2) {
      this.data = [
        {
          name: 'Charlie1',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 4,
        },
        {
          name: 'Charlie2',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 5,
        },
        {
          name: 'Charlie3',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 6,
        },
      ];
    } else if (pageIndex === 3) {
      this.data = [
        {
          name: 'Charlie4',
          age: 28,
          birthday: '1996-08-15',
          salary: 10000000,
          id: 7,
        },
      ];
    }
  }

  onHandleSubmit(data: any): void {
    console.log({ data });
    console.log(Array.from(data.data.values()));
  }

  parentStore = inject(ParentStore);

  items = [
    { label: '111111', value: '111111' },
    { label: '222222', value: '222222' },
    { label: '333333', value: '333333' },
    { label: '444444', value: '444444' },
    { label: '555555', value: '555555' },
    { label: '666666', value: '666666' },
    { label: '777777', value: '777777' },
    { label: '888888', value: '888888' },
    { label: '999999', value: '999999' },
  ];
  checkboxItems: any[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry', disabled: true },
  ];

  onValueChange(selected: string[]) {
    console.log('Selected:', selected);
  }

  vm$ = this.parentStore.vm$;
  texts: string[] = [
    'Ngắn',
    'Đây là một đoạn text',
    'Đây là một đoạn text dài hơn sẽ bị cắt bằng ellipsis nếu vượt quá 200px',
    'Đoạn này đủ dài để test khả năng ellipsis trong Angular',
    'Đây là một đoạn text dài hơn sẽ bị cắt bằng ellipsis nếu vượt quá 200px Đây là một đoạn text dài hơn sẽ bị cắt bằng ellipsis nếu vượt quá 200px Đây là một đoạn text dài hơn sẽ bị cắt bằng ellipsis nếu vượt quá 200px Đây là một đoạn text dài hơn sẽ bị cắt bằng ellipsis nếu vượt quá 200px',
  ];
  // Hàm kiểm tra span có bị ellipsis không

  constructor() {
    // this.parentStore.getPosts();
    this.parentStore.getUsers();
  }

  logParent() {
    console.log('Parent component');
  }

  increase() {
    this.parentStore.setCount(this.parentStore.get('count') + 1);
  }

  reset() {
    this.parentStore.resetCount();
  }
}
