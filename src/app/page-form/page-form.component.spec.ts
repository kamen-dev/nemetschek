import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFormComponent } from './page-form.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PageFormComponent', () => {
  let component: PageFormComponent;
  let fixture: ComponentFixture<PageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFormComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: { paramMap: of({ tab: 'tab1' }) }
      }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all action buttons', () => {
    fixture = TestBed.createComponent(PageFormComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('[data-test-button]').length).toEqual(3);
  });
});
