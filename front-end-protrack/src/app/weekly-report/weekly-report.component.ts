import { Component, OnInit } from '@angular/core';
import { FetchTasksService } from '../services/work-report-services/fetch-tasks.service';
import { CreateWeekReportService } from '../services/work-report-services/create-week-report.service';
import  * as moment from 'moment';
import { WeeklyRatingsService } from '../services/work-report-services/weekly-ratings.service';
import {DisplayPlanService} from '../services/work-report-services/display-week-plan.service';
import { SharedService } from '../shared.service';
import { ToastrService } from 'ngx-toastr';

interface InputItem{ 
  task: string;
  description: string;
  challenge: string;
  aiTool: string;
  status: string;
}
@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css',]
})


export class WeeklyReportComponent implements OnInit {
  incompletePlans: any[] = [];
  selectedStatusMap: { [task_description: string]: string } = {};
  selectedOption:string;


  constructor(private fetchTaskService: FetchTasksService,
              private createWeekReport: CreateWeekReportService,
              private planService: DisplayPlanService,
              private weeklyRating: WeeklyRatingsService,
              private sharedService: SharedService,
              private toastr: ToastrService ) { 
                this.ratings = {
                  busyness: null,
                  satisfaction: null,
                  learning: null,
                  core: null,
                  skill_acquired: '',
                  ai_productivity: null
                };
              }

  // declare variable named index
  // Use access modifier private  for variables
  private index: number = 0;


  // Define an interface for then input items
  // taskDescriptionsPerRow: string[] = []; 
  taskDescriptionsPerRow: string[][] =[[]]

  inputItem: {activity: string,description: string, challenge: string, aiTool: string, status: string} =
          {activity:"", description: "", challenge: "", aiTool: "", status: ""};


    inputs : {activity: string,description: string, challenge: string, aiTool: string, status: string}[] = 
            [{activity:"", description: "", challenge: "", aiTool: "", status: ""}]

      tasks:{activity_name: string, task_description: string}[] = [{activity_name:"Demo",task_description:"Hi there this is the demo activity description"}]


    ratings:{
      busyness:         null,
      satisfaction:     null,
      learning:         null,
      core:             null,
      skill_acquired:   '',
      ai_productivity:  null
    }

    input2 ={
      description:'',
      activityName:''
    }
    updateActivityName() {
      // Find the corresponding activity_name based on the selected task_description
      const selectedTask = this.tasks.find(
        (task) => task.task_description === this.input2.description
      );
  
      // Update the activityName in the input object
      this.input2.activityName = selectedTask ? selectedTask.activity_name : '';
    }
      
          currentDate = moment()
          year_week:any=parseInt(this.currentDate.format("YYYYWW"));

        isValidInput(){
    
        }

  ngOnInit(): void {
    //this.createWeekReport.createWeekReport(this.inputs);
    this.selectedOption = 'current_week';
    this.fetchActivities();
    this.selectedStatusMap = {};
    this.fetchIncompletePlans();
    
  }
 
  async onSelectChange() {
    try {
      await this.resetTable();
      console.log('Selected Option:', this.selectedOption);
      await this.fetchActivities();
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that occur during the process
    }
  }
  fetchIncompletePlans(): void {
    this.planService.displayplans().subscribe(
      (data) => {
        this.incompletePlans = data;

        this.incompletePlans.forEach(plan => {
          this.selectedStatusMap[plan.task_description] = 'Incomplete';
        });
      },
      
      (error) => {
        console.error('Error fetching incomplete plans:', error);
      }
    );
  }
  updatePlans(planId: number, status: string): void {
    this.planService.updatePlans( [planId], status).subscribe(
      (updatedPlans) => {
        // Handle the updated plans as needed
        console.log('Updated Plans:', updatedPlans);
        // Optionally, you can refresh the list of incomplete plans
        this.fetchIncompletePlans();
      },
      (error) => {
        console.error('Error updating plans:', error);
      }
    );
  }

