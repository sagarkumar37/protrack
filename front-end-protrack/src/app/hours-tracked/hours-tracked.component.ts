import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-hours-tracked',
  // templateUrl: './hours-tracked.component.html',
  templateUrl: './hours-tracked.component.html',
  styleUrls: ['../../assets/css/custom.css', '../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css']
  // styleUrls: ['./hours-tracked.component.css', './assets/css/bootstrap.min.css', './assets/css/font-awesome.min.css']
})
export class HoursTrackedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
