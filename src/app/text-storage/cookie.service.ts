import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TextStorageService } from './text-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CookieService extends TextStorageService {

  override put(key: string, data: string): Observable<string> {
    this.setCookie(key, data, 365);
    return of(data);
  }

  override fetch(key: string): Observable<string | null> {
    return of(this.getCookie(key));
  }

  override remove(key: string): Observable<void> {
    return of(this.deleteCookie(key));
  }

  // stolen from here
  // https://stackoverflow.com/questions/34298133/angular-cookies

  private getCookie(name: string) {
    let arr: string[] = document.cookie.split(';');
    let len: number = arr.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < len; i += 1) {
      c = arr[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  private setCookie(name: string, value: string, expireDays: number, path: string = '/') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  private deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }
}
