import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, 'searchHistory.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      if (!data.trim()) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]) {
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      console.error(error);
    }

  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities() {
    const cityArray = await this.read();
    return cityArray.map((item: any) => new City(item.name, item.id));
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string) {
    const cityArray = await this.read();

    let id = '1';
    if (cityArray.length > 0) {
      id = (parseInt(cityArray[cityArray.length - 1].id) + 1).toString();
    }

    const newCity = new City(city, id);
    cityArray.push(newCity);
    await this.write(cityArray);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
