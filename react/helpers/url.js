export function getUrlParams() {
    const url = window.location.search;
    if (url === '') {
        return false;
    }
    const queryStringRegex = /[?&]([\w%]+)=?([^&#]*)/g;
    const vars = {};

    url.replace(queryStringRegex, (ignore, name, value) => {
        const newName = decodeURIComponent(name);
        let newValue = decodeURIComponent(value).replace(/\//g, '');
        if (/^-?\d+$/.test(newValue)) { newValue = Number(newValue); }
        if (newValue === 'true') { newValue = true; }
        if (newValue === 'false') { newValue = false; }
        vars[newName] = newValue;
    });
    return vars;
}

export function rmUrlParams(paramsToRemove = {}, paramsToSkip = []) {
    const url = window.location;
    const allParams = getUrlParams();
    const outputParams = {};
    let newUrl = '/';
    Object.entries(allParams).forEach((param) => {
        if (Object.prototype.hasOwnProperty.call(allParams, param[0])
            && (
                !Object.prototype.hasOwnProperty.call(paramsToRemove, param[0])
                || paramsToSkip.indexOf(param[0]) !== -1
            )
        ) {
            // eslint-disable-next-line prefer-destructuring
            outputParams[param[0]] = param[1];
        }
    });
    newUrl += '?';
    Object.entries(outputParams).forEach((param) => {
        if (Object.prototype.hasOwnProperty.call(outputParams, param[0])) {
            newUrl += `${param[0]}=${param[1]}&`;
        }
    });
    newUrl = newUrl.slice(0, -1) + url.hash;

    if (typeof (window.history.pushState) === 'function') {
        window.history.pushState(null, '', newUrl);
    }
}

export function getUrlParamId(param) {
    const url = window.location.search;
    if (url === '') {
        return false;
    }
    const queryStringRegex = /[?&]([\w%]+)=?([^&#]*)/g;
    const vars = [];

    url.replace(queryStringRegex, (ignore, name, value) => {
        vars[decodeURIComponent(name)] = decodeURIComponent(value);
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
