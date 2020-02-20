export const SAVE_LEAD = 'SAVE_LEAD';
export const SAVE_LEAD_BACK = 'SAVE_LEAD_BACK';

export const saveLead = (data) => ({ type: SAVE_LEAD, data });
export const saveLeadBack = (data) => ({ type: SAVE_LEAD_BACK, data });
