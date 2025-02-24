import { Component,OnInit} from '@angular/core';
import { ReloadService } from '../reload.service';
import {ToastrService} from 'ngx-toastr'
import { HeadersService } from '../headers.service';
import { EmpnameService } from '../empname.service';
import { EmpcodeService } from '../empcode.service';
import { TimesheetFlagService } from '../timesheet-flag.service';
import {Router} from '@angular/router' ;
import { environment } from 'src/environments/environment';
import { FetchUserRoleService } from '../services/admin-report-services/fetch-user-role.service';
import 'bootstrap';


@Component({
  selector: 'app-test-dashboard',
  templateUrl: './test-dashboard.component.html',
   styleUrls: ['./test-dashboard.component.css','../../assets/css/font-awesome.min.css']
})
export class TestDashboardComponent implements OnInit{
 
  firstName: string;
  middleName: string;
  lastName: string;

  isShown1 = false;
  isShown = false;
  

  showDashb: boolean = true;
  showAttend: boolean = true;
  // hours_tracked: boolean = false;

  public isVisible = false;
  selectedView: string = 'dashboard';
  empCode: any;
  x:any;
  role2: any;
  admin_report: boolean =false;

  tsFlag: boolean;

  constructor(private timesheetFlag:TimesheetFlagService,
              private reloadService: ReloadService,
              private router: Router,
              private toastr: ToastrService,
              private empNameService: EmpnameService,
              private empCodeService: EmpcodeService,
              private headersService: HeadersService,
              private empRole: FetchUserRoleService) { }

   headers = this.headersService.getHeaders();

  ngOnInit() {

    this.empRole.getEmployeeRole().subscribe(
      response => {
        this.role2 = response.role;
        if(this.role2 == 'admin')
        {
          this.admin_report = true;
        }
      },
      error=> {
        console.error(error);
      }
    );


    // 2. If user role is admin, navigate to admin-report component

   
   
     this.flagTimesheet();
   

    this.empNameService.fetchEmpName(this.headers).subscribe(
      data => {

        this.firstName    = data.first_name;
        this.middleName   = data.middle_name;
        this.lastName     = data.last_name;
          
      },

      error =>{
        console.log("Error fetching employee name:", error);
      } 
    );

    this.empCodeService.fetchEmpCode(this.headers).subscribe(
      data => {
        this.empCode = data.id;
      },
      error => {
        console.log('Error fetching employee code:', error);
      }
    );

  }

  // toggling sidenav buttons
  toggleSubMenu() {
    this.isShown = !this.isShown;
  }

  toggleSubMenu1() {
    this.isShown1 = !this.isShown1;
  }


  toggleDashb() {
    this.showDashb = !this.showDashb;
  }

  toggleAttend(){
    this.showAttend = !this.showAttend;
  }
  
  // toggling views in sidenav 
  selectView(view: string) {
    this.selectedView = view; 
  }
  
  showSuccess() {
    // this.toastr.success('Login', 'Success!');
  }

  logout(){
    this.headersService.removeToken();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.toastr.info('Logout', 'Success!');
   

  }

  role:any;

  adminReport(){

    // 1. Check user role
    this.empRole.getEmployeeRole().subscribe(
      response => {
        this.role = response.role;
      },
      error=> {
        console.error(error);
      }
    );


    // 2. If user role is admin, navigate to admin-report component

    if(this.role == 'admin'){
    this.router.navigate(['/admin-report']);
    }
  }

  // weekReport(){
  //   this.router.navigate(['/week-report']);
  // }

  timesheetCheck(){
   // Two checks to be done here
   // 1. Check if the timesheet is already submitted
   // 2. Check if the user has punch out. If not, show a warning message

  //  this.timesheetFlag.getTimesheetFlag(this.headers).subscribe(
  //       (response) =>{

  //         this.tsFlag =response;
          
          
  //       },
  //       (error) =>{
  //         console.error(error);
  //       }
  //  );
  }
  flagTimesheet():any{

    this.timesheetFlag.getTimesheetFlag(this.headers).subscribe(
      (response) => {
        // Handle the response data
        console.log("Timesheet Flag");
        console.log(response);
      },
      (error) => {
        // Handle any errors
        console.error(error);
      }
    );

  }
}
