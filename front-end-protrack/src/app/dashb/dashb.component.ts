import { Component, OnInit }        from '@angular/core';
import { HeadersService }           from '../headers.service';
import { BreakTimeService }         from '../services/dashboard-services/break-time.service';
import { IdleMinutesService }       from '../services/dashboard-services/idle-minutes.service';
import { LearningTimeService }      from '../services/dashboard-services/learning-time.service';
import { ProductiveTimeService }    from '../services/dashboard-services/productive-time.service';
import { TotalTimeTrackedService }  from '../services/dashboard-services/total-time-tracked.service';
import { UnproductiveTimeService }  from '../services/dashboard-services/unproductive-time.service';

import { environment } from 'src/environments/environment';

interface TimePeriod {
  totalTime: any;
  idleMinutes: any;
  unproductiveTime: any;
  productiveTime: any;
  learningTime: any;
  breakTime: any;
}

@Component({
  selector: 'app-dashb',
  templateUrl: './dashb.component.html',
  styleUrls: ['./dashb.component.css']
})

export class DashbComponent implements OnInit {

  timePeriods: {
    today: TimePeriod;
    yesterday: TimePeriod;
    week: TimePeriod;
    month: TimePeriod;
  } = {
    today: {
      totalTime: null,
      idleMinutes: null,
      unproductiveTime: null,
      productiveTime: null,
      learningTime: null,
      breakTime: null
    },
    yesterday: {
      totalTime: null,
      idleMinutes: null,
      unproductiveTime: null,
      productiveTime: null,
      learningTime: null,
      breakTime: null
    },
    week: {
      totalTime: null,
      idleMinutes: null,
      unproductiveTime: null,
      productiveTime: null,
      learningTime: null,
      breakTime: null
    },
    month: {
      totalTime: null,
      idleMinutes: null,
      unproductiveTime: null,
      productiveTime: null,
      learningTime: null,
      breakTime: null
    }
  };

  timePeriodsWidth: {
    today: TimePeriod;
    yesterday: TimePeriod;
    week: TimePeriod;
    month: TimePeriod;
  } = {
    today: {
      totalTime: 0,
      idleMinutes: 0,
      unproductiveTime: 0,
      productiveTime: 0,
      learningTime: 0,
      breakTime: 100
    },
    yesterday: {
      totalTime: 0,
      idleMinutes: 0,
      unproductiveTime: 0,
      productiveTime: 0,
      learningTime: 0,
      breakTime: 0
    },
    week: {
      totalTime: 0,
      idleMinutes: 0,
      unproductiveTime: 0,
      productiveTime: 0,
      learningTime: 0,
      breakTime: 0
    },
    month: {
      totalTime: 0,
      idleMinutes: 0,
      unproductiveTime: 0,
      productiveTime: 0,
      learningTime: 0,
      breakTime: 0
    }
  };

  constructor(  private totalTimeTrackedService: TotalTimeTrackedService, 
                private productiveTimeService:ProductiveTimeService, 
                private unproductiveTimeService: UnproductiveTimeService,
                private idleMinutesService:IdleMinutesService, 
                private breakTimeService: BreakTimeService, 
                private learningTimeService:LearningTimeService,
                private headersService:HeadersService
             ) { }


    headers = this.headersService.getHeaders();

    totalTimeObj: any;
    totalTime: any;

    

    calculateTimeWidth(totalTimeString: string, fieldTimeString: string): number {

      if (fieldTimeString == "00:00:00") 
      return 0;

      const totalTimeSeconds = this.timeToSeconds(totalTimeString);
      const fieldTimeSeconds = this.timeToSeconds(fieldTimeString);
      return 100 * (fieldTimeSeconds / totalTimeSeconds);
    }
    
    timeToSeconds(timeString: string): number {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      return (hours * 3600) + (minutes * 60) + seconds;
    }
    

