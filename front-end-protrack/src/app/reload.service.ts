import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  constructor() { }
  reload() {
    window.location.reload();
  }
  
}
