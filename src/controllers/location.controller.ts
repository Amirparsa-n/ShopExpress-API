import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import * as fs from 'fs/promises';
import * as path from 'path';

class Location extends BaseController {
    private citiesCache: any = null;
    private provincesCache: any = null;

    private async loadData() {
        if (!this.citiesCache || !this.provincesCache) {
            const citiesPath = path.join(__dirname, '../data/cities/cities.json');
            const provincesPath = path.join(__dirname, '../data/cities/provinces.json');

            const [citiesData, provincesData] = await Promise.all([
                fs.readFile(citiesPath, 'utf-8'),
                fs.readFile(provincesPath, 'utf-8'),
            ]);

            this.citiesCache = JSON.parse(citiesData);
            this.provincesCache = JSON.parse(provincesData);
        }
    }

    getAllCities = async (req: Request, res: Response): Promise<any> => {
        try {
            await this.loadData();
            return this.successResponse(res, {
                cities: this.citiesCache,
                provinces: this.provincesCache,
            });
        } catch (error) {
            return this.errorResponse(res, 'Error loading location data');
        }
    };
}

export default new Location();
