/* eslint-disable no-console */
/* eslint-disable consistent-return */


import 'whatwg-fetch';
import { openAlert } from '../store/actions/alert';

import IndexDBSales from './indexDB';

export const hFetch = async (model) => {
    try {
        const response = await fetch(`${model}?format=json&limit=0`, { credentials: 'same-origin' });
        return await response.json();
    } catch (e) {
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
        console.log(e);
    }
};

export const sendLogin = async (loginData) => {
    try {
        const formData = new FormData();
        formData.append('email', loginData.username);
        formData.append('password', loginData.password);

        const response = await fetch('users/login?format=json&', {
            credentials: 'same-origin',
            method: 'POST',

            body: formData,
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error.',
        });
    }
};


export const getPartnersListJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('partner_id', sendData.data.parent_id);

        const response = await fetch('users/partners?format=json', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};


export const sendRegisterData = async (registerData) => {
    try {
        const formData = new FormData();
        formData.append('parent_id', registerData.data.parent_id);
        formData.append('password', registerData.data.password);
        formData.append('email', registerData.data.email);
        formData.append('name', registerData.data.name);

        const response = await fetch('users/register?format=json&', {
            credentials: 'same-origin',
            method: 'POST',

            body: formData,
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
    }
};


export const sendResetPassword = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('email', sendData.data.username);

        const response = await fetch('users/password?format=json', {
            credentials: 'same-origin',
            method: 'POST',

            body: formData,
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};


export const sendlogOutUser = async () => {
    try {
        const response = await fetch('users/logout?format=json', {
            credentials: 'same-origin',
            method: 'POST',
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};

export const sendNewLeadJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('contact', sendData.data.contact);
        formData.append('name', sendData.data.name);
        formData.append('phone', sendData.data.phone);
        formData.append('email', sendData.data.email);
        formData.append('street', sendData.data.street);
        formData.append('city', sendData.data.city);
        formData.append('zip', sendData.data.zip);
        formData.append('country_id', sendData.data.country_id);
        formData.append('description', sendData.data.description);
        formData.append('company_type', sendData.data.company_type);
        formData.append('gn_partner_internal_reference', sendData.data.internalreference);

        formData.append('gn_mod_pos', sendData.data.gn_mod_pos ? 1 : '');
        formData.append('gn_mod_loyalty', sendData.data.gn_mod_loyalty ? 1 : '');
        formData.append('gn_mod_cashbook', sendData.data.gn_mod_cashbook ? 1 : '');
        formData.append('gn_mod_order', sendData.data.gn_mod_order ? 1 : '');
        formData.append('gn_mod_purchase', sendData.data.gn_mod_purchase ? 1 : '');
        formData.append('gn_mod_calculation', sendData.data.gn_mod_calculation ? 1 : '');
        formData.append('gn_mod_reservation', sendData.data.gn_mod_reservation ? 1 : '');
        formData.append('gn_mod_menu', sendData.data.gn_mod_menu ? 1 : '');
        formData.append('gn_mod_marketing', sendData.data.gn_mod_marketing ? 1 : '');
        formData.append('gn_mod_homepage', sendData.data.gn_mod_homepage ? 1 : '');
        formData.append('gn_mod_newsletter', sendData.data.gn_mod_newsletter ? 1 : '');
        formData.append('gn_mod_presentation', sendData.data.gn_mod_presentation ? 1 : '');
        formData.append('gn_mod_stock', sendData.data.gn_mod_stock ? 1 : '');
        formData.append('gn_mod_timetracking', sendData.data.gn_mod_timetracking ? 1 : '');
        formData.append('gn_mod_franchise', sendData.data.gn_mod_franchise ? 1 : '');
        formData.append('gn_mod_campaign', sendData.data.gn_mod_campaign ? 1 : '');

        formData.append('medium_id', sendData.data.medium_id ? sendData.data.medium_id : '');
        formData.append('source_id', sendData.data.source_id ? sendData.data.source_id : '');
        formData.append('campaign_id', sendData.data.campaign_id ? sendData.data.campaign_id : '');

        formData.append('ocrPhotos', JSON.stringify(sendData.data.ocrPhotosArray));
        formData.append('gn_temp_data_json', JSON.stringify(sendData.data.gn_temp_data_json));

        const response = await fetch('leads/insert?format=json', {
            credentials: 'same-origin',
            method: 'POST',

            body: formData,
        });

        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (e) {
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
    }
};


export const gridFetch = (params) => {
    // Build the full request URL:
    let firstGetParam = true; // To know whether to use ? or &
    let limit = 0;
    let offset;
    let { url } = params.urlConfig;

    // Add additional Params to the url
    params.urlConfig.additionalParams.forEach((param) => {
        url += firstGetParam ? '?' : '&'; // Add "?" if first param, "&" if not
        url += `${param.key}=${param.value}`;
        firstGetParam = false;
    });

    // Adding the offset for pagination
    if (params.page) {
        offset = params.page * params.rowsPerPage;
        url += `&offset=${offset}`;
    }

    // Adding the rowsParPage for pagination
    if (params.rowsPerPage) {
        limit = params.rowsPerPage;
        url += `&limit=${limit}`;
    }

    // Adding the sorting
    if (params.sorting) {
        url += `&sort=${JSON.stringify(params.sorting)}`;
    }

    // Adding the filtering
    if (params.filter) {
        url += `&search=${params.filter}`;
    }

    // Finally send the request
    return fetch(url, { credentials: 'same-origin' }).then((response) => response.json()).catch((error) => {
        throw (error);
    });
};

/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */
export const gridUpdate = async (params) => {
    let firstGetParam = true;
    let { url } = params.urlConfig;

    // Add additional Params to the url
    params.urlConfig.additionalParams.forEach((param) => {
        url += firstGetParam ? '?' : '&'; // Add "?" if first param, "&" if not
        url += `${param.key}=${param.value}`;
        firstGetParam = false;
    });

    try {
        // Make the data form-urlencoded
        // https://github.com/github/fetch/issues/263
        const searchParams = Object.keys(params.data).map((key) => (
            `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(params.data[key]))}`
        )).join('&');

        const response = await fetch(
            url,
            {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: searchParams,
            },
        );
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Error on updating data.',
        });
    }
};


export const saveUserDataJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('currentpassword', sendData.data.currentPassword);
        formData.append('name', sendData.data.name);
        formData.append('email', sendData.data.email);

        const response = await fetch('users/edit?format=json', {
            credentials: 'same-origin',
            method: 'POST',

            body: formData,
        });
        return await response.json();
    } catch (e) {
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
    }
};

export const saveUserPasswordJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('currentpassword', sendData.data.currentPassword);
        formData.append('password', sendData.data.password);

        const response = await fetch('users/edit?format=json', {
            credentials: 'same-origin',
            method: 'POST',

            body: formData,
        });
        return await response.json();
    } catch (e) {
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
    }
};


