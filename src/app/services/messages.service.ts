import { Injectable, signal } from '@angular/core';

export type Message = {
  id: string,
  type: 'info' | 'success' | 'error' | 'warning',
  bucket: string,
  text: string,
  duration: number //maybe implement autodelete or something
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  protected _messages = signal<Message[]>([]);

  constructor() { }

  add(message: Partial<Message>) {
    this._messages.update(msgs => {
      msgs.push({
        id: (new Date()).getTime().toString(),
        type: 'info',
        bucket: 'dafault',
        duration: 0,
        text: '',
        ...message
      });
      return msgs;
    });
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
