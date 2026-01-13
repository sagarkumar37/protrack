import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-permission-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    
    <div mat-dialog-content>
      <p>{{ data.message }}</p>

      <div *ngIf="data.showEnableInstructions" class="browser-instructions">
        <h3>How to enable location:</h3>
        
        <mat-tab-group>
          <!-- your tab content remains the same -->
        </mat-tab-group>
      </div>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Close</button>
      <button *ngIf="data.showEnableInstructions" 
              mat-button 
              color="primary" 
              (click)="dialogRef.close('refresh')">
        I've Enabled Location - Refresh
      </button>
    </div>
  `,
  styles: [`
    /* your styles remain the same */
  `]
})
export class LocationPermissionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LocationPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}