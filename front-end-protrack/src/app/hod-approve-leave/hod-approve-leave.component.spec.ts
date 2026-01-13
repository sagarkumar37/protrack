import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodApproveLeaveComponent } from './hod-approve-leave.component';

describe('HodApproveLeaveComponent', () => {
  let component: HodApproveLeaveComponent;
  let fixture: ComponentFixture<HodApproveLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HodApproveLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HodApproveLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
