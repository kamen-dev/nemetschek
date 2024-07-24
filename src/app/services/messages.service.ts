import { Injectable, signal } from '@angular/core';
import { Message } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  protected _messages = signal<Message[]>([]);

  constructor() { }

  add(message: Partial<Message>) {
    this._messages.update(msgs => [...msgs, {
      id: (new Date()).getTime().toString(),
      type: 'info',
      bucket: 'dafault',
      duration: 0,
      text: '',
      ...message
    }]);
  }

  error(text: string) {
    return this.add({ type: 'error', text })
  }

  get = () => this._messages();

  remove(ind: number) {
    this._messages.update(msgs => {
      return msgs.filter((_, k) => k !== ind);
    });
  }

  clear() {
    this._messages.update(msgs => {
      return msgs.filter(() => false);
    });
  }

}
