import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



export interface TableData {
  date: string;
  startTime: string;
  endTime: string;
  productiveTime: number;
  nonProductiveTime: number;
  productivePercentage: number;
  idleTime: number;
  totalTime: string;
  onLeave: number;
  holiday: boolean;
}


@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css','../../assets/css/font-awesome.min.css']
})
export class ReportTableComponent implements OnInit {



  firstName = "Report"
  lastName  = "Employee"
  middleName = "Date"

  ReportData: any = [];
 
  hideLeaveColumn: boolean = false;


  displayedColumns: string[] = ['date', 'startTime', 'endTime', 'productiveTime', 'nonProductiveTime',
  'productivePercentage', 'idleTime', 'totalTime', 'onLeave', 'holiday'];

  
  constructor(private http: HttpClient, private paginatorIntl: MatPaginatorIntl) {
    this.dataSource = new MatTableDataSource<TableData>();
    this.paginatorIntl.itemsPerPageLabel = 'Logs Records per page:';
  }

  dataSource: MatTableDataSource<TableData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
   
  ngOnInit(): void {
    let token: string = "";
    let json: string | null = localStorage.getItem("response");
    if (json) {
      console.log("json " + json);
      token = JSON.parse(json).token;
      console.log(token + "  Token from table.ts constructor");
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };


    this.http.get<TableData[]>(`${environment.API_BASE_URL}/report/60`,  {headers})
      .subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log(" console.log(this.dataSource.data.map(row => row.onLeave));");
        console.log(this.dataSource.data);
        console.log(this.dataSource.data.map(row => row.onLeave));
      });

  
  }



  
  

}
