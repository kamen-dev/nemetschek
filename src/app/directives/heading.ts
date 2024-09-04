import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'appHeading'
})
export class HeadingDirective implements OnInit {
  @Input('level') level: string = '1'; // The number that will determine the heading level

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Create the heading element
    const headingElement = this.renderer.createElement(`h${this.level}`);

    // Move the content into the new heading element
    while (this.el.nativeElement.firstChild) {
      this.renderer.appendChild(headingElement, this.el.nativeElement.firstChild);
    }

    // Clear the original content
    this.el.nativeElement.innerHTML = '';

    // Append the heading element to the host element
    this.renderer.appendChild(this.el.nativeElement, headingElement);
  }
}
