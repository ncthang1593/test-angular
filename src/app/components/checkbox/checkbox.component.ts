import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  imports: [CommonModule]
})
export class CustomCheckboxComponent {
  @Input() items: CheckboxItem[] = [];
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string[]>();

  selectedItems = signal<string[]>([]);

  toggleItem(item: CheckboxItem) {
    if (item.disabled || this.disabled) return;
    const current = [...this.selectedItems()];
    const index = current.indexOf(item.value);

    if (index === -1) current.push(item.value);
    else current.splice(index, 1);

    this.selectedItems.set(current);
    this.valueChange.emit(current);
  }

  isChecked(item: CheckboxItem) {
    return this.selectedItems().includes(item.value);
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selectedItems.set([]);
    } else {
      const allEnabled = this.items
        .filter((i) => !i.disabled)
        .map((i) => i.value);
      this.selectedItems.set(allEnabled);
    }
    this.valueChange.emit(this.selectedItems());
  }

  isAllSelected() {
    const enabledCount = this.items.filter((i) => !i.disabled).length;
    return this.selectedItems().length === enabledCount;
  }

  isIndeterminate() {
    const selectedCount = this.selectedItems().length;
    const enabledCount = this.items.filter((i) => !i.disabled).length;
    return selectedCount > 0 && selectedCount < enabledCount;
  }
}

export interface CheckboxItem {
  label: string;
  value: string;
  disabled?: boolean;
}
