// chatgpt
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {startWith, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TimesheetFlagService } from '../timesheet-flag.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

export interface StateGroup {
  letter: string;
  names: string[];
}

export interface ProjectActivity{
  proj_name: string;
  activity_name: string;
}
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css','../../assets/css/font-awesome.min.css']
  // styleUrls: ['./logout.component.css','./assets/css/bootstrap.min.css', './assets/css/custom.css', './assets/css/font-awesome.min.css']
})

export class LogoutComponent implements OnInit {

  searchInput: string;
  stateCtrl = new FormControl();
  filteredActivities: Observable<string[]>;


activitySearchCtrl = new FormControl();
stateForm = this._formBuilder.group({
  stateGroup: '',
});


activitySearchCtrl2 = new FormControl();
activtiyForm = this._formBuilder.group({
  ProjectActivity: '',
});

dateForm: FormGroup;

stateGroups: StateGroup[] = [];
stateGroupOptions: Observable<StateGroup[]>;
filteredOptions: StateGroup[] = [];

  inputs: { description: string, effort_placed: number,  activity: any }[] = [{ description: '', effort_placed: 0, activity: '' }];
 
  hours_worked: number = 0;
  // minutes_worked: number = 0;
  
  activityName: string[] = [];
  activityId: string[] =[];
   jsonString: any =[]

  
   selectedActivity: string;
   projects: any[];
   options: any[];
   searchText = '';

  // filteredActivities: { activity_name: string, activity_type: string }[];
  @Output() currentTimeChange = new EventEmitter<Date>();
  minutes_worked: number = 0;
  totalMinInOneDay: number= 1440; 
  selectedDate: any;

  maxDate: Date = new Date(); 
  

  constructor(private _formBuilder: FormBuilder,private http: HttpClient,private router: Router,private toastr: ToastrService,private elementRef: ElementRef,
   private timeSheet: TimesheetFlagService,
   private datePipe: DatePipe,
   private cdr: ChangeDetectorRef
  ) { 
    const currentDate = this.formatDate(new Date());
    this.dateForm = this._formBuilder.group({
      date: [currentDate]
    });
    this.getTimeSheetAsPerDate(currentDate)
  }
  

ngOnInit() {


  this.elementRef.nativeElement.ownerDocument
            .body.style.backgroundColor = '#f3f3f3';

  // this.getHours();
  // this.getMinutes();


  // this.http.get<{projects: {proj_name: string; activities: {activity_id: number; activity_name: string}[]}[]}>(`${environment.API_BASE_URL}/api/dropdown_options2`)
  // .subscribe(data => {
  //   this.stateGroups = data.projects.map(project => ({
  //     letter: project.proj_name,
  //     names: project.activities.map(activity => activity.activity_name)
  //   }));

  //   this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(value => this._filterGroup(value))
  //     );
  // });

  // this.http.get<{ projects: { proj_name: string; activities: { activity_id: number; activity_name: string }[] }[] }>(`${environment.API_BASE_URL}/api/dropdown_options2`)
  // .subscribe(data => {
  //   const stateGroups = data.projects.map(project => ({
  //     letter: project.proj_name,
  //     names: project.activities.map(activity => activity.activity_name)
  //   }));

  //   this.stateGroupOptions = of(stateGroups);  // Wrap in an observable
  // });

  this.http.get<{ projects: { proj_name: string; activities: { activity_id: number; activity_name: string }[] }[] }>(`${environment.API_BASE_URL}/api/dropdown_options2`)
  .subscribe(data => {
    this.stateGroups = data.projects.map(project => ({
      letter: project.proj_name,
      names: project.activities.map(activity => activity.activity_name)
    }));
    this.filteredOptions = [...this.stateGroups]; // Initialize filtered options
  });


  this.dateForm.get('date')?.valueChanges.subscribe((selectedDate: any) => {
    let date= this.getSelectedDate()
    this.getTimeSheetAsPerDate(date)
  });



  this.filteredActivities = this.stateCtrl.valueChanges
  .pipe(
    startWith(''),
    map(value => this._filter(value))
  );

  this.http.get<any>(`${environment.API_BASE_URL}/api/dropdown_options2`).subscribe(data => {
    this.projects = data.projects;
    // this.options = data.options;



    console.log("projects after dropdown_optioins2 "+this.projects);
    console.log("options after dropdown_options2 "+this.options);
  });
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.activityId.filter(activity =>
    activity.toLowerCase().includes(filterValue)
  );
}

private _filterGroup(value: string): StateGroup[] {
  if (value) {
    return this.stateGroups
      .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
      .filter(group => group.names.length > 0);
  }

  return this.stateGroups;
}

addInput() {
  if (this.inputs.length < 15) {
    const lastInput = this.inputs[this.inputs.length - 1];
    const newInput = {
      ...lastInput,
      description: '',
      effort_placed: 0
    };

    newInput.activity = lastInput.activity || '';

    this.inputs.push(newInput);
    console.log("Updated inputs:", this.inputs);
  }
}



