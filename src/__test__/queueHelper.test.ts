import { getMapFromQueueId } from '../queueHelper';


describe('getMapFromQueueId', () => {
  it('return Normal', () => {
    expect(getMapFromQueueId(430)).toBe('Normal');
  });
});