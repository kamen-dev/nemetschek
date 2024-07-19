import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Tab1Data } from '../../models';

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
export class Tab1Component implements OnInit, OnChanges {
  @Input() prefill: Tab1Data = {
    field1: '',
    field2: ''
  };
  @Output() valueChange = new EventEmitter<Tab1Data>();

  @Input()
  disabled: boolean = true;

  form = new FormGroup({
    field1: new FormControl<string>('') as FormControl<string>,
    field2: new FormControl<string>('') as FormControl<string>,
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe(value => {
      this.valueChange.emit(value);
    });
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
}
