import type { SendableSteps } from '../model/steps';
import { getVersionHistorySelections } from './version-history-selections';

const buildSendableStep = (overrides: Partial<SendableSteps> = {}): SendableSteps => ({
  version: 1,
  clientID: 'test-client',
  clientTimestamp: '2026-07-03T10:00:00.000Z',
  steps: [],
  ...overrides,
});

const minTimeOnlyConfig = {
  minTimeStep: 5,
  maxTimeStep: 60,
  meaningfulChangeThreshold: 1,
};

describe('getVersionHistorySelections', () => {
  it('returns an empty array when no steps are provided', () => {
    expect(getVersionHistorySelections([])).toEqual([]);
  });

  it('groups steps into 5 minute intervals', () => {
    const steps: SendableSteps[] = [
      buildSendableStep({ version: 1, clientTimestamp: '2026-07-03T10:00:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 2, clientTimestamp: '2026-07-03T10:01:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 3, clientTimestamp: '2026-07-03T10:08:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 4, clientTimestamp: '2026-07-03T10:09:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 5, clientTimestamp: '2026-07-03T10:20:00.000Z', steps: [{}] }),
    ];

    expect(getVersionHistorySelections(steps, minTimeOnlyConfig)).toEqual([
      { from: 4, to: 5 },
      { from: 2, to: 4 },
      { from: 0, to: 2 },
    ]);
  });

  it('separates steps exactly 5 minutes apart into different groups', () => {
    const steps: SendableSteps[] = [
      buildSendableStep({ version: 1, clientTimestamp: '2026-07-03T10:00:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 2, clientTimestamp: '2026-07-03T10:05:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 3, clientTimestamp: '2026-07-03T10:10:00.000Z', steps: [{}] }),
    ];

    expect(getVersionHistorySelections(steps, minTimeOnlyConfig)).toEqual([
      { from: 2, to: 3 },
      { from: 1, to: 2 },
      { from: 0, to: 1 },
    ]);
  });

  it('merges small time groups until the meaningfulChangeThreshold is reached', () => {
    const steps: SendableSteps[] = [
      buildSendableStep({ version: 1, clientTimestamp: '2026-07-03T10:00:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 2, clientTimestamp: '2026-07-03T10:05:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 3, clientTimestamp: '2026-07-03T10:10:00.000Z', steps: [{}] }),
    ];

    expect(
      getVersionHistorySelections(steps, {
        minTimeStep: 5,
        maxTimeStep: 60,
        meaningfulChangeThreshold: 3,
      })
    ).toEqual([{ from: 0, to: 3 }]);
  });

  it('splits on maxTimeStep even when meaningfulChangeThreshold is not met', () => {
    const steps: SendableSteps[] = [
      buildSendableStep({ version: 1, clientTimestamp: '2026-07-03T10:00:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 2, clientTimestamp: '2026-07-03T10:05:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 3, clientTimestamp: '2026-07-03T10:10:00.000Z', steps: [{}] }),
      buildSendableStep({ version: 4, clientTimestamp: '2026-07-03T10:15:00.000Z', steps: [{}] }),
    ];

    expect(
      getVersionHistorySelections(steps, {
        minTimeStep: 5,
        maxTimeStep: 10,
        meaningfulChangeThreshold: 100,
      })
    ).toEqual([
      { from: 3, to: 4 },
      { from: 0, to: 3 },
    ]);
  });
});

