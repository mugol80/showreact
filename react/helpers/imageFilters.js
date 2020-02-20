/* eslint-disable no-multi-assign */
/* eslint-disable no-mixed-operators */

/**
 * Adjust brightness
 *
 * @param {object} image      imgData
 * @param {array}  image.data pixels
 * @param {number} adjustment
 * @returns {object} imgData
 */
export function brightness(image, adjustment) {
    const d = image.data;
    for (let i = 0; i < d.length; i += 4) {
        d[i] += adjustment;
        d[i + 1] += adjustment;
        d[i + 2] += adjustment;
    }
    return image;
}

/**
 * Adjust grayscale
 *
 * @param {object} image      imgData
 * @param {array}  image.data image
 * @returns {object} imgData
 */
export function grayscale(image) {
    const d = image.data;
    for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v;
    }
    return image;
}

/**
 * Adjust contrast
 *
 * @param {object} image      imageData
 * @param {array}  image.data pixels
 * @param {number} contrast     input range [-100..100]
 * @returns {object} image
 */
export function contrastImage(image, contrast) {
    const d = image.data;
    const contrastNormalized = (contrast / 100) + 1; // convert to decimal & shift range: [0..2]
    const intercept = 128 * (1 - contrastNormalized);
    for (let i = 0; i < d.length; i += 4) { // r,g,b,a
        d[i] = d[i] * contrastNormalized + intercept;
        d[i + 1] = d[i + 1] * contrastNormalized + intercept;
        d[i + 2] = d[i + 2] * contrastNormalized + intercept;
    }
    return image;
}
