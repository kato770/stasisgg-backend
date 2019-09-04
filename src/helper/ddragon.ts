import axios from 'axios';


export class DDragon {
  readonly ddragon = 'https://ddragon.leagueoflegends.com';
  version: string;

  constructor(version = '9.17') {
    this.version = version;
  }

  async getLatestVersion(): Promise<string> {
    return new Promise((resolve, reject): void => {
      axios.get(`${this.ddragon}/api/versions.json`)
        .then(data => resolve(data.data[0]))
        .catch(error => reject(error.message));
    });
  }

  async getItemList(specifiedVersion: string): Promise<string> {
    const version = specifiedVersion || await this.getLatestVersion();
    return new Promise((resolve, reject): void => {
      axios.get(`${this.ddragon}/cdn/${version}/data/en_US/item.json`)
        .then(data => resolve(data.data))
        .catch(error => reject(error));
    });
  }

  async getItemSpriteURL(specifiedVersion: string, itemId: number): Promise<string> {
    const version = specifiedVersion || await this.getLatestVersion();
    return `${this.ddragon}/cdn/${version}/img/item/${itemId}.png`;
  }
}