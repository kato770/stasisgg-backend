import { getMapFromQueueId } from '../../helper/queueHelper';


describe('getMapFromQueueId', () => {
  it('return Ranked', () => {
    expect(getMapFromQueueId(420)).toBe('Ranked');
  });
  it('return Normal', () => {
    expect(getMapFromQueueId(430)).toBe('Normal');
  });
  it('return Flex', () => {
    expect(getMapFromQueueId(440)).toBe('Flex');
  });
  it('return undefind', () => {
    expect(getMapFromQueueId(999)).toBe(undefined);
  });
});