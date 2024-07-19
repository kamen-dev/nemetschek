import { NgIf } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, SimpleChange, OnDestroy, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesService } from '../../services/messages.service';

import { Tab2Entity, Tab2Data } from '../../models';

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './tab2.component.html',
  styleUrls: [
    '../page-form.children.scss',
    './tab2.component.scss'
  ]
})
export class Tab2Component implements OnInit, OnChanges {
  @Input() prefill: Tab2Data = {
    field3: '',
    field4: []
  };
  @Output() valueChange = new EventEmitter<Tab2Data>();

  @Input()
  disabled: boolean = true;

  entities: Tab2Entity[] = [];

  form = new FormGroup({
    field3: new FormControl<string>('') as FormControl<string>,
  })

  state: Tab2Data = {
    field3: '',
    field4: []
  }

  deleteButton!: HTMLButtonElement;

  constructor(public messages: MessagesService) {
    // local instance of the message service if we want it
    // this.messages = new MessagesService();
  }

  ngOnInit(): void {
    // TODO use html ng-template refference instead of harcoding the button here
    // again this is usefull only for large lists where the number of extra dom elements adds up.
    // If there is a
    this.deleteButton = document.createElement('button');
    this.deleteButton.setAttribute('data-action', 'delete');
    this.deleteButton.setAttribute('title', 'remove');
    this.deleteButton.setHTMLUnsafe('-');

    // when field 3 is changed emit
    this.form.valueChanges.subscribe(value => {
      this.state = {
        field3: value.field3,
        field4: this.entities
      };
      this.valueChange.emit(this.state);
    });
  }

  onPrefillChanges(change: SimpleChange) {
    const changed = change.currentValue;
    if (JSON.stringify(changed) === JSON.stringify(this.state)) {
      return;
    }

    this.form.patchValue(changed);

    if (!changed.field4) {
      return;
    }
    this.entities = changed.field4.sort((a: Tab2Entity, b: Tab2Entity) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prefill']) {
      this.onPrefillChanges(changes['prefill']);
    }
    if (changes['disabled']) {
      if (changes['disabled'].currentValue)
        this.form.get('field3')?.disable();
      else
        this.form.get('field3')?.enable();
    }
  }

  addTab2Entity(text: string) {
    if (text.length === 0) {
      return this.messages.error('please enter a value');
    }

    if (this.entities.length >= 10) {
      return this.messages.error('maximum number of items reached');
    }

    let lower = text.toLowerCase();
    if (this.entities.find(ent => ent.value.toLowerCase() === lower) !== undefined) {
      return this.messages.error('item already exists in array');
    }

    this.entities.push({
      id: (new Date()).getTime().toString(),
      value: text,
      order: this.entities.length,
    })

    this.form.patchValue({ field3: '' });
  }

  protected _recalcOrder() {
    this.entities = this.entities.map((ent, ind) => {
      ent.order = ind;
      return ent;
    });

    this.form.patchValue(this.form.value); //trigger change event
  }

  removeTab2Entity(ind: number) {
    this.entities.splice(ind, 1);
    this._recalcOrder();
  }

  reorderEntities(from: number, to: number) {
    if (from === to) return;
    if (this.entities[from] === undefined) return;
    const ent = this.entities.splice(from, 1)[0];
    this.entities.splice(to, 0, ent);
    this._recalcOrder();
  }

  hoverTab2Entity: number = -1;
  dragTab2Entity: number = -1;

  // why event delegation instead of directly calling removeTab2Entity($index)??
  // For this demo it is an overkill, but for large lists with 100k+ rows this
  // saves a lot of memory and cpu power
  handdleEntityMouseEvent(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let entityEl = target.closest('[data-ind]');

    if (!entityEl) {
      if (this.hoverTab2Entity > -1) {
        this.hoverTab2Entity = -1;
        this.deleteButton.parentElement?.removeChild(this.deleteButton);
      }
      return; // "clicked" somwhere on the parent but not on an entity row
    }

    let entityInd = parseInt(entityEl.getAttribute('data-ind') || '-1');
    if (entityInd < 0) {
      return this.messages.add({
        type: 'error',
        bucket: 'sortable',
        text: 'invalid entity id',
      });
    }

    if (event.type === 'dragstart') {
      this.dragTab2Entity = entityInd;
      return;
    }

    if (event.type === 'dragover') {
      event.preventDefault();
      return;
    }

    if (event.type === 'drop') {
      this.reorderEntities(this.dragTab2Entity, entityInd);
      return;
    }

    if (event.type === 'click' && target.closest('[data-action="delete"]')) {
      this.removeTab2Entity(entityInd);
      return;
    }

    if (event.type === 'mouseover' && this.hoverTab2Entity !== entityInd) {
      entityEl.appendChild(this.deleteButton);
      this.hoverTab2Entity === entityInd;
      return;
    }
  }
}
