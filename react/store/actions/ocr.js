export const ADD_PHOTO = 'ADD_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const SEND_PHOTO = 'SEND_PHOTO';
export const BACK_OCR = 'BACK_OCR';

export const addPhoto = (data) => ({ type: ADD_PHOTO, data });
export const removePhoto = (data) => ({ type: REMOVE_PHOTO, data });
export const sendPhoto = (data) => ({ type: SEND_PHOTO, data });
export const backOcr = (data) => ({ type: BACK_OCR, data });
