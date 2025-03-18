import cities from '@utils/cities/cities.json';

export const validateCityId = (cityId: string | number) => {
    const currentCity = cities.find((city) => +city.id === +cityId);
    return !!currentCity;
};