    todayDashboard(): void{
    
      //*******************************Total Time*************************************************** */
    
      this.totalTimeTrackedService.getTotalTime(0, this.headers).subscribe(
        (response: any) => {
          this.timePeriods.today.totalTime = response.total_time;
          
        },
        (error: any) => {
          console.error(error);
       
        }
      );
    
      //*******************************Idle Minutes*************************************************** */
    
      this.idleMinutesService.getIdleMinutes(0, this.headers).subscribe(
        (response: any) => {
            this.timePeriods.today.idleMinutes = response.idle_time;         
            this.timePeriodsWidth.today.idleMinutes = this.calculateTimeWidth(this.timePeriods.today.totalTime, this.timePeriods.today.idleMinutes);
          },
          (error: any) => {
            console.error(error);
          }
      );
    
    
       //*******************************Productive Time*************************************************** */
    
      this.productiveTimeService.getProductiveTime(0, this.headers).subscribe(
        (response: any) => {
        
          // Do something with the response
          this.timePeriods.today.productiveTime = response.total_time;
          this.timePeriodsWidth.today.productiveTime = this.calculateTimeWidth(this.timePeriods.today.totalTime, this.timePeriods.today.productiveTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );
    
       //*******************************Unproductive Time*************************************************** */
    
    
      this.unproductiveTimeService.getUnproductiveTime(0, this.headers).subscribe(
        (response: any) => {
        
          // Do something with the response
          this.timePeriods.today.unproductiveTime = response.total_time;
          this.timePeriodsWidth.today.unproductiveTime = this.calculateTimeWidth(this.timePeriods.today.totalTime, this.timePeriods.today.unproductiveTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );
    
       //*******************************Learning Time*************************************************** */
    
       this.learningTimeService.getLearningtime(0, this.headers).subscribe(
        (response:any) => {
    
          this.timePeriods.today.learningTime = response.total_time;
          this.timePeriodsWidth.today.learningTime = this.calculateTimeWidth(this.timePeriods.today.totalTime, this.timePeriods.today.learningTime);
        },(error: any) => {
          
          console.error(error);
    
        }
       )
    
       //*******************************Break Time*************************************************** */
    
      this.breakTimeService.getBreakTime(0, this.headers).subscribe(
        (response: any) => {
          
          // Do something with the response
          this.timePeriods.today.breakTime = response.total_time;
          this.timePeriodsWidth.today.breakTime = this.calculateTimeWidth(this.timePeriods.today.totalTime, this.timePeriods.today.breakTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );
        }

    weekDashboard(): void{
        //*******************************Total Time*************************************************** */

  this.totalTimeTrackedService.getTotalTime(7, this.headers).subscribe(
    (response: any) => {
      this.timePeriods.week.totalTime = response.total_time;
     
    },
    (error: any) => {
      console.error(error);
   
    }
  );

  //*******************************Idle Minutes*************************************************** */

  this.idleMinutesService.getIdleMinutes(7, this.headers).subscribe(
    (response: any) => {
        this.timePeriods.week.idleMinutes = response.idle_time;         
        this.timePeriodsWidth.week.idleMinutes = this.calculateTimeWidth(this.timePeriods.week.totalTime, this.timePeriods.week.idleMinutes);
      },
      (error: any) => {
        console.error(error);
      }
  );


   //*******************************Productive Time*************************************************** */

  this.productiveTimeService.getProductiveTime(7, this.headers).subscribe(
    (response: any) => {
    
      // Do something with the response
      this.timePeriods.week.productiveTime = response.total_time;
      this.timePeriodsWidth.week.productiveTime = this.calculateTimeWidth(this.timePeriods.week.totalTime, this.timePeriods.week.productiveTime);
    },
    (error: any) => {
      console.error(error);
      // Handle the error response
    }
  );

   //*******************************Unproductive Time*************************************************** */


  this.unproductiveTimeService.getUnproductiveTime(7, this.headers).subscribe(
    (response: any) => {
    
      // Do something with the response
      this.timePeriods.week.unproductiveTime = response.total_time;
      this.timePeriodsWidth.week.unproductiveTime = this.calculateTimeWidth(this.timePeriods.week.totalTime, this.timePeriods.week.unproductiveTime);
    },
    (error: any) => {
      console.error(error);
      // Handle the error response
    }
  );

   //*******************************Learning Time*************************************************** */

   this.learningTimeService.getLearningtime(7, this.headers).subscribe(
    (response:any) => {

      this.timePeriods.week.learningTime = response.total_time;
      this.timePeriodsWidth.week.learningTime = this.calculateTimeWidth(this.timePeriods.week.totalTime, this.timePeriods.week.learningTime);
    },(error: any) => {
      
      console.error(error);

    }
   )

   //*******************************Break Time*************************************************** */

  this.breakTimeService.getBreakTime(7, this.headers).subscribe(
    (response: any) => {
      
      // Do something with the response
      this.timePeriods.week.breakTime = response.total_time;
      this.timePeriodsWidth.week.breakTime = this.calculateTimeWidth(this.timePeriods.week.totalTime, this.timePeriods.week.breakTime);
    },
    (error: any) => {
      console.error(error);
      // Handle the error response
    }
  );




    }

    monthDashboard(): void{

      this.totalTimeTrackedService.getTotalTime(30, this.headers).subscribe(
        (response: any) => {
          this.timePeriods.month.totalTime = response.total_time;
         
        },
        (error: any) => {
          console.error(error);
       
        }
      );
    
      //*******************************Idle Minutes*************************************************** */
    
      this.idleMinutesService.getIdleMinutes(30, this.headers).subscribe(
        (response: any) => {
            this.timePeriods.month.idleMinutes = response.idle_time;         
            this.timePeriodsWidth.month.idleMinutes = this.calculateTimeWidth(this.timePeriods.month.totalTime, this.timePeriods.month.idleMinutes);
          },
          (error: any) => {
            console.error(error);
          }
      );
    
    
       //*******************************Productive Time*************************************************** */
    
      this.productiveTimeService.getProductiveTime(30, this.headers).subscribe(
        (response: any) => {
        
          // Do something with the response
          this.timePeriods.month.productiveTime = response.total_time;
          this.timePeriodsWidth.month.productiveTime = this.calculateTimeWidth(this.timePeriods.month.totalTime, this.timePeriods.month.productiveTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );
    
       //*******************************Unproductive Time*************************************************** */
    
    
      this.unproductiveTimeService.getUnproductiveTime(30, this.headers).subscribe(
        (response: any) => {
        
          // Do something with the response
          this.timePeriods.month.unproductiveTime = response.total_time;
          this.timePeriodsWidth.month.unproductiveTime = this.calculateTimeWidth(this.timePeriods.month.totalTime, this.timePeriods.month.unproductiveTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );
    
       //*******************************Learning Time*************************************************** */
    
       this.learningTimeService.getLearningtime(30, this.headers).subscribe(
        (response:any) => {
    
          this.timePeriods.month.learningTime = response.total_time;
          this.timePeriodsWidth.month.learningTime = this.calculateTimeWidth(this.timePeriods.month.totalTime, this.timePeriods.month.learningTime);
        },(error: any) => {
          
          console.error(error);
    
        }
       )
    
       //*******************************Break Time*************************************************** */
    
      this.breakTimeService.getBreakTime(30, this.headers).subscribe(
        (response: any) => {
          
          // Do something with the response
          this.timePeriods.month.breakTime = response.total_time;
          this.timePeriodsWidth.month.breakTime = this.calculateTimeWidth(this.timePeriods.month.totalTime, this.timePeriods.month.breakTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );
    
      


    }

    yesterdayDashboard(): void{

      //*******************************Total Time*************************************************** */

      this.totalTimeTrackedService.getTotalTime(1, this.headers).subscribe(
        (response: any) => {
          this.timePeriods.yesterday.totalTime = response.total_time;

        },
        (error: any) => {
          console.error(error);
       
        }
      );

      //*******************************Idle Minutes*************************************************** */

      this.idleMinutesService.getIdleMinutes(1, this.headers).subscribe(
        (response: any) => {
            this.timePeriods.yesterday.idleMinutes = response.idle_time;         
            this.timePeriodsWidth.yesterday.idleMinutes = this.calculateTimeWidth(this.timePeriods.yesterday.totalTime, this.timePeriods.yesterday.idleMinutes);
          },
          (error: any) => {
            console.error(error);
          }
      );


       //*******************************Productive Time*************************************************** */

      this.productiveTimeService.getProductiveTime(1, this.headers).subscribe(
        (response: any) => {
        
          // Do something with the response
          this.timePeriods.yesterday.productiveTime = response.total_time;
          this.timePeriodsWidth.yesterday.productiveTime = this.calculateTimeWidth(this.timePeriods.yesterday.totalTime, this.timePeriods.yesterday.productiveTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );

       //*******************************Unproductive Time*************************************************** */


      this.unproductiveTimeService.getUnproductiveTime(1, this.headers).subscribe(
        (response: any) => {
        
          // Do something with the response
          this.timePeriods.yesterday.unproductiveTime = response.total_time;
          this.timePeriodsWidth.yesterday.unproductiveTime = this.calculateTimeWidth(this.timePeriods.yesterday.totalTime, this.timePeriods.yesterday.unproductiveTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );

       //*******************************Learning Time*************************************************** */

       this.learningTimeService.getLearningtime(1, this.headers).subscribe(
        (response:any) => {

          this.timePeriods.yesterday.learningTime = response.total_time;
          this.timePeriodsWidth.yesterday.learningTime = this.calculateTimeWidth(this.timePeriods.yesterday.totalTime, this.timePeriods.yesterday.learningTime);
        },(error: any) => {
          
          console.error(error);

        }
       )

       //*******************************Break Time*************************************************** */

      this.breakTimeService.getBreakTime(1, this.headers).subscribe(
        (response: any) => {
          
          // Do something with the response
          this.timePeriods.yesterday.breakTime = response.total_time;
          this.timePeriodsWidth.yesterday.breakTime = this.calculateTimeWidth(this.timePeriods.yesterday.totalTime, this.timePeriods.yesterday.breakTime);
        },
        (error: any) => {
          console.error(error);
          // Handle the error response
        }
      );


    }

   


  

    ngOnInit(): void {
      
      this.todayDashboard()

      
    }
    



}