export const getLeadsFieldsJSON = async () => {
    try {
        const response = await fetch('leads/fields?format=json', {
            credentials: 'same-origin',
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};

export const getCountriesListJSON = async () => {
    try {
        const response = await fetch('leads/countries?format=json', {
            credentials: 'same-origin',
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};

export const getListContentsJSON = async () => {
    try {
        const response = await fetch('contents/index?format=json', {
            credentials: 'same-origin',
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};


export const sendPhotoJSON = async (sendData) => {
    try {
        const img = sendData.imageSrc.split(',');

        const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${window.googleApiKey}`, {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: [
                    {
                        image: {
                            content: img[1],
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                            },
                        ],
                    },
                ],
            }),
        });

        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};


export const addressGeocodingJSON = async (sendData) => {
    try {
        const address = encodeURIComponent(sendData.address);
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${window.googleApiKey}`, {});

        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};

export const checkPartnerIdKeyJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('partner_id', sendData.data.partnerId);

        const response = await fetch('users/checkpartner?format=json', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};

export const getListFairsJSON = async () => {
    try {
        const formData = new FormData();

        const response = await fetch('leads/getlistfairs?format=json', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error',
        });
    }
};

export const saveMarkersJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('gn_temp_data_json', JSON.stringify(sendData.data.gn_temp_data_json));
        formData.append('source_id', sendData.data.id);

        const response = await fetch('leads/edit?format=json', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (e) {
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
    }
};


export const saveFairJSON = async (sendData) => {
    try {
        const formData = new FormData();
        formData.append('save_settings', true);
        formData.append('gn_sales_default_campaign', JSON.stringify(sendData.gn_sales_default_campaign));

        const response = await fetch('users/edit?format=json', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (e) {
        console.log({
            msg: e.toString(),
            title: 'Error on fetching data.',
        });
    }
};

export const getStoredLeadsDB = async () => {
    try {
        const indexDB = new IndexDBSales();
        const data = indexDB.getFromObjectStore('leads');

        return await data;
    } catch (e) {
        openAlert({
            msg: e.toString(),
            title: 'Connecting error',
        });
        console.log({
            msg: e.toString(),
            title: 'Connecting error.',
        });
    }
};
