import { TestBed } from '@angular/core/testing';

import { AddFilesService } from './add-files.service';

describe('AddFilesService', () => {
  let service: AddFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
