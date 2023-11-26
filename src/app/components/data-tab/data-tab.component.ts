import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypePost } from 'src/app/services/http.service';

@Component({
  selector: 'app-data-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTabComponent implements OnInit, OnChanges {
  @Input() dataTab: TypePost = {};
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.dataTab);
  }
}
