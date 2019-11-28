/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { DDragon } from '../../helper/ddragon';
import { versionsResponse } from '../mock';
jest.mock('axios');

describe('getValidVersion', () => {
  it('valid input', async () => {
    const ddragon = new DDragon();
    (axios.get as any).mockResolvedValue(versionsResponse);
    const version = await ddragon.getValidVersion('9.19.290.8808');
    expect(version).toEqual('9.19.1');
  });
  it('invalid input', async () => {
    const ddragon = new DDragon();
    (axios.get as any).mockResolvedValue(versionsResponse);
    const version = await ddragon.getValidVersion('Should not pass string like this');
    expect(version).toEqual(await ddragon.getLatestVersion());
  });
});