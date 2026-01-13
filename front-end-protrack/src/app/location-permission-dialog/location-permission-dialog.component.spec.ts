import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPermissionDialogComponent } from './location-permission-dialog.component';

describe('LocationPermissionDialogComponent', () => {
  let component: LocationPermissionDialogComponent;
  let fixture: ComponentFixture<LocationPermissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationPermissionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
