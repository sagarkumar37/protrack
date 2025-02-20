import { Component,OnInit, ViewChild } from '@angular/core';
import { SendDateService } from '../send-date.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Data } from '../data.interface';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attend',
  templateUrl: './attend.component.html',
   styleUrls: ['../../assets/css/custom.css', '../../assets/css/font-awesome.min.css']
})

export class AttendComponent implements OnInit{

  displayedColumns: string[] = ['S. No.', 'Date', 'Punch In', 'Punch Out', 'Project 1', 'Project 2', 'Project 3'];
  dataSource = new MatTableDataSource<Data>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

   tableRows:any = [ ];

  timeEntries: any[] = [];

  start_Day:  any |null;
  
  end_Day:    any | null;

  punchIn_Flag  : boolean = false;
  punchOut_Flag : boolean = false;

  timesheet: boolean = false;

  punchedInText: string = 'Punch In';
  punchedOutText: string = 'Punch Out';
  public isDataFetched: boolean = false;

  //isDataFetchedS toggle for punch in 
   isDataFetchedS: boolean  = false;

  //isDataFetchedE toggle for punch out
   isDataFetchedE: boolean  = false;

  constructor(private dataService: DataService,private http: HttpClient,private sendDateService: SendDateService, private toastr:ToastrService,private router: Router){}

  ngOnInit(): void {

    let token:string ="";
  let json: string | null = localStorage.getItem("response");
    if (json) {
      console.log("json "+json);
    token = JSON.parse(json).token;
      console.log(token);
  }


    const headers ={
        'Content-Type'  : 'application/json',
        'Authorization' : `Bearer ${token}`
    }

    this.http.get<any>(`${environment.API_BASE_URL}/fetchpunchinout`, { headers })
    .subscribe(data => {

      this.start_Day    =    data.start_day;
      this.end_Day      =    data.end_day;

      if (this.start_Day || this.end_Day) {
        
        if(this.start_Day){
        this.punchedInText  = `Punched in at: ${this.start_Day}`;
        this.punchIn_Flag = true;
        this.isDataFetchedS = true;
        
        }
      
        if(this.end_Day){
        this.punchedOutText = `Punched out at: ${this.end_Day}`;
        this.punchOut_Flag = true; 
        this. isDataFetchedE  = true;

        }
    }
      console.log("start day is "+this.start_Day);
      console.log("end day is "+this.end_Day);
      
    });

      // console.log("kotak mahindra");
  }
  
  startTime: Date;
  endTime: Date;
  elapsedTime: string;
  interval: any;
  
  startTimer() {

  

    const now = new Date();
    const startTimeFromStorage = localStorage.getItem('startTime');
    if (startTimeFromStorage) {
      this.startTime = new Date(startTimeFromStorage);
    } else {
      this.startTime = now;
      localStorage.setItem('startTime', now.toISOString());
    }
  
    this.interval = setInterval(() => {
      const timeDiff = new Date().getTime() - this.startTime.getTime();
      this.elapsedTime = this.msToTime(timeDiff);
    }, 1000);
  
    console.log(this.startTime + " From the startTimer() function");
    this.startDay();


    const text: string = this.getTimeString(now);



    this.punchedInText = "Punched in at " + text;
    this.isDataFetchedS = true;
  }


  getTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0'); // get the hours, convert to string, and pad with a leading 0 if necessary
    const minutes = date.getMinutes().toString().padStart(2, '0'); // get the minutes, convert to string, and pad with a leading 0 if necessary
    const seconds = date.getSeconds().toString().padStart(2, '0'); // get the seconds, convert to string, and pad with a leading 0 if necessary
  
    return `${hours}:${minutes}:${seconds}`; // create the time string using template literals
  }
  

  stopTimer() {
    
    if(this.punchedInText == 'Punch In'){
      
      this.toastr.error("Please Punch in before punching out!");

      return;

      
    }



    if(this.punchOut_Flag == true){
    this.endDay();
    return;

    }



    this.punchOut_Flag = true;

    
    

    this.endTime = new Date();
    console.log(this.endTime+" From the stopTimer() function");
    this.endDay();
    clearInterval(this.interval);
    // this.endDay();

    localStorage.removeItem('startTime');
  localStorage.removeItem('elapsedTime');

    this.isDataFetchedE = true;
    
  }

  msToTime(duration: number): string {
    const milliseconds = Math.floor((duration % 1000) / 10);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return (
      this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(seconds) + '.' + this.pad(milliseconds)
    );
  }

  pad(n: number): string {
    return ('00' + n).slice(-2);
  }

    // start day
    startDay(){
      // pass the start time to the backend
      this.sendDateService.postDate(this.startTime).subscribe((data) => {
        console.log(data);
      });

      this.isDataFetched = true;

    }
    endDay(){
      if(this.end_Day){


          const tsFlag: Observable<boolean> = this.checkTimesheet();
console.log("tsFlag " + tsFlag);
tsFlag.subscribe((value: boolean) => {
  console.log("tsFlag " + value);
  if (value === true) {
    console.log("true");
    this.toastr.info("Your Timesheet is already filled, logging out employee");
    localStorage.clear();
    this.router.navigate(['/testlogin']);
  } else {
    console.log("false");
  }
});

                  
          
        if(this.timesheet == false)
        {            
          
        this.router.navigate(['/logout'])
        }

        else if(this.timesheet== true)
        this.router.navigate(['/testlogin']);
        return

      }

      else{
      this.sendDateService.postDate2(this.endTime).subscribe((data)=>{
        // localStorage.clear();
        this.router.navigate(['logout']);
        this.toastr.info('Please Fill your Timesheet');
      
    // this.toastr.success('Logout/Punchout successful');
        console.log(data);
      })
    }
  }


 

  checkTimesheet(): Observable<boolean> {
    let token = "";
    const json = localStorage.getItem("response");
  
    if (json) {
      const parsedJson = JSON.parse(json);
      token = parsedJson.token;
      console.log(`token ${token}`);
    }
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    //'http://localhost:3000/timesheetflag'


  
    return this.http.get<boolean>(`${environment.API_BASE_URL}/timesheetflag`, { headers }).pipe(
      map(response => {
        console.log('Timesheet found:', response);
        return response;
      }),
      catchError(error => {
        console.log('Error checking timesheet:', error);
        return of(false);
      })
    );

  }
  
}


  