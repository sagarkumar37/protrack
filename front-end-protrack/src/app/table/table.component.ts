import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../data.service';
import { environment } from 'src/environments/environment';

export interface PeriodicElement {
  position: number;
  date: string;
  punchIn: string;
  punchOut: string;
  proj1: string;
  proj2: string;
  proj3: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  TimeEntries: any = [];
  displayedColumns: string[] = ['position', 'date', 'punchIn', 'punchOut', 'proj1', 'proj2', 'proj3'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(private http: HttpClient) {}

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
    
    console.log("check before http request")
    
    this.http.get<any>(`${environment.API_BASE_URL}/timeEntries`, { headers }).subscribe(data => {
      console.log("checking before execution")
      console.log(data);
      console.log("checking if this is executed");
      this.dataSource.data = data.map((item: { [x: string]: any; Date: any; }, index: number) => ({
        position: index + 1,
        date: item.Date,
        punchIn: item['Punch In'],
        punchOut: item['Punch Out'],
        proj1: item['Project 1'],
        proj2: item['Project 2'],
        proj3: item['Project 3'],
      }));
      // this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataSource.data);

      console.log(this.dataSource.data);
    });
  }
  
  columns = [
    {
      columnDef: 'position',
      header: 'S.No.',
      cell: (element: PeriodicElement) => `${element.position}`,
    },
    {
      columnDef: 'date',
      header: 'Date',
      cell: (element: PeriodicElement) => `${element.date}`,
    },
    {
      columnDef: 'punchIn',
      header: 'Punch In',
      cell: (element: PeriodicElement) => `${element.punchIn}`,
    },
    {
      columnDef: 'punchOut',
      header: 'Punch Out',
      cell: (element: PeriodicElement) => `${element.punchOut}`,
    },
    {
      columnDef: 'proj1',
      header: 'Project 1.',
      cell: (element: PeriodicElement) => `${element.proj1}`,
    },
    {
      columnDef: 'proj2',
      header: 'Project 2.',
      cell: (element: PeriodicElement) => `${element.proj2}`,
    },
    {
      columnDef: 'proj3',
      header: 'Project 3.',
      cell: (element: PeriodicElement) => `${element.proj3}`,
    }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}