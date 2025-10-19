import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSignalComponent } from './test-signal.component';

describe('TestSignalComponent', () => {
  let component: TestSignalComponent;
  let fixture: ComponentFixture<TestSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSignalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
