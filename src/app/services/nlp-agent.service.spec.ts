import { TestBed } from '@angular/core/testing';

import { NlpAgentService } from './nlp-agent.service';

describe('NlpAgentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NlpAgentService = TestBed.get(NlpAgentService);
    expect(service).toBeTruthy();
  });
});
