import { Component, OnInit } from '@angular/core';
import { Tab1Component as Tab1, FormData as Tab1Data } from './tab1/tab1.component';
import { Tab2Component as Tab2, FormData as Tab2Data } from './tab2/tab2.component';
import { AsyncPipe, NgIf } from '@angular/common'; // sometimes *ngIf looks better than @if
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { MessagesService } from '../services/messages.service';

type State = {
  tab1: Tab1Data,
  tab2: Tab2Data
}

@Component({
  selector: 'app-page-form',
  standalone: true,
  imports: [NgIf, Tab1, Tab2, AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './page-form.component.html',
  styleUrl: './page-form.component.scss'
})
export class PageFormComponent implements OnInit {

  currentState = this._getEmptyState();
  initState = this._getEmptyState();

  loading: number = 0;
  selectedTab$!: Observable<string>;

  constructor(private route: ActivatedRoute, public messages: MessagesService) {}

  ngOnInit(): void {
    this.selectedTab$ = this.route.paramMap.pipe(
      switchMap(params => of(params.get('tab') || 'tab1'))
    )
  }

  // I can't think of a better way to force TS the use the correct type.
  // For the 2 tabs that we have,
  // updateTab1<Tab1Data> and updateTab2<Tab2Data> would be my choice,
  // but that is not ideal either
  updateState(pair:
    ['tab1', Tab1Data] |
    ['tab2', Tab2Data]
  ) {
    this.currentState[pair[0]] = { ...pair[1] }; // lets make a clone of the data just in case
  }

  save() {
    this.loading++;
    setTimeout(() => {
      this.loading--;
    }, 2000);
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
}
