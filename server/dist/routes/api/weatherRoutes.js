import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req, res) => {
    try {
        // TODO: GET weather data from city name
        const weather = await WeatherService.getWeatherForCity(_req.body.cityName);
        // TODO: save city to search history
        await HistoryService.addCity(_req.body.cityName);
        res.json(weather);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const cities = await HistoryService.getCities();
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, res) => {
    try {
        await HistoryService.removeCity(_req.params.id);
        res.status(200).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove city from histry' });
    }
});
export default router;
