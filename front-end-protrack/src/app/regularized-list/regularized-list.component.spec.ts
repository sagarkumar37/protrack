import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularizedListComponent } from './regularized-list.component';

describe('RegularizedListComponent', () => {
  let component: RegularizedListComponent;
  let fixture: ComponentFixture<RegularizedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularizedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularizedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