  addNewInput(i:number){
          
    if(this.inputs.length <25)
    {
      if(this.inputs[i].activity!="" && this.inputs[i].description!="" && this.inputs[i].status!="")
      this.inputs.push({activity:"",description: "", challenge: "", aiTool: "", status: ""});

      this.taskDescriptionsPerRow[i + 1] = [];
    }
    else
    {
   
      this.toastr.warning("You can only add upto 25 Tasks");
    }

  }

  deleteInput(index: number){
    //if input is 1, do not delete
    if(this.inputs.length == 1)
    {
      this.toastr.warning("You must have at least 1 input",);
      return;
    }
    this.inputs.splice(index, 1);
    this.taskDescriptionsPerRow.splice(index, 1);


  }

  activities: Array<string>;

  fetchActivities(): string[]{
    
  
      // if(!Dropdown)
      //  please select the week.
      if(!this.selectedOption){
       this.toastr.warning('Please select the week');
        return[]
      }
  
      // if(!Dropdown== last_week)
      // year_week-=1;
      // if(this.selectedOption === 'last_week')
      // {
      //   this.year_week = parseInt(this.currentDate.format("YYYYWW")) - 1;
      //   console.log('Last Week Selected ' + this.year_week);
      //   this.toastr.info('Last Week Selected ');
  
      // }

      if (this.selectedOption === 'last_week') {

        let previousWeek= this.getPreviousWeek();
        const endDate = new Date(previousWeek.endDate);
        const year = endDate.getFullYear();
        const week = this.getWeekNumber(endDate);

        const formattedWeek = week.toString().padStart(2, '0');
        this.year_week = `${year}${formattedWeek}`;
        console.log('Previous Week Selected: ' + this.year_week);
        this.toastr.info('Previous Week Selected');

      }
    
  
      if(this.selectedOption === 'current_week')
      {
         this.year_week=parseInt(this.currentDate.format("YYYYWW"));
        console.log('Current Week Selected ' + this.year_week)
        this.toastr.info('Current Week Selected ');
      }
     
      this.sharedService.setYearWeek(this.year_week);
      this.fetchTaskService.fetchActivities(this.year_week).subscribe((data:string[])=>{
        this.activities=  data;
        console.log(this.activities);
    },
    err => {
      console.log("Activities could not be fetched");
    }
    );


    return []
  }

  getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.valueOf() - startOfYear.valueOf()) / 86400000);
    return Math.ceil((days + 1) / 7);
  }
  
  getPreviousWeek(): { startDate: string; endDate: string } {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToLastMonday = currentDay === 0 ? 7 : currentDay + 6;
    const startOfPrevWeek = new Date(now);
    startOfPrevWeek.setDate(now.getDate() - diffToLastMonday);
    const endOfPrevWeek = new Date(startOfPrevWeek);
    endOfPrevWeek.setDate(startOfPrevWeek.getDate() + 6);
    const formatDate = (date: Date) =>
      date.toISOString().split('T')[0];

    return {
      startDate: formatDate(startOfPrevWeek),
      endDate: formatDate(endOfPrevWeek),
    };
  }

 
  /**saveInputTasks(){

    this.createWeekReport.createWeekReport(this.inputs).subscribe((response)=>{

      console.log("request submitted successfully");
  
      

    },(err)=>{
      console.log("An error occured")
      console.log(err);
      
    });
    console.log(this.inputs);

   
    
  }*/
  saveInputTasks(): void {
    const plansToUpdate: number[] = [];

    this.incompletePlans.forEach((plan) => {
      const newStatus = this.selectedStatusMap[plan.task_description];
      if (newStatus && newStatus !== plan.status) {
        plansToUpdate.push(plan.id);
      }
    });

    if (plansToUpdate.length > 0) {
      this.planService.updatePlans(plansToUpdate, 'Complete').subscribe(
        (updatedPlans) => {
          console.log('Updated Plans:', updatedPlans);
          this.fetchIncompletePlans();
        },
        (error) => {
          console.error('Error updating plans:', error);
        }
      );
    }

    this.createWeekReport.createWeekReport(this.inputs, this.year_week).subscribe(
      (response) => {
        console.log("Request submitted successfully");
        this.toastr.success(JSON.stringify(response.body));
      },
      (err) => {
        console.log("An error occurred");
        let errorMessage = err.error.message || "An unknown error occurred.";
        console.log(err);
        this.toastr.error(errorMessage);
      });
    console.log(this.inputs);
  }

 

  saveInputRatings(){


    console.log("Ratings ****************** " + JSON.stringify(this.ratings))
        
        if(this.ratings.busyness === null)
        {
        this.toastr.warning("Busyness is mandatory field");
        return
        }
        if(this.ratings.satisfaction === null)
        {
        this.toastr.warning("satisfaction is mandatory field")
        return
        }
        if(this.ratings.learning === null)
        {
        this.toastr.warning("learning is mandatory field")
        return
        }
        if(this.ratings.core === null )
        {
        this.toastr.warning("core is mandatory field")
        return
        }
        
  
        if(this.ratings.skill_acquired === '')
        {
       
        this.toastr.warning('Skill Acquired in mandatory field');
        return
        }

        this.weeklyRating.createWeeklyRatings(JSON.stringify(this.ratings),this.year_week).subscribe((response)=>{

          console.log(response);
      
          this.toastr.success('Weekly Ratings have been saved');
        },(err)=>{
          
          console.log(err)

          let message = err.error.message || "An unknown error occurred.";
          this.toastr.info(`${message}`);

        })

        
  }

  onActivityChange(selectedActivity: string,i: number): void{

    console.log("Consoled from onActivityChange "+selectedActivity);


    this.fetchTaskService.fetchTasksDescription(selectedActivity,this.year_week).subscribe(
      (response) =>{

        this.taskDescriptionsPerRow[i] = response.task_description;
        console.log(this.taskDescriptionsPerRow);


    },(error) => {
      console.log(error.details)
    })


  }
  resetTable(){
    this.inputs= [{activity:"", description: "", challenge: "", aiTool: "", status: ""}];
    this.activities=[];
    this.taskDescriptionsPerRow=[[]];
    this.input2 = {
      description: '',
      activityName: ''
    };
  }

}

