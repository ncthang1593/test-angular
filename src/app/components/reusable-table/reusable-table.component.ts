import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  signal,
  computed,
  OnChanges,
  SimpleChanges,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface TableHeader {
  label: string;
  key: string;
  type?: 'text' | 'number' | 'date' | 'currency';
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableTableComponent
  implements OnInit, AfterViewChecked, OnChanges
{
  @Input({ required: true }) headers: TableHeader[] = [];
  @Input({ required: true }) data: any[] = [];
  @Input() columnTemplates: { [key: string]: TemplateRef<any> } = {};
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() handleSubmit = new EventEmitter();

  @ViewChild('selectAllCheckbox')
  selectAllCheckbox!: ElementRef<HTMLInputElement>;

  form!: FormGroup;

  private selectedRowsMap = new Map<string, any>();

  readonly selectedCount = signal(0);
  readonly indeterminate = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.data.length
  );
  readonly allSelected = computed(
    () => this.selectedCount() === this.data.length && this.data.length > 0
  );
  readonly maxSelected = 2;

  constructor(private fb: FormBuilder, private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    queueMicrotask(() => this.pageIndexChange.emit(1));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.buildForm();
    }
  }

  ngAfterViewChecked() {
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.nativeElement.indeterminate = this.indeterminate();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      selectAll: this.fb.control(false),
      rows: this.fb.array(
        this.data.map((item) =>
          this.fb.control(this.selectedRowsMap.has(item.id))
        )
      ),
    });

    this.rows.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values: boolean[]) => {
        this.rows.getRawValue().forEach((checked, i) => {
          const row = this.data[i];
          if (checked) {
            this.selectedRowsMap.set(row.id, row);
          } else {
            this.selectedRowsMap.delete(row.id);
          }
        });

        this.updateSelectedState();
      });

    this.form
      .get('selectAll')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((checked: boolean) => {
        this.rows.patchValue(
          this.rows.controls.map(() => checked),
          { emitEvent: true }
        );
      });

    this.updateSelectedState();
  }

  private updateSelectedState() {
    this.selectedCount.set(this.selectedRowsMap.size);
    this.selectionChange.emit(Array.from(this.selectedRowsMap.values()));
    this.rows.controls.forEach((ctrl, i) => {
      const isSelected = ctrl.value;
      if (!isSelected && this.selectedRowsMap.size >= this.maxSelected) {
        ctrl.disable({ emitEvent: false });
      } else {
        ctrl.enable({ emitEvent: false });
      }
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  getTemplate(headerLabel: string): TemplateRef<any> | null {
    return this.columnTemplates?.[headerLabel] ?? null;
  }

  changePage(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }

  handleAction(): void {
    if (this.selectedCount() && this.selectedCount() <= this.maxSelected) {
      this.handleSubmit.emit({ data: this.selectedRowsMap });
    }
  }

  clearAll(): void {
    this.selectedRowsMap.clear();
    this.selectedCount.set(0);
    this.rows.reset();
  }

  // formatValue(value: any, type?: string): string {
  //   if (value == null) return '';
  //   switch (type) {
  //     case 'date':
  //       return new Date(value).toLocaleDateString();
  //     case 'currency':
  //       return new Intl.NumberFormat('vi-VN', {
  //         style: 'currency',
  //         currency: 'VND',
  //       }).format(value);
  //     case 'number':
  //       return value.toString();
  //     default:
  //       return value;
  //   }
  // }
}
