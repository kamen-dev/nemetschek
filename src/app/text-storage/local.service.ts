import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TextStorageService } from './text-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService extends TextStorageService {

  override put(key: string, data: string): Observable<string> {
    localStorage.setItem(key, data);
    return of(data);
  }

  override fetch(key: string): Observable<string | null> {
    return of(localStorage.getItem(key));
  }

  override remove(key: string): Observable<void> {
    return of(localStorage.removeItem(key));
  }
}
