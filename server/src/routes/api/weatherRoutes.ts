import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req: Request, res: Response) => {
  try {
  // TODO: GET weather data from city name
    const weather = await WeatherService.getWeatherForCity(_req.body.cityName);
  // TODO: save city to search history
    await HistoryService.addCity(_req.body.cityName);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});


// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
