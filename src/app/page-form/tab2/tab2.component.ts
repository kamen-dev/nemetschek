import { NgIf } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, SimpleChange, OnDestroy, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessagesService } from '../../services/messages.service';

// I need a domain context for better name..
export type Entity = {
  id: string,     // idealy some sort of uuid
  value: string,  // the text that was entered in the input field
  order: number   // different browsers don't always perserve json array's order of items
}

export type FormData = {
  field3?: string;  // I am not sure if this field should be saved.
  field4?: Entity[];
}

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
export class Tab2Component implements OnInit, OnDestroy, OnChanges {
  @Input() prefill: FormData = {
    field3: '',
    field4: []
  };
  @Output() valueChange = new EventEmitter<FormData>();

  @Input()
  disabled: boolean = true;

  protected _subs: Subscription[] = [];

  entities: Entity[] = [];

  form = new FormGroup({
    field3: new FormControl<string>('') as FormControl<string>,
  })

  state: FormData = {
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
    const sub = this.form.valueChanges.subscribe(value => {
      this.state = {
        field3: value.field3,
        field4: this.entities
      };
      this.valueChange.emit(this.state);
    });
    this._subs.push(sub);
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
    this.entities = changed.field4.sort((a: Entity, b: Entity) => {
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

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }

  addEntity(text: string) {
    if (text.length === 0) {
      return this.messages.add({
        type: 'error',
        text: 'please enter a value',
      });
    }

    if (this.entities.length >= 10) {
      return this.messages.add({
        type: 'error',
        text: 'maximum number of items reached',
      });
    }

    let lower = text.toLowerCase();
    if (this.entities.find(ent => ent.value.toLowerCase() === lower) !== undefined) {
      return this.messages.add({
        type: 'error',
        text: 'item already exists in array',
      });
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

  removeEntity(ind: number) {
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

  hoverEntity: number = -1;
  dragEntity: number = -1;

  // why event delegation instead of directly calling removeEntity($index)??
  // For this demo it is an overkill, but for large lists with 100k+ rows this
  // saves a lot of memory and cpu power
  handdleEntityMouseEvent(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let entityEl = target.closest('[data-ind]');

    if (!entityEl) {
      if (this.hoverEntity > -1) {
        this.hoverEntity = -1;
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
      this.dragEntity = entityInd;
      return;
    }

    if (event.type === 'dragover') {
      event.preventDefault();
      return;
    }

    if (event.type === 'drop') {
      this.reorderEntities(this.dragEntity, entityInd);
      return;
    }

    if (event.type === 'click' && target.closest('[data-action="delete"]')) {
      this.removeEntity(entityInd);
      return;
    }

    if (event.type === 'mouseover' && this.hoverEntity !== entityInd) {
      entityEl.appendChild(this.deleteButton);
      this.hoverEntity === entityInd;
      return;
    }
  }
}
