import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTabChangeEvent, NzTabsModule} from 'ng-zorro-antd/tabs';
import {HttpService, TypePost} from 'src/app/services/http.service';
import {DataTabComponent} from '../data-tab/data-tab.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {ChildComponent} from "../child/child.component";

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule,
    NzTabsModule,
    DataTabComponent,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    NzUploadModule,
    ChildComponent],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentComponent implements OnInit {
  myForm: FormGroup;

  totalSearch$ = new BehaviorSubject(1);
  totalPagination$ = new BehaviorSubject(1);

  totalTabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  currentTab = 'Tab 1';
  dataTab1: TypePost = {};
  dataTab2: TypePost = {};
  dataTab3: TypePost = {};
  dataTabs: TypePost[] = [{}, {}, {}];


  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.myForm = this.fb.group({
      page: this.fb.control(''),
    });

    this.myForm.get('page')?.valueChanges.subscribe((res) => {
    });
  }

  ngOnInit(): void {
    // this.getData1();

    // Combine latest only for pagination changes
    combineLatest([this.totalPagination$]).subscribe(([totalPagination]) => {
      this.getData();
    });
  }

  onChangeTab(event: NzTabChangeEvent): void {
    // console.log(event);
    this.currentTab = this.totalTabs[event.index as number];

    combineLatest([this.totalSearch$, this.totalPagination$]).subscribe(
      ([totalSearch, totalPagination]) => {
        console.log(totalSearch);
        console.log(totalPagination);

        switch (this.currentTab) {
          case 'Tab 1':
            this.getData1();
            break;
          case 'Tab 2':
            this.getData2();
            break;
          case 'Tab 3':
            this.getData3();
            break;
        }
      }
    );
  }

  private getData(): void {
    const tabIndex = this.totalTabs.findIndex((tab) => tab === this.currentTab);
    if (tabIndex !== -1) {
      this.httpService.getPosts(tabIndex + 1).subscribe((res: TypePost) => {
        this.dataTabs[tabIndex] = res;
        // If using OnPush change detection, mark for check when data is updated.
        this.cdr.markForCheck();
      });
    }
  }

  handleInput(): void {
    this.totalSearch$.next(this.myForm.get('page')?.value);
  }

  getData1(): void {
    combineLatest([this.totalSearch$, this.totalPagination$]).subscribe(
      ([totalSearch, totalPagination]) => {
        console.log(totalSearch);
        console.log(totalPagination);

        this.httpService.getPosts(1).subscribe((res: TypePost) => {
          this.dataTab1 = res;
        });
      }
    );
  }

  getData2(): void {
    combineLatest([this.totalSearch$, this.totalPagination$]).subscribe(
      ([totalSearch, totalPagination]) => {
        console.log(totalSearch);
        console.log(totalPagination);

        this.httpService.getPosts(2).subscribe((res: TypePost) => {
          this.dataTab2 = res;
        });
      }
    );
  }

  getData3(): void {
    combineLatest([this.totalSearch$, this.totalPagination$]).subscribe(
      ([totalSearch, totalPagination]) => {
        console.log(totalSearch);
        console.log(totalPagination);

        this.httpService.getPosts(3).subscribe((res: TypePost) => {
          this.dataTab3 = res;
        });
      }
    );
  }
}
