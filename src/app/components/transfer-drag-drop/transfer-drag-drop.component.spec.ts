import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDragDropComponent } from './transfer-drag-drop.component';

describe('TransferDragDropComponent', () => {
  let component: TransferDragDropComponent;
  let fixture: ComponentFixture<TransferDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
