import type { Request, Response } from 'express';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { BaseController } from './base.controller';

class LocationController extends BaseController {
    private citiesCache: any = null;
    private provincesCache: any = null;

    getAllCities = async (req: Request, res: Response): Promise<any> => {
        try {
            await this.loadData();
            return this.successResponse(res, {
                cities: this.citiesCache,
                provinces: this.provincesCache,
            });
        } catch {
            return this.errorResponse(res, 'Error loading location data');
        }
    };

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
}

export default new LocationController();
