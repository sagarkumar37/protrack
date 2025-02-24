import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbComponent } from './dashb.component';

describe('DashbComponent', () => {
  let component: DashbComponent;
  let fixture: ComponentFixture<DashbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
