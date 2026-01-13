import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedMaxLeaveComponent } from './assigned-max-leave.component';

describe('AssignedMaxLeaveComponent', () => {
  let component: AssignedMaxLeaveComponent;
  let fixture: ComponentFixture<AssignedMaxLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedMaxLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedMaxLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
