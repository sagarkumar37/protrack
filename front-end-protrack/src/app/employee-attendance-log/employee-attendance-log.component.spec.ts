import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceLogComponent } from './employee-attendance-log.component';

describe('EmployeeAttendanceLogComponent', () => {
  let component: EmployeeAttendanceLogComponent;
  let fixture: ComponentFixture<EmployeeAttendanceLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
