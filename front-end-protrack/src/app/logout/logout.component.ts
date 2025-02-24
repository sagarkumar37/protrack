// chatgpt
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs/internal/Observable';

import { FormControl } from '@angular/forms';

import { FormBuilder } from '@angular/forms';

import {startWith, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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





stateGroups: StateGroup[] = [];


stateGroupOptions: Observable<StateGroup[]>;

  inputs: { description: string, time: number,  activity: string }[] = [{ description: '', time: 0, activity: '' }];

  
 
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
  

  constructor(private _formBuilder: FormBuilder,private http: HttpClient,private router: Router,private toastr: ToastrService,private elementRef: ElementRef) { }
  

ngOnInit() {


  this.elementRef.nativeElement.ownerDocument
            .body.style.backgroundColor = '#f3f3f3';

  this.getHours();
  this.getMinutes();

      


  this.http.get<{projects: {proj_name: string; activities: {activity_id: number; activity_name: string}[]}[]}>(`${environment.API_BASE_URL}/api/dropdown_options2`)
  .subscribe(data => {
    this.stateGroups = data.projects.map(project => ({
      letter: project.proj_name,
      names: project.activities.map(activity => activity.activity_name)
    }));




    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
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

    
    if(this.inputs.length<10)
    this.inputs.push({ description: '', time: 0, activity: '' });
  }
  removeInput(index: number) {
    if(this.inputs.length>1)
    this.inputs.splice(index, 1);
  }


  isValidInput() {
    if(this.minutes_worked-this.totalTime !=0)
    {

      //Toastr Message
      //To ensure accurate time tracking, please fill in the timesheet for the entire duration of your logged-in session. You have been logged in for "Total Time usage" minutes but have only filled in "Total Time Calculated". Please update your timesheet accordingly and fill for the remaining "Total Time usage - Total Time calculated time
    }
    return this.inputs.every(input => input.description !== '' && input.time !== null && input.activity !== ''
    );
  }

  get totalTime() {
    return this.inputs.reduce((acc, input) => acc + input.time, 0);
  }

  saveInputs() {
    // Code to save the inputs
    

   

    
    if (!this.isValidInput()) {
      // Display a toast message using ToastrService
      this.toastr.warning('Kindly fill all the fields.', 'Missing Data');


      return;
    }
    else  if(this.minutes_worked-this.totalTime!=0){
      if(this.minutes_worked - this.totalTime>0)
      { 
        this.toastr.error("Please Fill your time usage on activity for the remaining minutes")
      }
      if(this.minutes_worked - this.totalTime<0)
      { 
        this.toastr.error("Please remove extra time usage on activity , because your login time is less")
      }
        return;
      }

    console.log(this.inputs);
    this.postInput();
  }
  
  onInputChange(index: number, field: string, value: string| number) {
    // this.inputs[index][prop] = event;
    console.log(`Input at index ${index} for field ${field} changed to ${value}`);
}





onActivitySelected(event: MatAutocompleteSelectedEvent): void {
  const selectedActivity = event.option.value;
  // this.inputs[i].activity = selectedActivity;
}


onOptionSelected(index: number, event: MatAutocompleteSelectedEvent) {
  this.inputs[index].activity = event.option.value;
  
}

postInput() {
  // const data = [1, 2, 3];
  const url = `${environment.API_BASE_URL}/daysactivity`;
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
  this.http.post(url, {inputs:this.inputs},{headers}).subscribe(response => {
    console.log(response);
     // Clear local storage
    localStorage.clear();
     // Redirect to testlogin route
     this.router.navigate(['login']);
      // Show success message
    this.toastr.success('Timesheet filled successfully');
    this.toastr.success('Logout/Punchout successful');
  }, error =>{
    console.error(error);
    this.toastr.error('Failed to fill timesheet');
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
