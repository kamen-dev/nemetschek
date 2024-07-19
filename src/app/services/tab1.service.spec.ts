import { TestBed } from '@angular/core/testing';

import { Tab1Service } from './tab1.service';

describe('Tab1Service', () => {
  let service: Tab1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tab1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
