import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageWelcomeComponent } from './page-welcome.component';

describe('PageWelcomeComponent', () => {
  let component: PageWelcomeComponent;
  let fixture: ComponentFixture<PageWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
