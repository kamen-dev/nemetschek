import { Injectable } from '@angular/core';
import { TextStorageService } from '../text-storage/text-storage.service';

import { delay, map, Observable } from 'rxjs';
import { Tab2Data } from '../models';

@Injectable({
  providedIn: 'root'
})
export class Tab2Service {

  constructor(private storage: TextStorageService) { }

  fetch(): Observable<Tab2Data> {
    return this.storage.fetch('tab2').pipe(map(str => {
      try {
        return JSON.parse(str || '{}') as Tab2Data;
      } catch (err) {
        alert("Invalid JSON"); //not sure how to handle this
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
          return data;
        }
      })
    );
  }
}
