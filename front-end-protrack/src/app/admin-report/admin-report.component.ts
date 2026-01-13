import { Component, OnInit,ViewChild } from '@angular/core';
import { FetchReportDataService } from '../services/work-report-services/fetch-report-data.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import {FormControl,} from '@angular/forms';
import { DateFormatPipe } from './date-format.pipe';
import { MatOption } from '@angular/material/core';
import { NextWeekDateFormatPipe } from './next-week.pipe';

import {ToastrService} from 'ngx-toastr'


@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  providers: [DateFormatPipe,NextWeekDateFormatPipe]
})
export class AdminReportComponent implements OnInit {

  @ViewChild('selectAllOption') selectAllOption: MatOption; 


  isSelectAll = false;
  inputs:any =[]
  ratings:any={
    username:         "",
    busyness:         null,
    satisfaction:     null,
    learning:         null,
    core:             null,
    skill_acquired:    "",
    ai_productivity:   null,
    date:             ""
              }
    plan:any=[]

    // payload variables
    username: string[] =[]
    startDate: any;
    endDate:   any;
    usernames: string[] = [];
    toppings = new FormControl('');
    dataFetchedSuccessfully: boolean = false;
    selectedUsernames = new FormControl('');

   

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private dateFormat: DateFormatPipe,
              private nextWeekDateRange:NextWeekDateFormatPipe,
              private fetchReportData: FetchReportDataService,
              private toastr: ToastrService,) { }

   currentDate = moment();
   year_week = parseInt(this.currentDate.format('YYYYWW'));
   date: any ;
   employee: string;
   
   viewReport =false

  fetchData(){

    this.fetchReport()
    this.fetchReportData.fetchTaskDetails(this.year_week).subscribe((response) => {
      // this.ratings = response.ratings
      // this.inputs  = response.tasks
      console.log(JSON.stringify(response))
      

    },(error) =>{
      console.log(error.details);
      // alert("Report Data could not be fetched\n");
      this.toastr.error('Report Data could not be fetched\n');
    })

  }

    onDateChange(event: any): void{
      console.log("Date changed", event);
    }

    fetchReport(){

      this.viewReport=true

      this.fetchReportData.adminFetchTaskDetails(this.startDate ,this.endDate, this.username ).subscribe(response =>{

        this.inputs  = response['tasksData'];
      this.ratings = response['ratingsData'];
      this.plan = response['plansData'];
      this.dataFetchedSuccessfully = true; 


      // alert(`Inputs => ${JSON.stringify(response)}`)

      },error => {
        // alert(`ERROR FETCHING THE DATA\n ${error.details}`);
        console.log(`ERROR FETCHING THE REPORT\n ${error.details}`)
        this.toastr.error('Report Data could not be fetched');
      })

    }
  
  ngOnInit(): void {
    // this.fetchData();
    //for check box
    this.fetchEmployees();
    
    this.selectedUsernames.valueChanges.subscribe((selected)=>{
      this.username = selected;
      // alert(`Selected UserNames \n ${JSON.stringify(this.username)}`);
    })
  }
  selectAll() {
    this.selectedUsernames.setValue([...this.usernames]);
  }
  toggleSelectAll() {
    if (this.isSelectAll) {
      this.selectedUsernames.setValue([]);
    } else {
      this.selectedUsernames.setValue([...this.usernames]);
    }
    this.isSelectAll = !this.isSelectAll;
  }

  fetchEmployees(): void{
    this.fetchReportData.adminFetchEmployees().subscribe(
      data =>{
        if (data.success){
          this.usernames = data.usernames;
        }
      },
      error => {
        console.log('Error Fetching employees: ', error);
      }
    );
  }

  // exportToExcel() {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.inputs);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'Task_Report.xlsx');
  // }
  exportToExcel() {
    // Create a copy of inputs array with formatted date
    const inputsCopy = this.inputs.map((input:any) => {
        return {
            ...input,
            year_week: this.dateFormat.transform(input.year_week) // Assuming datePipe is properly injected in your component
        };
    });
 
   // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(inputsCopy);
    //const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //XLSX.writeFile(wb, 'Task_Report.xlsx');
    



  //exportToExcel2(){

    const ratingCopy = this.ratings.map((rating:any) => {
      return {

        ...rating,
        year_week: this.dateFormat.transform(rating.year_week)
      }
    });
    /**const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ratingCopy);
    const wb: XLSX.WorkBook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet2' );
    XLSX.writeFile(wb,'Rating_Report.xlsx');*/
  

//exportToExcel3() {
  // Create a copy of inputs array with formatted date
  const PlansCopy = this.plan.map((plan:any) => {
      return {
          ...plan,
          year_week: this.nextWeekDateRange.transform(plan.year_week) // Assuming datePipe is properly injected in your component
      };
  });

  /**const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(PlansCopy);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Plan_Report.xlsx');*/
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const wsInputs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(inputsCopy);
    const wsRatings: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ratingCopy);
    const wsPlan: XLSX.WorkSheet = XLSX.utils.json_to_sheet(PlansCopy);

    XLSX.utils.book_append_sheet(wb, wsInputs, 'Task_Report');
    XLSX.utils.book_append_sheet(wb, wsRatings, 'Rating_Report');
    XLSX.utils.book_append_sheet(wb, wsPlan, 'Plan_Report');

    XLSX.writeFile(wb, 'All_Reports.xlsx');
}
}
