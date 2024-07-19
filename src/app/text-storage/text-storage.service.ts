import { Injectable } from '@angular/core';
import { TextStorageInterface } from './text-storage.interface';
import { Observable, of } from 'rxjs';

// This is the base service that wil be used in our components
// e.g. constructor(storage: TextStorageService) { }

@Injectable({
  providedIn: 'root'
})
export class TextStorageService implements TextStorageInterface {

  constructor() { }

  put(key: string, data: string): Observable<string> {
    return of(data);
  }

  fetch(key: string): Observable<string | null> {
    return of();
  }

  remove(key: string): Observable<void> {
    return of();
  }
}