// import { Component, OnInit } from '@angular/core';
// import { MatSnackBar, MatSnackBarRef,MatSnackBarModule } from '@angular/material/snack-bar';
// import { FormsModule } from '@angular/forms';

// enum Status {
//   ToDo        = 'To Do',
//   InProgress  = 'In Progress',
//   Completed   = 'Completed',
// }

// interface InputItem {
//   task: string;
//   description: string;
//   challenge: string;
//   aiTool: string;
//   status: Status;
// }

// @Component({
//   selector: 'app-weekly-report',
//   templateUrl: './weekly-report.component.html',
//   styleUrls: ['./weekly-report.component.css']
// })
// export class WeeklyReportComponent implements OnInit {
//   private readonly CONFIG = {
//     MAX_INPUTS: 25,
//     SNACKBAR_DURATION: 5000,
//   };

//   readonly inputs: InputItem[] = Array.from({ length: this.CONFIG.MAX_INPUTS }, () => this.createEmptyInput());

//   constructor(private snackBar: MatSnackBar) {}

//   ngOnInit(): void {
//     // Initialize any component-level logic here
//   }

//   canAddInput(): boolean {
//     return this.inputs.length < this.CONFIG.MAX_INPUTS;
//   }

//   addNewInput(): void {
//     if (this.canAddInput()) {
//       this.inputs.push(this.createEmptyInput());
//     } else {
//       this.showSnackBar(`You can only add up to ${this.CONFIG.MAX_INPUTS} tasks.`);
//     }
//   }

//   canDeleteInput(): boolean {
//     return this.inputs.length > 1;
//   }

//   deleteInput(index: number): void {
//     if (!this.canDeleteInput()) {
//       this.showSnackBar('You must have at least 1 input.');
//       return;
//     }
//     this.inputs.splice(index, 1);
//   }

//   private showSnackBar(message: string): void {
//     this.snackBar.open(message, 'Close', { duration: this.CONFIG.SNACKBAR_DURATION });
//   }

//   private createEmptyInput(): InputItem {
//     return {
//       task: '',
//       description: '',
//       challenge: '',
//       aiTool: '',
//       status: Status.ToDo
//     };
//   }
// }


