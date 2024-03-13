import { TestBed } from '@angular/core/testing';

import { VerificacaoLinkService } from './verificacao-link.service';

describe('VerificacaoLinkService', () => {
  let service: VerificacaoLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificacaoLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
