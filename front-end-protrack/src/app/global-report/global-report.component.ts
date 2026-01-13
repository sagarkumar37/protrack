import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpcodeService } from '../empcode.service';
import { ReportUrls } from '../enum/global-common';
import { Router } from '@angular/router';
import { RedashService } from '../services/redash.service';

@Component({
  selector: 'app-global-report',
  templateUrl: './global-report.component.html',
  styleUrls: ['./global-report.component.css']
})
export class GlobalReportComponent implements OnInit {

  redashUrl: SafeResourceUrl | undefined;
  empCode: any;
  dashboardId: string;
  currentMonth: number;
  currentYear: any;
  baseUrl: string;
  isLoading: boolean= false;

  constructor(public sanitizer: DomSanitizer, 
    private changeDetectorRef: ChangeDetectorRef,
    private empCodeService: EmpcodeService, 
    private router: Router, 
    private redashService: RedashService)
    {}

  ngOnInit() {
    this.empCodeService.fetchEmpCode().subscribe(
      data => {
        this.empCode = data.id;
        let reportUrl= ReportUrls.Global_Report
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
    if (reportUrl) {    
      let currentDate: any = new Date();
      let month: any = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      console.log("currentMonth::", parseInt(month));
      this.currentMonth= parseInt(month);
      this.currentYear = currentDate.getFullYear();
      
      reportUrl = reportUrl.replace(/emp_id/, `${this.empCode}`);
      reportUrl = reportUrl.replace(/currentMonth/, `${this.currentMonth}`);
      reportUrl = reportUrl.replace(/currentYear/, `${this.currentYear}`);      
      this.redashUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reportUrl);      
      this.changeDetectorRef.detectChanges();
    }
  }

  reloadPage(){
    location.reload();
  }

  reloadRoute() {
    this.router.navigate([this.router.url]);
  }

  queryRefreshData(){
    let payload= {
    "BASE_URL": this.baseUrl,
    "AUTH_KEY": this.dashboardId,
    "dashboardId": this.dashboardId,
      "parameters": {
          "emp_code": JSON.stringify(this.empCode),
          "year": JSON.stringify(this.currentYear),
          "month": JSON.stringify(this.currentMonth)
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
