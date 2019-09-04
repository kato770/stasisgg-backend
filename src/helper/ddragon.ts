import axios from 'axios';


export class DDragon {
  readonly ddragon = 'https://ddragon.leagueoflegends.com';
  version: string;

  constructor(version = '9.17') {
    this.version = version;
  }

  async getLatestVersion(): Promise<void> {
    return new Promise((resolve, reject): void => {
      axios.get(`${this.ddragon}/api/versions.json`)
        .then(data => {
          this.version = data.data[0];
          resolve();
        })
        .catch(error => reject(error.message));
    });
  }

  async getChampionList(version: string): Promise<void> {
    return new Promise((resolve, reject): void => {
      axios.get(`${this.ddragon}/cdn/${this.version}/data/en_US/championFull.json`)
        .then(data => resolve(data.data))
        .catch(error => reject(error.message));
    });
  }
}