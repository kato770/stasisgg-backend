import axios from 'axios';


export class DDragon {
  readonly ddragon = 'https://ddragon.leagueoflegends.com';
  readonly cdragon = 'https://cdn.communitydragon.org';
  version: string;

  async getLatestVersion(): Promise<string> {
    return new Promise((resolve, reject): void => {
      axios.get(`${this.ddragon}/api/versions.json`)
        .then(data => resolve(data.data[0]))
        .catch(error => reject(error.message));
    });
  }

  async getItemSpriteURL(itemId: number, specifiedVersion?: string): Promise<string> {
    if (!this.version) {
      this.version = specifiedVersion || await this.getLatestVersion();
    }
    return `${this.ddragon}/cdn/${this.version}/img/item/${itemId}.png`;
  }

  async getChampionSpriteURL(championId: number | undefined, specifiedVersion?: string): Promise<string> {
    if (!championId) {
      return `${this.cdragon}/${this.version}/champion/generic/square`;
    }
    if (!this.version) {
      this.version = specifiedVersion || await this.getLatestVersion();
    }
    return `${this.cdragon}/${this.version}/champion/${championId}/square`;
  }
}