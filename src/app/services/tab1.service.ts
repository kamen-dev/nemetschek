import { Injectable } from '@angular/core';
import { TextStorageService } from '../text-storage/text-storage.service';
import { LoggerService } from './logger.service';

import { delay, map, Observable } from 'rxjs';
import { Tab1Data } from '../models';

@Injectable({
  providedIn: 'root'
})
export class Tab1Service {

  constructor(
    private storage: TextStorageService,
    private logger: LoggerService
  ) { }

  fetch(): Observable<Tab1Data> {
    return this.storage.fetch('tab1').pipe(map(str => {
      try {
        return JSON.parse(str || '{}') as Tab1Data;
      } catch (err) {
        this.logger.log({
          type: 'error',
          bucket: 'Tab1Service.fetch',
          text: JSON.stringify({
            input: str,
            error: (err as Error).message
          })
        })
        throw (err);
      }
    }));
  }

  save(data: Tab1Data): Observable<Tab1Data> {
    const str = JSON.stringify(data);
    return this.storage.put('tab1', str).pipe(
      delay(2500),
      map(res => {
        try {
          return JSON.parse(res);
        } catch (err) {
          this.logger.log({
            type: 'error',
            bucket: 'Tab1Service.save',
            text: JSON.stringify({
              input: data,
              error: (err as Error).message
            })
          })
          return data;
        }
      })
    );
  }
}
