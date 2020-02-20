import { combineReducers } from 'redux';
import users from './users';
import loginPage from './loginPage';
import backMessages from './backMessages';
import dashboard from './dashboard';
import newLead from './newLead';
import grid from './grid';
import alert from './alert';
import contents from './contents';
import ocr from './ocr';
import settings from './settings';
import leadOnMap from './leadOnMap';
import appStatus from './appStatus';
import storedLeads from './storedLeads';


export const rootReducer = combineReducers({
    users,
    loginPage,
    backMessages,
    dashboard,
    newLead,
    grid,
    alert,
    contents,
    ocr,
    settings,
    leadOnMap,
    appStatus,
    storedLeads,
});

export default rootReducer;
