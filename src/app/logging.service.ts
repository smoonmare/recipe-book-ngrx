import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  lastLog: string = '';

  constructor() { }

  printLog(message: string) {
    console.log(`Last Log message: ${this.lastLog}`);
    console.log(`New Log message: ${message}`);
    this.lastLog = message;
  }
}
