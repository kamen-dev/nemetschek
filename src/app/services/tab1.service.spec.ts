import { TestBed } from '@angular/core/testing';

import { Tab1Service } from './tab1.service';
import { TextStorageService } from '../text-storage/text-storage.service';
import { LoggerService } from './logger.service';
import { of } from 'rxjs';
import { Tab1Data } from '../models';

describe('Tab1Service', () => {
  let service: Tab1Service;
  let storageServiceSpy: jasmine.SpyObj<TextStorageService>;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('TextStorageService', ['fetch', 'put']);
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        Tab1Service,
        { provide: TextStorageService, useValue: storageSpy },
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(Tab1Service);
    storageServiceSpy = TestBed.inject(TextStorageService) as jasmine.SpyObj<TextStorageService>;
    loggerServiceSpy = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#fetch', () => {
    it('should fetch and parse data', (done: DoneFn) => {
      const mockData = { field1: 'field1', field2: 'field2' };
      storageServiceSpy.fetch.and.returnValue(of(JSON.stringify(mockData)));

      service.fetch().subscribe(data => {
        expect(data).toEqual(mockData);
        done();
      });
    });

    it('should log an error and throw if JSON parsing fails', (done: DoneFn) => {
      const invalidJson = 'invalid json';
      storageServiceSpy.fetch.and.returnValue(of(invalidJson));

      service.fetch().subscribe({
        next: () => { },
        error: (err) => {
          expect(loggerServiceSpy.log).toHaveBeenCalled();
          expect(err).toBeTruthy();
          done();
        }
      });
    });
  });

  describe('#save', () => {
    it('should save and return data after a delay', (done: DoneFn) => {
      const mockData: Tab1Data = { field1: 'field1', field2: 'field2' };
      const mockResponse = JSON.stringify(mockData);
      storageServiceSpy.put.and.returnValue(of(mockResponse));

      service.save(mockData).subscribe(data => {
        expect(data).toEqual(mockData);
        done();
      });
    });

    it('should log an error and return the input data if JSON parsing of response fails', (done: DoneFn) => {
      const mockData: Tab1Data = { field1: 'field1', field2: 'field2' };
      const invalidJsonResponse = 'invalid json';
      storageServiceSpy.put.and.returnValue(of(invalidJsonResponse));

      service.save(mockData).subscribe(data => {
        expect(loggerServiceSpy.log).toHaveBeenCalled();
        expect(data).toEqual(mockData);
        done();
      });
    });
  });
});
