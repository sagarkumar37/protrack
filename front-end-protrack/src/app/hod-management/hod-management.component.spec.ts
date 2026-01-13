import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodManagementComponent } from './hod-management.component';

describe('HodManagementComponent', () => {
  let component: HodManagementComponent;
  let fixture: ComponentFixture<HodManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HodManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HodManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
