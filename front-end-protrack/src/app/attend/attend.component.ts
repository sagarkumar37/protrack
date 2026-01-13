import { ChangeDetectorRef, Component,OnInit, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { GeolocationService } from '../geolocation.service';




@Component({
  selector: 'app-attend',
  templateUrl: './attend.component.html',
  styleUrls: [
    '../../assets/css/custom.css',
    '../../assets/css/font-awesome.min.css',
  ],
})
export class AttendComponent implements OnInit {
  // new code
  //  public isDataFetched: boolean = false;
  public isLoading: boolean = false;
  // private subscriptions: Subscription = new Subscription();

  displayedColumns: string[] = [
    'S. No.',
    'Date',
    'Punch In',
    'Punch Out',
    'Project 1',
    'Project 2',
    'Project 3',
  ];
  dataSource = new MatTableDataSource<Data>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tableRows: any = [];

  timeEntries: any[] = [];

  start_Day: any | null;

  end_Day: any | null;

  punchIn_Flag: boolean = false;
  punchOut_Flag: boolean = false;

  timesheet: boolean = false;

  punchedInText: string = 'Punch In';
  punchedOutText: string = 'Punch Out';
  public isDataFetched: boolean = false;

  //isDataFetchedS toggle for punch in
  isDataFetchedS: boolean = false;

  //isDataFetchedE toggle for punch out
  isDataFetchedE: boolean = false;
  elapsedTime: any;
  isPunchingIn: boolean= false;
  isPunchingOut: boolean= false;

  constructor(
    private http: HttpClient,
    private sendDateService: SendDateService,
    private toastr: ToastrService,
    private router: Router,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    let token: string = '';
    let json: string | null = localStorage.getItem('response');
    if (json) {
      console.log('json ' + json);
      token = JSON.parse(json).token;
      console.log(token);
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    this.http
      .get(`${environment.API_BASE_URL}/fetchpunchinout`)
      .subscribe((data: any) => {
        this.start_Day = data.start_day;
        this.end_Day = data.end_day;

        if (this.start_Day) {
          this.punchedInText = `Punched in at: ${this.start_Day}`;
          this.punchIn_Flag = true;
          this.isDataFetchedS = true;
          this.startTime = new Date(this.start_Day); // Initialize `startTime`
          this.startTimer(); // Start elapsed time calculation
        }

        if (this.end_Day) {
          this.punchedOutText = `Punched out at: ${this.end_Day}`;
          this.punchOut_Flag = true;
          this.isDataFetchedE = true;
        }
      });

    // console.log("kotak mahindra");
  }

  startTime: Date;
  endTime: Date;
  interval: any;

  async startTimer() {
    if (this.punchIn_Flag || this.isPunchingIn) return;
    this.isPunchingIn = true;
  
    try {
      const isLocationEnabled = await this.geolocationService.checkLocationEnabled();
      if (!isLocationEnabled) {
        this.isPunchingIn = false;
        return;
      }
  
      // Get position with details
      const locationData = await this.geolocationService.getCurrentPositionWithDetails();
      
      // Start timer
      this.startTime = new Date();
      this.interval = setInterval(() => {
        const timeDiff = new Date().getTime() - this.startTime.getTime();
        this.elapsedTime = this.msToTime(timeDiff);
      }, 1000);
  
      // Prepare punch-in data
      const punchInData = {
        punchInTime: this.startTime.toLocaleString('sv-SE', { timeZoneName: 'short' }),
        location: {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          accuracy: locationData.coords.accuracy,
          name: locationData.locationName,
          area: locationData.area
        }
      };
  
      this.startDay(punchInData);
      this.toastr.success('Punched in successfully!');
      
    } catch (error) {
      console.error('Error getting location:', error);
      this.toastr.error('Could not get your location. Punch in failed.');
      clearInterval(this.interval);
      this.elapsedTime = null;
    } finally {
      this.isPunchingIn = false;
    }
  }

  getTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0'); // get the hours, convert to string, and pad with a leading 0 if necessary
    const minutes = date.getMinutes().toString().padStart(2, '0'); // get the minutes, convert to string, and pad with a leading 0 if necessary
    const seconds = date.getSeconds().toString().padStart(2, '0'); // get the seconds, convert to string, and pad with a leading 0 if necessary

    return `${hours}:${minutes}:${seconds}`; // create the time string using template literals
  }

  async stopTimer() {
    if (!this.punchIn_Flag || this.isPunchingOut) {
      if (!this.punchIn_Flag) {
        this.toastr.error('Please Punch in before punching out!');
      }
      return;
    }
  
    this.isPunchingOut = true;
  
    try {

      const isLocationEnabled = await this.geolocationService.checkLocationEnabled();
      if (!isLocationEnabled) {
        this.isPunchingIn = false;
        return;
      }

      const locationData = await this.geolocationService.getCurrentPositionWithDetails();
      
      this.endTime = new Date();
      clearInterval(this.interval);
  
      const punchOutData = {
        punchOutTime: this.endTime,
        location: {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          accuracy: locationData.coords.accuracy,
          name: locationData.locationName,
          area: locationData.area
        }
      };
  
      await this.endDay(punchOutData);
      this.toastr.success('Punched out successfully!');
      
    } catch (error) {
      console.error('Error getting location:', error);
      this.toastr.error('Could not get your location. Punch out failed.');
    } finally {
      this.isPunchingOut = false;
    }
  }

  msToTime(duration: number): string {
    const milliseconds = Math.floor((duration % 1000) / 10);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return (
      this.pad(hours) +
      ':' +
      this.pad(minutes) +
      ':' +
      this.pad(seconds) +
      '.' +
      this.pad(milliseconds)
    );
  }

  pad(n: number): string {
    return ('00' + n).slice(-2);
  }

  // start day
  async startDay(punchInData: any) {
    this.isLoading = true;

    this.sendDateService.postDate(punchInData).subscribe(
      (data) => {
        console.log(data);
        this.isDataFetched = true;
        this.isLoading = false;
        this.punchIn_Flag = true;
        this.punchedInText = 'Punched in at ' + this.getTimeString(this.startTime);
        this.isDataFetchedS = true;
        // this.toastr.info('Punched in Successfully');
      },
      (error) => {
        console.error('Error Occurred: ', error);
        this.isLoading = false;
        this.toastr.error('Error while Punch in, Please try again');
      }
    );
  }
  
  async endDay(punchOutData: any) {
    this.isLoading = true;

    this.sendDateService.postDate2(punchOutData).subscribe(
      (response) => {
        console.log('Punch-out response:', response);
        this.punchOut_Flag = true;
        this.isDataFetchedE = true;
        this.punchedOutText = 'Punched out at ' + this.getTimeString(this.endTime);
        
        const tsFlag: Observable<boolean> = this.checkTimesheet();
        tsFlag.subscribe(
          (value: boolean) => {
            if (value === true) {
              this.toastr.info('Your timesheet is already filled. Logging out...');
              this.router.navigate(['/testlogin']);
            } else {
              // this.toastr.info('Punch-out successful. Please fill your timesheet.');
              this.router.navigate(['/logout']);
            }
          },
          (error) => {
            console.error('Error checking timesheet:', error);
            this.toastr.error('Error while verifying timesheet. Please try again.');
          }
        );
        if (this.timesheet == false) {
          this.router.navigate(['/logout']);
        } else if (this.timesheet == true) {
          this.router.navigate(['/testlogin']);
        }
      },
      (error) => {
        console.error('Error occurred during punch-out:', error);
        this.isLoading = false;
        this.toastr.error('Error while punching out. Please try again.');
      }
    );
  }

  checkTimesheet(): Observable<boolean> {
    let token = '';
    const json = localStorage.getItem('response');

    if (json) {
      const parsedJson = JSON.parse(json);
      token = parsedJson.token;
      console.log(`token ${token}`);
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    //'http://localhost:3000/timesheetflag'

    return this.http
      .get<boolean>(`${environment.API_BASE_URL}/timesheetflag`, { headers })
      .pipe(
        map((response) => {
          console.log('Timesheet found:', response);
          return response;
        }),
        catchError((error) => {
          console.log('Error checking timesheet:', error);
          return of(false);
        })
      );
  }
}


  