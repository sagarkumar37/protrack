import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDetailDialogComponent } from './leave-detail-dialog.component';

describe('LeaveDetailDialogComponent', () => {
  let component: LeaveDetailDialogComponent;
  let fixture: ComponentFixture<LeaveDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
