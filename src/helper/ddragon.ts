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

  async getValidVersion(specificVersion?: string): Promise<string> {
    if (!specificVersion) return this.getLatestVersion();

    const firstPeriod = specificVersion.indexOf(".");
    const secondPeriod = specificVersion.indexOf(".", firstPeriod + 1);
    if (secondPeriod === -1) return this.getLatestVersion();
  
    const trimmedVersion = specificVersion.slice(0, secondPeriod);
    try {
      const versions = await axios.get(`${this.ddragon}/api/versions.json`);
      const foundVersion = versions.data.find((e: string) => e.startsWith(trimmedVersion));
      if (foundVersion) {
        return foundVersion;
      } else {
        throw new Error('something happen');
      }
    } catch  {
      return this.getLatestVersion();
    }
  }

  async getItemSpriteURL(itemId: number, specificVersion?: string): Promise<string> {
    if (!this.version) {
      this.version = await this.getValidVersion(specificVersion);
    }
    return `${this.ddragon}/cdn/${this.version}/img/item/${itemId}.png`;
  }

  async getChampionSpriteURL(championId: number | undefined, specificVersion?: string): Promise<string> {
    if (!championId) {
      return `${this.cdragon}/${this.version}/champion/generic/square`;
    }
    if (!this.version) {
      this.version = await this.getValidVersion(specificVersion);
    }
    return `${this.cdragon}/${this.version}/champion/${championId}/square`;
  }

  async getProfileIconURL(profileIconId: number): Promise<string> {
    if (!this.version) {
      this.version = await this.getLatestVersion();
    }
    return `${this.ddragon}/cdn/${this.version}/img/profileicon/${profileIconId}.png`;
  }
}