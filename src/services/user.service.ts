import cities from '@utils/cities/cities.json';

export const validateCityId = (cityId: number | string) => {
    const currentCity = cities.find((city) => +city.id === +cityId);
    return !!currentCity;
};