  removeInput(index: number) {
    if(this.inputs.length>1)
    this.inputs.splice(index, 1);
  }


  isValidInput() {
    // if(this.minutes_worked-this.totalTime !=0)
    // {

    //   //Toastr Message
    //   //To ensure accurate time tracking, please fill in the timesheet for the entire duration of your logged-in session. You have been logged in for "Total Time usage" minutes but have only filled in "Total Time Calculated". Please update your timesheet accordingly and fill for the remaining "Total Time usage - Total Time calculated time
    // }
    return this.inputs.every(input => input.description !== '' && input.effort_placed !== null && input.activity !== ''
    );
  }

  get totalTime() {
    return this.inputs.reduce((acc, input) => acc + input.effort_placed, 0);
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  getSelectedDate(): string {
    const selectedDate = this.dateForm.get('date')?.value;
    return this.formatDate(new Date(selectedDate));
  }

  saveInputs() {
    // Code to save the inputs
    if (!this.isValidInput()) {
      // Display a toast message using ToastrService
      this.toastr.warning('Kindly fill all the fields.', 'Missing Data');
      return;
    }
    else  if(this.totalTime > this.totalMinInOneDay){
      this.toastr.error("The total time usage exceeds the allowed limit of 1440 minutes per day. Please adjust accordingly");
      return
    }
    console.log(this.inputs);
    this.postInput();
  }
  
  onInputChange(index: number, field: string, value: string| number) {
    // this.inputs[index][field] = event;
    console.log(`Input at index ${index} for field ${field} changed to ${value}`);
}

onActivitySelected(event: MatAutocompleteSelectedEvent): void {
  const selectedActivity = event.option.value;
  // this.inputs[i].activity = selectedActivity;
}

filterActivities(searchValue: string) {
  if (searchValue) {
    this.filteredOptions = this.stateGroups
      .map(group => ({
        letter: group.letter,
        names: group.names.filter(name => name.toLowerCase().includes(searchValue.toLowerCase()))
      }))
      .filter(group => group.names.length > 0);
  } else {
    this.filteredOptions = [...this.stateGroups]; // Reset if no search value
  }
}

onOptionSelected(i: number, event: MatAutocompleteSelectedEvent) {
  console.log("event.option.viewValue::", event.option.viewValue);
  
  this.inputs[i].activity = event.option.viewValue;
}



getTimeSheetAsPerDate(selectedDate: any){
  let date= {
    "selectedDate": selectedDate
  }
  this.timeSheet.getTimeSheetAsPerDate(date).subscribe((result: any) => {
    console.log("result length:", result.length);    
    if(result.length > 0){
        this.inputs= result;
    }
    else{
      this.inputs= [{ description: '', effort_placed: 0, activity: '' }];
    }
  }, error =>{
    console.error(error);
    this.toastr.error('No records found for the selected date. Would you like to add a new record?');
  })
}

postInput() {
  // const data = [1, 2, 3];
  const url = `${environment.API_BASE_URL}/daysactivityv2`;

    let selectedDate= this.getSelectedDate();
    this.toastr.clear()
    this.http.post(url, {inputs:this.inputs, date: selectedDate }).subscribe(response => { 
     if(this.router.url.includes('logout')){
      // Clear local storage
     // Redirect to testlogin route
      localStorage.clear();
      this.router.navigate(['login']);
      this.toastr.success('Logout/Punchout successful');
     }
      // Show success message
    this.toastr.success('Timesheet filled successfully');  
  }, error =>{
    console.error(error);
    this.toastr.error('Failed to fill timesheet');
    this.toastr.error(error.error.message)
  });
}

getMinutes():void {
  let token:string ="";
  let json: string | null = localStorage.getItem("response");
    if (json) {
      console.log("json "+json);
    token = JSON.parse(json).token;
      console.log(token);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const url = `${environment.API_BASE_URL}/api/minutes`;

  this.http.get(url, { headers }).subscribe(
    (data: any) => {
      const minutes = data.minutes;
      this.minutes_worked = minutes;
      this.minutes_worked = Math.round(this.minutes_worked)
      console.log('Minutes worked:', minutes);
      // do something with the minutes value
    },
    (error) => {
      console.error('Error:', error);
      // handle the error
    }
  );
}

getHours(): void {
  let token:string ="";
  let json: string | null = localStorage.getItem("response");
    if (json) {
      console.log("json "+json);
    token = JSON.parse(json).token;
     console.log(token);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const url = `${environment.API_BASE_URL}/api/hours`;

 
  this.http.get(url, { headers }).subscribe(
    (data: any) => {
      const hours = data.hours;
      this.hours_worked = hours;    
      console.log('Hours worked:', hours);
      // do something with the hours value
    },
    (error) => {
      console.error('Error:', error);
      // handle the error
    }
  );
}

// add this property to store the list of activity suggestions
activitySuggestions: { activity_id: number; activity_name: string }[] = [];

// add this method to fetch the activity suggestions from your API
searchActivities(query: string) {
 
}

}
