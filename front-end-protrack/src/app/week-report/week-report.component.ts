import { Component, OnInit,ViewChild } from '@angular/core';
import { FetchReportDataService } from '../services/work-report-services/fetch-report-data.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import {FormControl,} from '@angular/forms';
import { DateFormatPipe } from './date-format.pipe';
import { MatOption } from '@angular/material/core';
import { NextWeekDateFormatPipe } from './next-week.pipe';

@Component({
  selector: 'app-week-report',
  templateUrl: './week-report.component.html',
  styleUrls: ['./week-report.component.css'],
  providers: [DateFormatPipe,NextWeekDateFormatPipe]
  
})
export class WeekReportComponent implements OnInit {
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
    
    username: string[] =[]
    startDate: any;
    endDate:   any;
    usernames: string[] = [];
    toppings = new FormControl('');
    selectedUsernames = new FormControl('');

   

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  currentWeek: number = 100;
  selectedReportType: string = 'task';
  constructor(private dateFormat: DateFormatPipe,private nextWeekDateRange:NextWeekDateFormatPipe, private fetchReportData: FetchReportDataService) { this.currentWeek = this.setCurrentWeek();}

   //currentDate = moment();
   //year_week = parseInt(this.currentDate.format('YYYYWW'));
   date: any ;
   employee: string;
   
   
   viewReport =false;
   
   
  // raksha fetchData(){

  //   this.fetchReport()
  //   this.fetchReportData.fetchTaskDetails(this.year_week).subscribe((response) => {
  //     // this.ratings = response.ratings
  //     // this.inputs  = response.tasks
  //     console.log(JSON.stringify(this.ratings))
      

  //   },(error) =>{
  //     console.log(error.details);
  //     alert("Report Data could not be fetched\n"+ JSON.stringify(error.details) );
  //   })

  // }

    onDateChange(event: any): void{
      console.log("Date changed", event);
    }
    
   
    fetchReport(){

      // alert(`{startDate: ${JSON.stringify(this.startDate)},\n endDate: ${JSON.stringify(this.endDate)},\n username:${JSON.stringify(this.username)}}`)
      // return;
     
      this.viewReport=true
      if (this.selectedReportType === 'task') {
       
        this.fetchReportData.FetchTaskDetails(this.startDate, this.endDate).subscribe(
          (response) => {
            this.inputs = response['tasksData'];
          },
          (error) => {
            alert(`ERROR FETCHING THE TASK DATA\n ${error.details}`);
          }
        );
      } else if (this.selectedReportType === 'plan') {
        
        this.fetchReportData.FetchTaskDetails(this.startDate, this.endDate).subscribe(
          (response) => {
            this.plan = response['planData'];
          },
          (error) => {
            alert(`ERROR FETCHING THE PLAN DATA\n ${error.details}`);
          }
        );
      } else if (this.selectedReportType === 'ratings') {
        this.fetchReportData.FetchTaskDetails(this.startDate, this.endDate).subscribe(
          (response) => {
            this.ratings = response['payload'];
          },
          (error) => {
            alert(`ERROR FETCHING THE RATINGS\n ${error.details}`);
          }
          );
    }}
      
  
  ngOnInit(): void {
    // this.fetchData();
    
    this.setCurrentWeek();
    this.fetchEmployees();
    this.setDatesToCurrentWeek(); 
    this.selectedUsernames.valueChanges.subscribe((selected)=>{
      this.username = selected;
      // alert(`Selected UserNames \n ${JSON.stringify(this.username)}`);
    })
  }
  setCurrentWeek():number {
    const currentDate = moment().subtract(1, 'weeks');
    this.currentWeek =100;
    this.startDate = currentDate.startOf('isoWeek').format('YYYY-MM-DD');
    this.endDate = currentDate.endOf('isoWeek').format('YYYY-MM-DD');
    this.fetchReport();
    return this.currentWeek;
  }
  onReportTypeChange(reportType: string): void {
    this.selectedReportType = reportType;
    this.setCurrentWeek();
    this.setDatesToCurrentWeek();
  }


  setDatesToCurrentWeek(): void {
    // Set the start and end dates to the current week
    const currentDate = moment().subtract(1, 'weeks');
    this.startDate = currentDate.startOf('isoWeek').format('YYYY-MM-DD');
    this.endDate = currentDate.endOf('isoWeek').format('YYYY-MM-DD');
    this.fetchReport();
    
  }

  goToPreviousWeek() {
    this.currentWeek -= 1;
    this.startDate = moment(this.startDate).subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD');
    this.endDate = moment(this.endDate).subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD');
    this.fetchReport();
  }
  
  
  goToNextWeek() {
    if(this.currentWeek<=100){
      this.currentWeek += 1;
      this.startDate = moment(this.startDate).add(1, 'week').startOf('isoWeek').format('YYYY-MM-DD');
      this.endDate = moment(this.endDate).add(1, 'week').endOf('isoWeek').format('YYYY-MM-DD');
      this.fetchReport();
    }
  }
  goToCurrentWeek() {
    this.currentWeek = -1;
    this.setCurrentWeek();
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
  
  exportToExcel() {
    let dataToExport = [];

    if (this.selectedReportType === 'task') {
      dataToExport = this.inputs;
    } else if (this.selectedReportType === 'plan') {
      dataToExport = this.plan;
    } else if (this.selectedReportType === 'ratings') {
      dataToExport = this.ratings;
    }

    const dataCopy = dataToExport.map((data: any) => {
      return {
        ...data,
        year_week: this.dateFormat.transform(data.year_week),
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataCopy);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${this.selectedReportType}_Report.xlsx`);
  }
}
 
//   exportToExcel() {
//     // Create a copy of inputs array with formatted date
//     const inputsCopy = this.inputs.map((input:any) => {
//         return {
//             ...input,
//             year_week: this.dateFormat.transform(input.year_week) // Assuming datePipe is properly injected in your component
//         };
//     });
 
//    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(inputsCopy);
//     //const wb: XLSX.WorkBook = XLSX.utils.book_new();
//     //XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     //XLSX.writeFile(wb, 'Task_Report.xlsx');
    



//   //exportToExcel2(){

//     const ratingCopy = this.ratings.map((rating:any) => {
//       return {

//         ...rating,
//         year_week: this.dateFormat.transform(rating.year_week)
//       }
//     });
//     /**const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ratingCopy);
//     const wb: XLSX.WorkBook  = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet2' );
//     XLSX.writeFile(wb,'Rating_Report.xlsx');*/
  

// //exportToExcel3() {
//   // Create a copy of inputs array with formatted date
//   const PlansCopy = this.plan.map((plan:any) => {
//       return {
//           ...plan,
//           year_week: this.nextWeekDateRange.transform(plan.year_week) // Assuming datePipe is properly injected in your component
//       };
//   });

//   /**const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(PlansCopy);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//   XLSX.writeFile(wb, 'Plan_Report.xlsx');*/
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//     const wsInputs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(inputsCopy);
//     const wsRatings: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ratingCopy);
//     const wsPlan: XLSX.WorkSheet = XLSX.utils.json_to_sheet(PlansCopy);

//     XLSX.utils.book_append_sheet(wb, wsInputs, 'Task_Report');
//     XLSX.utils.book_append_sheet(wb, wsRatings, 'Rating_Report');
//     XLSX.utils.book_append_sheet(wb, wsPlan, 'Plan_Report');

//     XLSX.writeFile(wb, 'All_Reports.xlsx');
// }
// }







