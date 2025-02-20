import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogBoxComponent } from './confirm-dialog-box.component';

describe('ConfirmDialogBoxComponent', () => {
  let component: ConfirmDialogBoxComponent;
  let fixture: ComponentFixture<ConfirmDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
