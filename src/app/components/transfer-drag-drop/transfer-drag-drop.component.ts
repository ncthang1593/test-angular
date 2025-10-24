import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-transfer-drag-drop',
  imports: [],
  templateUrl: './transfer-drag-drop.component.html',
  styleUrl: './transfer-drag-drop.component.scss',
})
export class TransferDragDropComponent implements OnChanges {
  @Input({ required: true }) leftList: any[] = [];
  @Input() rightList: any[] = [];
  @Input() defaultList: any[] = [];
  @Input() idKey: string = 'id';

  MoveDirection = MoveDirection;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultList'] && this.defaultList.length) {
      this.rightList = this.defaultList.map((item) => ({
        ...item,
        isDefault: true,
      }));
    }
  }

  move(direction: MoveDirection, item: Item) {
    if (direction === MoveDirection.LEFT) {
      this.moveToLeft(item);
    } else {
      this.moveToRight(item);
    }
  }

  private moveToLeft(item: Item) {
    this.rightList = this.rightList.filter(
      (i) => i[this.idKey] !== item[this.idKey as keyof Item]
    );
    this.leftList = [...this.leftList, item];
  }

  private moveToRight(item: Item) {
    this.leftList = this.leftList.filter(
      (i) => i[this.idKey] !== item[this.idKey as keyof Item]
    );
    this.rightList = [...this.rightList, item];
  }
}

export interface Item {
  id: number;
  name: string;
}

export enum MoveDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
