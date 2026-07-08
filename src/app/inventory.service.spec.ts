import { TestBed } from '@angular/core/testing';

import { InventoryServer } from './inventory.server';

describe('InventoryServer', () => {
  let service: InventoryServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
