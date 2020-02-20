export const ADDRESS_GEOCODING = 'ADDRESS_GEOCODING';
export const ADDRESS_GEOCODING_ONCE = 'ADDRESS_GEOCODING_ONCE';
export const ADDRESS_GEOCODING_BACK = 'ADDRESS_GEOCODING_BACK';

export const addressGeocoding = (data) => ({ type: ADDRESS_GEOCODING, data });
export const addressGeocodingOnce = (data) => ({ type: ADDRESS_GEOCODING_ONCE, data });
export const addressGeocodingBack = (params) => ({ type: ADDRESS_GEOCODING_BACK, params });
