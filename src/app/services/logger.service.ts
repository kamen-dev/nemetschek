import { Injectable } from '@angular/core';
import { Message } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(message: Partial<Message>) {
    message = {
      id: (new Date()).getTime().toString(),
      type: 'info',
      bucket: 'dafault',
      duration: 0,
      text: '',
      ...message
    }
    // send the message over to a bekend so it can be replicated maybe
  }
}
