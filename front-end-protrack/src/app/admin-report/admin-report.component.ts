import { Component, OnInit,ViewChild } from '@angular/core';
import { FetchReportDataService } from '../services/work-report-services/fetch-report-data.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import {FormControl,} from '@angular/forms';
import { DateFormatPipe } from './date-format.pipe';
import { MatOption } from '@angular/material/core';



@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css'],
  providers: [DateFormatPipe]
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

    // payload variables
    username: string[] =[]
    startDate: any;
    endDate:   any;
    usernames: string[] = [];
    toppings = new FormControl('');
    selectedUsernames = new FormControl('');

   

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private dateFormat: DateFormatPipe,private fetchReportData: FetchReportDataService) { }

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
      console.log(JSON.stringify(this.ratings))
      

    },(error) =>{
      console.log(error.details);
      alert("Report Data could not be fetched\n"+ JSON.stringify(error.details) );
    })

  }

    onDateChange(event: any): void{
      console.log("Date changed", event);
    }

    fetchReport(){

      // alert(`{startDate: ${JSON.stringify(this.startDate)},\n endDate: ${JSON.stringify(this.endDate)},\n username:${JSON.stringify(this.username)}}`)
      // return;
     
      this.viewReport=true

      this.fetchReportData.adminFetchTaskDetails(this.startDate ,this.endDate, this.username ).subscribe(response =>{

        this.inputs  = response['tasksData'];
      this.ratings = response['payload'];
     

      // alert(`Inputs => ${JSON.stringify(response)}`)

      },error => {
        alert(`ERROR FETCHING THE DATA\n ${error.details}`);
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

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(inputsCopy);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Task_Report.xlsx');
}


  exportToExcel2(){

    const ratingCopy = this.ratings.map((rating:any) => {
      return {

        ...rating,
        year_week: this.dateFormat.transform(rating.year_week)
      }
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ratingCopy);
    const wb: XLSX.WorkBook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet2' );
    XLSX.writeFile(wb,'Rating_Report.xlsx');
  }
}
