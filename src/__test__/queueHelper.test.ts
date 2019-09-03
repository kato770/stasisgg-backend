import { getMapFromQueueId } from '../queueHelper';


describe('getMapFromQueueId', () => {
  it('return Normal', () => {
    expect(getMapFromQueueId(430)).toBe('Normal');
  });
  it('return Ranked', () => {
    expect(getMapFromQueueId(420)).toBe('Ranked');
  });
  it('return error', () => {
    expect(() => {
      getMapFromQueueId(999);
    }).toThrow(new Error(`queueId: 999 is not supported`));
  });
});