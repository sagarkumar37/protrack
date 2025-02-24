import { Component } from '@angular/core';
import { TestLoginComponent } from './test-login/test-login.component';
import { environment } from 'src/environments/environment';
// import { url } from 'inspector';

@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  template:`<test-login (sendData)="handleData($event)"></test-login> <test-started [receivedData]="passedData"></test-started>`,


  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quick-app';
  

  startTime: Date;
  elapsedTime: string;

  startTimer() {
    this.startTime = new Date();
    setInterval(() => {
      const timeDiff = new Date().getTime() - this.startTime.getTime();
      this.elapsedTime = this.msToTime(timeDiff);
    }, 1000);
  }

  msToTime(duration: number): string {
    const milliseconds = Math.floor((duration % 1000) / 10);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return (
      this.pad(hours) + ':' + this.pad(minutes) + ':' + this.pad(seconds) + '.' + this.pad(milliseconds)
    );
  }

  pad(n: number): string {
    return ('00' + n).slice(-2);
  }

}
