import { Component, OnInit } from '@angular/core';
import { AdminManagementService } from '../services/admin-management.service';

@Component({
  selector: 'app-holiday-management',
  templateUrl: './holiday-management.component.html',
  styleUrls: ['./holiday-management.component.css']
})
export class HolidayManagementComponent implements OnInit {

  holidayName: string = '';
  holidayDate: Date | null = null;
  holidays: any[] = [];
  holidayForm: any;

  constructor(private adminManagement: AdminManagementService) {}

  ngOnInit(): void {
    this.getHolidays();
  }

  addHoliday() {
    const holiday = {
      name: this.holidayName,
      date: this.holidayDate
    };

    this.adminManagement.addHoliday(holiday).subscribe(
      (res: any) => {
        alert('Holiday added successfully!');
        this.getHolidays();
      },
      (err) => {
        console.error('Error adding holiday:', err);
      }
    );
  }

  getHolidays() {
    this.adminManagement.getHoliday().subscribe(
      (res: any) => {
        this.holidays = res;
      },
      (err) => {
        console.error('Error fetching holidays:', err);
      }
    );
  }

}
