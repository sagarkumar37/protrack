import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpcodeService } from '../empcode.service';
import { ReportUrls } from '../enum/global-common';
import { RedashService } from '../services/redash.service';

@Component({
  selector: 'app-my-report',
  templateUrl: './my-report.component.html',
  styleUrls: ['./my-report.component.css']
})
export class MyReportComponent implements OnInit {

  redashUrl: SafeResourceUrl | undefined;
  empCode: any;

  baseUrl: string;
  isLoading: boolean= false;
  dashboardId: string;

  formattedDate: string;


  constructor(public sanitizer: DomSanitizer, 
    private changeDetectorRef: ChangeDetectorRef,
    private empCodeService: EmpcodeService,
    private redashService: RedashService)
    {}

  ngOnInit() {
    this.empCodeService.fetchEmpCode().subscribe(
      data => {
        this.empCode = data.id;
        let reportUrl= ReportUrls.My_Report;
        this.dashboardId = reportUrl.split("dashboards/")[1].split("?")[0];
        this.baseUrl= reportUrl.split("public/")[0]+'api';
        this.redashReport(reportUrl)
      },
      error => {
        console.log('Error fetching employee code:', error);
      }
    );   
  }  

  redashReport(reportUrl: any){   
    if(reportUrl){    
      let currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
      this.formattedDate = currentDate.toISOString().slice(0, 10);
      reportUrl =  reportUrl.replace(/emp_id/, this.empCode);
      reportUrl= reportUrl.replace(/current_date/gi,this.formattedDate);    
      this.redashUrl= this.sanitizer.bypassSecurityTrustResourceUrl(reportUrl);
      this.changeDetectorRef.detectChanges();
    }
  }

  queryRefreshData(){
    let payload= {
    "BASE_URL": this.baseUrl,
    "AUTH_KEY": this.dashboardId,
    "dashboardId": this.dashboardId,
      "parameters": {
          "emp_code": JSON.stringify(this.empCode),
          "specific_date": this.formattedDate
      }
    }
    this.isLoading= true;
    this.redashService.refreshDashboard(payload).subscribe({
      next: (res: any) => {
        if(res){
          this.isLoading= false;
          location.reload();
          console.log("res in global report:", res);
          
        }
      },
      error: (err: any) => {
        console.log("err::", err);
        
      }
    })
  }
}
