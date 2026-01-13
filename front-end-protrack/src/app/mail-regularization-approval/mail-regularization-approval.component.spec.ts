import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailRegularizationApprovalComponent } from './mail-regularization-approval.component';

describe('MailRegularizationApprovalComponent', () => {
  let component: MailRegularizationApprovalComponent;
  let fixture: ComponentFixture<MailRegularizationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailRegularizationApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailRegularizationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
