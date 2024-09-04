import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JokesService {
  private http = inject(HttpClient);

  private refresh$ = new BehaviorSubject<void>(undefined);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  private endpoint = 'https://v2.jokeapi.dev/joke/any?amount=5';
  private apiRequest$ = this.http.get<any[]>(this.endpoint).pipe(
    map((res: any) => res?.jokes || []),
    delay(1000)
  );

  public list$ = this.refresh$.pipe(
    tap(_ => this.isLoading$.next(true)),
    switchMap(_ => this.apiRequest$),
    tap(_ => this.isLoading$.next(false)),
    shareReplay(1)
  );

  public refresh() {
    this.refresh$.next();
  }

  get loading$() {
    return this.isLoading$.pipe(distinctUntilChanged(), delay(0));
  }
}
