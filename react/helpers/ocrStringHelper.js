export function isUppercase(str) {
    return str.valueOf().toUpperCase() === str.valueOf();
}

export function ucFirstAllWords(str) {
    const pieces = str.split(' ');
    for (let i = 0; i < pieces.length; i++) {
        if (isUppercase(pieces[i])) {
            const j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1).toLowerCase();
        }
    }
    return pieces.join(' ');
}

export function isCompany(text) {
    const toFind = ['gmbh', 'gbr', 'ag'];
    return toFind.some((el) => {
        const regex = new RegExp(`[^\\w][\\s]?${el}[\\s]?`, 'gi');
        if (text.toLowerCase().match(regex)) {
            return true;
        }
        return false;
    });
}

export function isAdress(text) {
    const toFind = ['str.', 'straße', 'strasse', 'weg', 'platz', 'allee'];
    return toFind.some((el) => {
        if (text.toLowerCase().indexOf(el) !== -1) {
            return true;
        }
        return false;
    });
}

export function isCityAndZip(text) {
    const regex = new RegExp('[a-z]?\\-?[0-9]{4,5}\\s+[a-z]+[\\-\\s]?[a-z\\x7f-\\xff]{5,}', 'gi');
    if (text.toLowerCase().match(regex)) {
        return true;
    }
    return false;
}

export function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

export function extractNum(text) {
    const newText = text.replace(/[a-z.:]/gi, '');
    return newText.replace(/^\D+/g, '');
}

export function extractString(text) {
    return text.replace(/^\w+/g, '');
}

export function extractCityName(text) {
    let newText = text;
    const find = text.match(/([a-z\x7f-\xff]{4,})/gi);
    if (find) {
        newText = find[0].trim();
    }
    return newText;
}

export function extractZipCode(text) {
    let newText = text;
    const find = text.match(/(\D{4,})/gi);
    if (find) {
        newText = text.replace(find[0], '').trim();
    }
    return newText;
}

export function isPhoneNumber(text, toFind) {
    const newText = text.replace(/00+/i, '+');
    return toFind.some((el) => {
        if (newText.toLowerCase().indexOf(el) !== -1) {
            return true;
        }
        return false;
    });
}

export function extractPhoneNumber(text, toFind) {
    let newText = text;
    const phone = {
        prefix: false,
        number: false,
    };
    newText = newText.replace(/[a-z.:]/gi, '');
    newText = newText.replace(/\(0\)/gi, '');
    newText = newText.replace(/[^0-9\s+-]/gi, '').trim();
    newText = newText.replace(/^00/gi, '+');
    newText = newText.replace(/\s\s+/g, ' ');

    toFind.some((el) => {
        const index = newText.indexOf(el);
        if (index !== -1) {
            const prefix = newText.substr(index, el.length);
            const number = newText.substr(prefix.length, newText.length).trim();

            phone.prefix = prefix;
            phone.number = number;
            return true;
        }
        return false;
    });

    return phone;
}
