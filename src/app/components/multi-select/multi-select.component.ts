import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface MultiSelectItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  @Input({ required: true }) items: MultiSelectItem[] = [];
  @Input() maxTagCount = 0;
  @Input() width?: string;
  @Output() selectionChange = new EventEmitter<MultiSelectItem[]>();

  searchTerm = '';
  isOpen = signal(false);
  selectedItems = signal<MultiSelectItem[]>([]);
  filteredItems = signal<MultiSelectItem[]>([]);

  diffTagCount = computed(() => {
    if (this.maxTagCount <= 0) return 0;
    return Math.max(this.selectedItems().length - this.maxTagCount, 0);
  });

  visibleSelectedItems = computed(() =>
    this.maxTagCount > 0
      ? this.selectedItems().slice(0, this.maxTagCount)
      : this.selectedItems()
  );

  constructor(private eRef: ElementRef) {}

  ngOnInit() {
    this.filteredItems.set([...this.items]);
  }

  filterItems(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems.set(
      this.items.filter((item) => item.label.toLowerCase().includes(term))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredItems.set([...this.items]);
  }

  onInputClick(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(!this.isOpen());
  }

  isSelected(item: MultiSelectItem): boolean {
    return this.selectedItems().some((i) => i.value === item.value);
  }

  toggleSelect(item: MultiSelectItem): void {
    const updated = this.isSelected(item)
      ? this.selectedItems().filter((i) => i.value !== item.value)
      : [...this.selectedItems(), item];

    this.selectedItems.set(updated);
    this.selectionChange.emit(updated);
  }

  removeTag(item: MultiSelectItem, event: MouseEvent): void {
    event.stopPropagation();
    const updated = this.selectedItems().filter((i) => i.value !== item.value);
    this.selectedItems.set(updated);
    this.selectionChange.emit(updated);
  }

  toggleAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedItems.set(target.checked ? [...this.filteredItems()] : []);
    this.selectionChange.emit(this.selectedItems());
  }

  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-box') && !target.closest('.dropdown')) {
      this.isOpen.set(false);
    }
  }
}
