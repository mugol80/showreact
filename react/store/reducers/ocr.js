import { cloneDeep } from 'lodash';


import {
    BACK_OCR,
    ADD_PHOTO,
    REMOVE_PHOTO,
} from '../actions/ocr';

const initialState = {
    photos: [],
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case ADD_PHOTO: {
            const photosArr = cloneDeep(state.photos);
            photosArr.push({
                id: data.id, image: data.img, loading: true, ocrInfo: '',
            });
            return {
                ...state,
                photos: photosArr,
            };
        }
        case REMOVE_PHOTO: {
            const photosArrRemove = cloneDeep(state.photos);
            photosArrRemove.splice(data.idx, 1);
            return {
                ...state,
                photos: photosArrRemove,
            };
        }
        case BACK_OCR: {
            const photosArrOcrInfo = cloneDeep(state.photos);
            for (let i = 0; i < photosArrOcrInfo.length; i++) {
                if (photosArrOcrInfo[i].id === data.id) {
                    photosArrOcrInfo[i].loading = false;
                    photosArrOcrInfo[i].ocrInfo = data.data;
                }
            }
            return {
                ...state,
                photos: photosArrOcrInfo,
            };
        }
        default:
            return state;
    }
};
