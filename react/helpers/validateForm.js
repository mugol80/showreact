/* eslint max-len: ["error", { "ignoreRegExpLiterals": true }] */

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function getPartnerId() {
    const url = window.location.search;
    if (url === '') {
        return false;
    }
    const queryStringRegex = /[?&]([\w%]+)=?([^&#]*)/g;
    const vars = [];

    url.replace(queryStringRegex, (ignore, name, value) => {
        const newName = decodeURIComponent(name);
        vars[newName] = decodeURIComponent(value);
    });


    if (typeof vars.partner_id === 'undefined') {
        return false;
    }

    vars.partner_id = vars.partner_id.replace(/\//g, '');
    vars.partner_id = parseInt(vars.partner_id, 10);

    if (Number.isNaN(vars.partner_id)) {
        return false;
    }

    return vars.partner_id;
}

export function getUrlParamId(param) {
    const url = window.location.search;
    if (url === '') {
        return false;
    }
    const queryStringRegex = /[?&]([\w%]+)=?([^&#]*)/g;
    const vars = [];

    url.replace(queryStringRegex, (ignore, name, value) => {
        const newName = decodeURIComponent(name);
        vars[newName] = decodeURIComponent(value);
    });


    if (typeof vars[param] === 'undefined') {
        return false;
    }

    vars[param] = vars[param].replace(/\//g, '');
    vars[param] = parseInt(vars[param], 10);

    if (Number.isNaN(vars[param])) {
        return false;
    }

    return vars[param];
}
