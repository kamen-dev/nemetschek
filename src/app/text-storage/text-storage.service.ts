import { Injectable } from '@angular/core';
import { TextStorageInterface } from './text-storage.interface';
import { Observable, of } from 'rxjs';

// This is the base service that wil be used in our components
// e.g. constructor(storage: TextStorageService) { }

@Injectable({
  providedIn: 'root'
})
export abstract class TextStorageService implements TextStorageInterface {

  abstract put(key: string, data: string): Observable<string>

  abstract fetch(key: string): Observable<string | null>

  abstract remove(key: string): Observable<void>
}
