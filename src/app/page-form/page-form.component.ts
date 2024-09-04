import { Component, inject, OnInit, signal } from '@angular/core';
import { Tab1Component as Tab1 } from './tab1/tab1.component';
import { Tab2Component as Tab2 } from './tab2/tab2.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common'; // sometimes *ngIf looks better than @if
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, delay, distinctUntilChanged, forkJoin, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MessagesService } from '../services/messages.service';
import { Tab1Data, Tab2Data } from '../models';
import { Tab1Service } from '../services/tab1.service';
import { Tab2Service } from '../services/tab2.service';
import { JokesService } from '../services/jokes.service';
// import { deepEqual } from 'assert'; // this does not work in the browser...

type State = {
  tab1: Tab1Data,
  tab2: Tab2Data
}

@Component({
  selector: 'app-page-form',
  standalone: true,
  imports: [NgIf, Tab1, Tab2, AsyncPipe, JsonPipe, RouterLink, RouterLinkActive],
  templateUrl: './page-form.component.html',
  styleUrl: './page-form.component.scss'
})
export class PageFormComponent implements OnInit {
  private destroy$ = new Subject();

  currentState = signal<State>(this._getEmptyState());
  savedState = signal<State>(this._getEmptyState());

  loading = signal(0);

  private route = inject(ActivatedRoute);
  selectedTab$ = this.route.paramMap.pipe(
    map(params => params.get('tab') || 'tab1'),
    distinctUntilChanged()
  )
  private jokes = inject(JokesService);
  jokesLoading$ = this.jokes.loading$;

  constructor(
    private tab1Service: Tab1Service,
    private tab2Service: Tab2Service,
    public messages: MessagesService,
  ) {
  }

  ngOnInit(): void {
    // since tab1 and tab2 are independant of each other
    // we will load them compleatly separetly

    this.loadTab1Data();
    this.loadTab2Data();
  }

  protected loadTab1Data() {
    this.loading.update(v => v + 1);
    this.tab1Service.fetch().pipe(
      delay(300), // testing if tab 1 flashes the data from store
      tap(_ => this.loading.update(v => v - 1)),
      takeUntil(this.destroy$),
      catchError(err => {
        this.loading.update(v => v - 1);
        this.messages.error(err);
        return of(this._getEmptyState().tab1);
      })
    ).subscribe((value) => {
      // make copies but destroy all complex data types like date or map
      this.currentState.update((state) => {
        state.tab1 = JSON.parse(JSON.stringify(value));
        return state;
      });
      this.savedState.update((state) => {
        state.tab1 = JSON.parse(JSON.stringify(value));
        return state;
      })
    })
  };

  protected loadTab2Data() {
    this.loading.update(v => v + 1);
    this.tab2Service.fetch().pipe(
      delay(1000),
      tap(_ => this.loading.update(v => v - 1)),
      takeUntil(this.destroy$),
      catchError(err => {
        this.loading.update(v => v - 1);
        this.messages.error(err);
        return of(this._getEmptyState().tab2);
      })
    ).subscribe((value) => {
      this.currentState.update((state) => {
        state.tab2 = JSON.parse(JSON.stringify(value));
        return state;
      });
      this.savedState.update((state) => {
        state.tab2 = JSON.parse(JSON.stringify(value));
        return state;
      })
    })
  }

  // I can't think of a better way to force TS the use the correct type.
  // For the 2 tabs that we have,
  // updateTab1<Tab1Data> and updateTab2<Tab2Data> would be my choice,
  // but that is not ideal either
  updateState(pair:
    ['tab1', Tab1Data] |
    ['tab2', Tab2Data]
  ) {
    this.currentState.update(state => {
      //why is this not recalculating onSavedState???
      state[pair[0]] = { ...pair[1] }; // lets make a clone of the data just in case
      return state;
    })
  }

  saveState() {
    this.loading.update(v => v + 1);

    // add fallback data on tab1
    const tab1 = this.tab1Service.save(this.currentState().tab1)
      .pipe(catchError(err => {
        this.messages.error(err);
        return of(this._getEmptyState().tab1);
      }))

    // add fallback data on tab2
    const tab2 = this.tab2Service.save(this.currentState().tab2)
      .pipe(catchError(err => {
        this.messages.error(err);
        return of(this._getEmptyState().tab2);
      }))

    forkJoin({ tab1, tab2 }).pipe(
      tap(_ => this.loading.update(v => v - 1)),
      takeUntil(this.destroy$),
      catchError(err => {
        this.messages.error(err);
        return of(this._getEmptyState());
      })
    ).subscribe((saved) => {
      this.savedState.set(JSON.parse(JSON.stringify(saved)));
    });
  }

  isOnSavedState() {
    const strCur = JSON.stringify(this.currentState());
    const strSaved = JSON.stringify(this.savedState());
    return (strCur === strSaved)
  }

  refreshJokes() {
    this.jokes.refresh();
  }

  protected _getEmptyState(): State {
    return {
      tab1: {
        field1: '',
        field2: '',
      },
      tab2: {
        field3: '',
        field4: []
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }
}
