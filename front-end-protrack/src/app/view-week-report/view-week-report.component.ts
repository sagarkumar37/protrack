import { Component, OnInit } from '@angular/core';
import { FetchReportDataService } from '../services/work-report-services/fetch-report-data.service';
import * as moment from 'moment';
@Component({
  selector: 'app-view-week-report',
  templateUrl: './view-week-report.component.html',
  styleUrls: ['./view-week-report.component.css']
})
export class ViewWeekReportComponent implements OnInit {

  inputs:any =[]
  ratings:any={
    busyness:         null,
    satisfaction:     null,
    learning:         null,
    core:             null,
    skillAcquired:    "",
    aiProductivity:10}

  constructor(private fetchReportData: FetchReportDataService) { }

   currentDate = moment();
   year_week = parseInt(this.currentDate.format('YYYYWW'));

  fetchData(){

    this.fetchReportData.fetchTaskDetails(this.year_week).subscribe((response) => {
      this.ratings = response.ratings
      this.inputs  = response.tasks
      console.log(JSON.stringify(this.ratings))
      

    },(error) =>{
      console.log(error.details);
      alert("Report Data could not be fetched\n"+ JSON.stringify(error.details) );
    })

  }

  ngOnInit(): void {
    this.fetchData();
  }

}
