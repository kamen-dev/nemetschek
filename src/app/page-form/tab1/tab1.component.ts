import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

export type FormData = {
  field1?: string;
  field2?: string;
}

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './tab1.component.html',
  styleUrls: [
    // Not my prefered way to share styles.
    // Usualy I would have a global theme or some lib like material/tailwind
    '../page-form.children.scss',
    './tab1.component.scss'
  ]
})
export class Tab1Component implements OnInit, OnChanges, OnDestroy {
  @Input() prefill: FormData = {
    field1: '',
    field2: ''
  };
  @Output() valueChange = new EventEmitter<FormData>();

  @Input()
  disabled: boolean = true;

  protected _subs: Subscription[] = [];

  form = new FormGroup({
    field1: new FormControl<string>('') as FormControl<string>,
    field2: new FormControl<string>('') as FormControl<string>,
  });

  ngOnInit(): void {
    const sub = this.form.valueChanges.subscribe(value => {
      this.valueChange.emit(value);
    });
    this._subs.push(sub);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prefill']) {
      this.form.patchValue(changes['prefill'].currentValue);
    }
    if (changes['disabled']) {
      if (changes['disabled'].currentValue) {
        this.form.get('field1')?.disable();
        this.form.get('field2')?.disable();
      } else {
        this.form.get('field1')?.enable();
        this.form.get('field2')?.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
