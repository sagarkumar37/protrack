import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectActivityComponent } from './new-project-activity.component';

describe('NewProjectActivityComponent', () => {
  let component: NewProjectActivityComponent;
  let fixture: ComponentFixture<NewProjectActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProjectActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
