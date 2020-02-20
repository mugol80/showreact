export const SEND_NEW_LEAD = 'SEND_NEW_LEAD';
export const SECTION_NEW_LEAD = 'SECTION_NEW_LEAD';
export const LEADS_FIELDS_NEW_LEAD = 'LEADS_FIELDS_NEW_LEAD';
export const GET_LEADS_FIELDS_NEW_LEAD = 'GET_LEADS_FIELDS_NEW_LEAD';
export const GET_COUNTRIES_LIST = 'GET_COUNTRIES_LIST';
export const COUNTRIES_LIST = 'COUNTRIES_LIST';

export const sendNewLead = (data) => ({ type: SEND_NEW_LEAD, data });
export const sectionNewLead = (data) => ({ type: SECTION_NEW_LEAD, data });
export const leadsFieldsNewLead = (data) => ({ type: LEADS_FIELDS_NEW_LEAD, data });
export const getLeadsFieldsNewLead = (data) => ({ type: GET_LEADS_FIELDS_NEW_LEAD, data });
export const getCountriesList = (data) => ({ type: GET_COUNTRIES_LIST, data });
export const countriesList = (data) => ({ type: COUNTRIES_LIST, data });
