import { Observable } from "rxjs"

export interface TextStorageInterface {
  // when we put data in the storage, we expect to get the data back.
  // it may be modified with an ID or an revID...
  put(key: string, data: string): Observable<string>

  // same signature as local storage
  fetch(key: string): Observable<string | null>

  // same signature as local storage
  remove(key: string): Observable<void>
}
