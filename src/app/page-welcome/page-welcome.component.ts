import { Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { TextStorageService } from '../text-storage/text-storage.service';
import { HeadingDirective } from '../directives/heading';

@Component({
  selector: 'app-page-welcome',
  standalone: true,
  imports: [HeadingDirective],
  templateUrl: './page-welcome.component.html',
  styleUrl: './page-welcome.component.scss'
})
export class PageWelcomeComponent {
  // add the injector on the home page ass well.
  // Otherwise the logic for injecting the correct service
  // only works on the form page.
  constructor( private storage: TextStorageService) {}

}
