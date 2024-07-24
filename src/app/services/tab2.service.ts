import { Injectable } from '@angular/core';
import { TextStorageService } from '../text-storage/text-storage.service';
import { LoggerService } from './logger.service';

import { delay, map, Observable } from 'rxjs';
import { Tab2Data } from '../models';

@Injectable({
  providedIn: 'root'
})
export class Tab2Service {

  constructor(
    private storage: TextStorageService,
    private logger: LoggerService
  ) { }

  fetch(): Observable<Tab2Data> {
    return this.storage.fetch('tab2').pipe(map(str => {
      try {
        return JSON.parse(str || '{}') as Tab2Data;
      } catch (err) {
        this.logger.log({
          type: 'error',
          bucket: 'Tab2Service.fetch',
          text: JSON.stringify({
            input: str,
            error: (err as Error).message
          })
        })
      }
      return { field3: '', field4: [] }
    }));
  }

  save(data: Tab2Data): Observable<Tab2Data> {
    const str = JSON.stringify(data);
    return this.storage.put('tab2', str).pipe(
      delay(3500),
      map(res => {
        try {
          return JSON.parse(res);
        } catch (err) {
          this.logger.log({
            type: 'error',
            bucket: 'Tab2Service.save',
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
