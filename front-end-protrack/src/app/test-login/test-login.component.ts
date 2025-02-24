import { Component, OnInit } from '@angular/core';
import { LoginapiService } from '../loginapi.service';
import { Router } from '@angular/router';
import { ReloadService } from '../reload.service';
import { HeadersService } from '../headers.service';
import { environment } from 'src/environments/environment';

// self code
@Component({
  selector: 'app-test-login',
  templateUrl: './test-login.component.html',
  // styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/custom.css', '../../assets/css/font-awesome.min.css']
  styleUrls: ['./test-login.component.css', '../../assets/css/bootstrap.min.css',  ]
})
export class TestLoginComponent implements OnInit {

  employee_code :string;
  password : string;
  employeeCodeS: string;
  passwordS: string;

    loginTime: Date;
 
  constructor(private reloadService: ReloadService, private loginapiService:LoginapiService,  private router:Router, private headersService:HeadersService) { }



  login(){  
    

    this.loginapiService.login(this.employee_code,this.password,this.loginTime).subscribe(async (resp)=>{
      
   
      console.warn(resp);
     
      localStorage.setItem("token", resp.token);
      this.headersService.setToken(resp.token);
      
      this.router.navigate(['/dashboard']);
      // this.reloadService.reload();
     
    },
    (err)=>{
      alert("something went wrong");
   
    }
    );

  }

  ngOnInit(): void {
  }

}
