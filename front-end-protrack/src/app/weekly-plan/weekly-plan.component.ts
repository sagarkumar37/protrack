import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ElementRef } from '@angular/core';
import {MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { startWith, map, switchMap } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateWeekPlanService } from '../services/work-report-services/create-week-plan.service';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared.service';

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

/**
 * @title Option groups autocomplete
 */
@Component({
  selector: 'autocomplete-optgroup-example',
  templateUrl: 'weekly-plan.component.html',
  styleUrls: ['./weekly-plan.component.css'],
})
export class WeeklyPlanComponent implements OnInit {
  

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
  
  onActivitySearch(index: number, event: any) {
    const userInput = event.target.value;
    this.stateGroups.forEach((group) => {
      group.names = _filter(group.names, userInput);
    });
    // Update the stateGroupOptions to reflect the filtered data
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value))
    );
  }
  
  
  
  
  stateGroups: StateGroup[] = [];
  
  
  stateGroupOptions: Observable<StateGroup[]>;
  
    // inputs: { activity: string,description: string,status: string }[] = [{ activity: '',description: '',status:'incomplete' }];
    inputs: { activity: string, description: string, status: string }[] = [
      { activity: '', description: '', status: 'Planned' }
    ];
  
    activityName: string[] = [];
  activityId: string[] =[];
   jsonString: any =[]

  
   selectedActivity: string;
   projects: any[];
   options: any[];
   searchText = '';
 

  constructor(private _formBuilder: FormBuilder,private http: HttpClient,private router: Router,private toastr: ToastrService,private elementRef: ElementRef, private createWeekPlanService: CreateWeekPlanService, private sharedDataService: SharedService) {}

  ngOnInit() {
    
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
  console.log('Before adding:', this.inputs);
  const newInput = { activity: 'Default Activity', description: '', status: 'Planned' };
  this.inputs.push(newInput);
  console.log('After adding:', this.inputs);
//   // Bind the new input object to the template
//   const inputElement = this.elementRef.nativeElement.querySelector(`[name="input-${this.inputs.length - 1}"]`);
//   inputElement.focus();
 }

deleteInput(index: number){
  //if input is 1, do not delete
  if(this.inputs.length == 1)
  {
    alert("You must have at least 1 input");
    return;
  }
  this.inputs.splice(index, 1);
}
onActivitySelected(event: MatAutocompleteSelectedEvent): void {
  const selectedActivity = event.option.value;
  // this.inputs[i].activity = selectedActivity;
}

onOptionSelected(index: number, event: MatAutocompleteSelectedEvent) {
  this.inputs[index].activity = event.option.value;
}

onInputChange(index: number, field: string, event: any) {
  // Handle input changes if needed
}

isValidInput(): boolean {
  // Implement validation logic if needed
  return true;
}


savePlanTasks(){
  const year_week = this.sharedDataService.getYearWeek();
  
  this.createWeekPlanService.createWeekPlan(this.inputs,year_week).subscribe((response)=>{

    console.log("request submitted successfully");
    alert(JSON.stringify(response.body))
    

  },(err)=>{
    console.log("An error occured")
    console.log(err);
    alert(err.message)
  });
  console.log(this.inputs);

 
  
}

}