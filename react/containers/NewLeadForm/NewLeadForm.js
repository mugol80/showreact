/* we use var names from odoo */
/* eslint camelcase: [0] */
/* eslint-disable react/no-danger */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Icon,
    InputLabel,
    LinearProgress,
    Menu,
    MenuItem,
    Select,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';

import { debounce } from 'throttle-debounce';

import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

import DebouncedTextfield from '../../components/DebouncedTextfield/DebouncedTextfield';
// ACTIONS
import {
    getCountriesList as getCountriesListAction,
    getLeadsFieldsNewLead as getLeadsFieldsNewLeadAction,
    sectionNewLead as sectionNewLeadAction,
    sendNewLead as sendNewLeadAction,
} from '../../store/actions/newLead';
import {
    backMessages as backMessagesAction,
    clearMessages as clearMessagesAction,
} from '../../store/actions/backMessages';
import { showProgressBar as showProgressBarAction } from '../../store/actions/dashboard';
import { requestCurrentUser as requestCurrentUserAction } from '../../store/actions/users';
// HELPERS
import {
    getUrlParamId,
    validateEmail,
} from '../../helpers/validateForm';
import {
    getUrlParams,
    rmUrlParams,
} from '../../helpers/url';
import {
    extractCityName,
    extractEmails,
    extractNum,
    extractPhoneNumber,
    extractZipCode,
    isAdress,
    isCityAndZip,
    isCompany,
    isPhoneNumber,
    ucFirstAllWords,
} from '../../helpers/ocrStringHelper';
// CSS
import s from './NewLeadForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';


class NewLeadForm extends React.Component {
    debouncedAddressOnMap = debounce(1000, this.setAddressOnMap);

    campaignPositionElRef = null;

    nameElRef = null;

    contactElRef = null;

    emailElRef = null;

    phoneElRef = null;

    streetElRef = null;

    cityElRef = null;

    zipElRef = null;

    constructor(props) {
        super(props);

        this.state = {
            sendIfLogIn: false,

            name: '',
            contact: '',
            prefix: '',
            prefix_acceptable: ['+33', '+41', '+43', '+49'],
            phone: '',
            email: '',
            emailErrorMsg: '',
            street: '',
            city: '',
            zip: '',
            country_id: '',
            description: '',
            descriptionRequired: false,
            company_type: '',
            internalreference: '',

            gn_mod_pos: false,
            gn_mod_loyalty: false,
            gn_mod_cashbook: false,
            gn_mod_order: false,
            gn_mod_purchase: false,
            gn_mod_calculation: false,
            gn_mod_reservation: false,
            gn_mod_menu: false,
            gn_mod_marketing: false,
            gn_mod_homepage: false,
            gn_mod_newsletter: false,
            gn_mod_presentation: false,
            gn_mod_stock: false,
            gn_mod_timetracking: false,
            gn_mod_franchise: false,
            gn_mod_campaign: false,

            gn_mod_pos_disabled: false,
            gn_mod_loyalty_disabled: false,
            gn_mod_cashbook_disabled: false,
            gn_mod_order_disabled: false,
            gn_mod_purchase_disabled: false,
            gn_mod_calculation_disabled: false,
            gn_mod_reservation_disabled: false,
            gn_mod_menu_disabled: false,
            gn_mod_marketing_disabled: false,
            gn_mod_homepage_disabled: false,
            gn_mod_newsletter_disabled: false,
            gn_mod_presentation_disabled: false,
            gn_mod_stock_disabled: false,
            gn_mod_timetracking_disabled: false,
            gn_mod_franchise_disabled: false,
            gn_mod_campaign_disabled: false,

            medium_id: false,

            campaign_position: '',
            campaign_numberofbranches: '',
            campaign_starttermin: '',

            campaign_terminals: '',
            campaign_terminals_number: '',
            campaign_tablets: '',
            campaign_tablets_number: '',
            campaign_mobiles: '',
            campaign_mobiles_number: '',
            campaign_drucker: '',
            campaign_drucker_number: '',
            campaign_equipment: '',
            campaign_equipment_number: '',


            campaign_network: 0,
            campaign_integration: 0,
            campaign_integration_txt: '',

            campaign_call: '',
            campaign_call_checked: false,
            campaign_call_termin: '',
            campaign_information: '',
            campaign_information_checked: false,
            campaign_information_termin: '',
            campaign_offer: '',
            campaign_offer_checked: false,
            campaign_offer_termin: '',
            campaign_termin: '',
            campaign_termin_checked: false,
            campaign_termin_termin: '',
            campaign_installation: '',
            campaign_installation_checked: false,
            campaign_installation_termin: '',
            campaign_consulting: '',
            campaign_consulting_checked: false,
            campaign_consulting_termin: '',
            campaign_training: '',
            campaign_training_checked: false,
            campaign_training_termin: '',
            campaign_miscellaneous: '',
            campaign_miscellaneous_checked: false,
            campaign_miscellaneous_txt: '',

            campaign_trial: 0,
            campaign_email: '',

            preValue: {},

            ocrArray: [],

            ocrAnchorEl: null,
            ocrInputEl: null,

            autocompleteAddress: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.emailTest = this.emailTest.bind(this);
    }


    componentDidMount() {
        const {
            clearMessages,
            getCountriesList,
            getLeadsFieldsNewLead,
        } = this.props;

        clearMessages();
        getLeadsFieldsNewLead();
        getCountriesList();
        this.setCountryId();
        this.setPrefix();
        this.setMediumId();
        this.getUrlParamets();
    }

    static getDerivedStateFromProps(props, state) {
        const {
            user,
            ocr,
            countriesList,
            leadsFields,
        } = props;
        const {
            country_id,
            company_type,
            ocrArray,
        } = state;

        const newState = {};

        // store ocr values again in a filtered representation in state
        if (ocr.length > 0) {
            const newOcrArray = ocr.map((value) => {
                if (value.length <= 2) return null;
                return ucFirstAllWords(value).trim();
            }).filter((value) => value);

            if (ocrArray.toString() !== newOcrArray.toString()) {
                newState.ocrArray = newOcrArray;
            }
        }

        // store country_id in a unified way inside the state if they come from url
        // we need to set this again after we received the country list from server
        // using the select-input-field should already update the correct state without this code
        // test this by calling for example: https://sales.dev.le/?country_id=FR
        if (typeof countriesList.LeadCountry !== 'undefined') {
            const foundListElementOfCurrentState = countriesList.LeadCountry.find(
                (el) => {
                    if (
                        Object.prototype.hasOwnProperty.call(el, 'code')
                        && String(el.code).toLowerCase() === String(country_id).toLowerCase() // try to match code too
                    ) {
                        return true;
                    }
                    return el.id === country_id;
                },
            );

            const newCountryId = foundListElementOfCurrentState
                ? foundListElementOfCurrentState.id
                : user.country_id[0];

            if (country_id !== newCountryId) {
                newState.country_id = newCountryId;
            }
        }

        // store company_type in a unified way inside the state if they come from url
        // we need to set this again after we received the company_type list from server
        // using the select-input-field should already update the correct state without this code
        // test this by calling for example: https://sales.dev.le/?company_type=Hotel
        if (typeof leadsFields.LeadField !== 'undefined') {
            const foundListElementOfCurrentState = leadsFields.LeadField.gn_company_type.selection.find(
                (el) => el.some(
                    (type) => String(type).toLowerCase() === String(company_type).toLowerCase(),
                ),
            );

            const newCompanyType = foundListElementOfCurrentState
                ? foundListElementOfCurrentState[0]
                : '';

            if (company_type !== newCompanyType) {
                newState.company_type = newCompanyType;
            }
        }

        if (Object.keys(newState).length === 0) {
            return null;
        }

        return newState;
    }


    componentDidUpdate(prevProps) {
        const {
            user,
            ocr,
        } = this.props;
        const {
            sendIfLogIn,
        } = this.state;

        if (user != null && sendIfLogIn) {
            this.submitForm();
        }

        if (ocr.length > 0 && prevProps.ocr.toString() !== ocr.toString()) {
            this.setFormValueFromOcr();
        }
    }

    componentWillUnmount() {
        const {
            removeAllPhotos,
            resetgoogleMapsSetting,
        } = this.props;

        removeAllPhotos();
        resetgoogleMapsSetting();
    }

    setFormValueFromOcr() {
        const {
            ocrArray,
            street,
            zip,
            name,
            email,
            prefix_acceptable,
            city,
            prefix,
            phone,
        } = this.state;
        let companyState = false; // update state is slower then function
        let phoneState = false; // update state is slower then function

        for (let i = 0; i < ocrArray.length; i++) {
            const matchedEmails = extractEmails(ocrArray[i]);
            if (matchedEmails) {
                if (email === '' && email !== matchedEmails[0]) {
                    this.setState({
                        email: matchedEmails[0],
                    });
                }
            }

            if (isCompany(ocrArray[i]) && !companyState) {
                companyState = true;
                if (name === '') {
                    this.setState({
                        name: ocrArray[i],
                    });
                }
            }

            if (isAdress(ocrArray[i])) {
                if (street === '') {
                    this.setState({
                        street: ocrArray[i],
                    }, () => {
                        this.debouncedAddressOnMap('street');
                    });
                }
            }

            if (isCityAndZip(ocrArray[i])) {
                if (city === '') {
                    this.setState({
                        city: extractCityName(ocrArray[i]),
                    }, () => {
                        this.debouncedAddressOnMap('city');
                    });
                }
                if (zip === '') {
                    this.setState({
                        zip: extractZipCode(ocrArray[i]),
                    }, () => {
                        this.debouncedAddressOnMap('zip');
                    });
                }
            }

            if (isPhoneNumber(ocrArray[i], prefix_acceptable) && !phoneState) {
                phoneState = true;
                const extractPhone = extractPhoneNumber(ocrArray[i], prefix_acceptable);
                if (phone.prefix
                    && extractPhone.prefix !== ''
                    && prefix !== ''
                ) {
                    if (prefix_acceptable.includes(extractPhone.prefix)) {
                        this.setState({
                            prefix: extractPhone.prefix,
                        });
                    }
                }
                if (extractPhone.number
                    && extractPhone.number !== ''
                    && phone !== ''
                ) {
                    this.setState({
                        phone: extractPhone.number,
                    });
                }
            }
        }
    }

    getUrlParamets() {
        const { prefix_acceptable } = this.state;
        const varsSkip = ['emailErrorMsg', 'descriptionRequired', 'source_id', 'campaign_id'];
        const preValue = {};
        const vars = getUrlParams();
        Object.entries(vars)
            .forEach((field) => {
                if (Object.prototype.hasOwnProperty.call(this.state, field[0])
                    && !varsSkip.includes(field[0])
                    && Object.prototype.hasOwnProperty.call(vars, field[0])) {
                    if (field[0].startsWith('prefix')) {
                        if (prefix_acceptable.includes(vars[field[0]])) {
                            preValue[field[0]] = field[1];
                        }
                    } else {
                        preValue[field[0]] = field[1];
                    }
                }
            });
        this.state.preValue = preValue;
        this.setFormByUrlParamets();
    }

    setFormByUrlParamets() {
        const { preValue } = this.state;
        Object.entries(preValue)
            .forEach((field) => {
                if (Object.prototype.hasOwnProperty.call(this.state, field[0])) {
                    const valueTest = this.state[field[0]].toString();
                    let val = preValue[field[0]];
                    if (valueTest === 'true' || valueTest === 'false') {
                        if (val === 0) {
                            val = false;
                        }
                        if (val === 1) {
                            val = true;
                        }
                    }
                    this.setState({
                        [field[0]]: val,
                    });
                    if (field[0].startsWith('gn_mod')) {
                        if (field === 'gn_mod_campaign') {
                            this.setState({
                                descriptionRequired: val,
                            });
                        }
                        if (val) {
                            this.moduleDependencies(field[0], val);
                        }
                    }
                }

                const varsSkip = ['medium_id', 'source_id', 'campaign_id', 'partner_id'];
                rmUrlParams(preValue, varsSkip);
            });
    }

    setCountryId() {
        const { user } = this.props;
        this.setState({
            country_id: user.country_id[0],
        });
    }

    setPrefix() {
        const { user } = this.props;

        if (user.country_id[0] === 76) {
            this.setState({
                prefix: '+33',
            });
        }

        if (user.country_id[0] === 13) {
            this.setState({
                prefix: '+43',
            });
        }

        if (user.country_id[0] === 44) {
            this.setState({
                prefix: '+41',
            });
        }

        if (user.country_id[0] === 58) {
            this.setState({
                prefix: '+49',
            });
        }
    }

    setMediumId() {
        this.setState({
            medium_id: getUrlParamId('medium_id'),
        });
    }

    setAddressOnMap(name) {
        const {
            countriesList,
            setAddress,
        } = this.props;
        const {
            street,
            zip,
            city,
            country_id,
        } = this.state;
        const addressInputs = ['street', 'city', 'zip', 'country_id'];
        if (addressInputs.includes(name)) {
            if (street
                && zip
                && city
                && country_id !== ''
                && countriesList.LeadCountry) {
                const countryName = countriesList.LeadCountry.find((element) => {
                    if (element.id === country_id) {
                        return element;
                    }
                    return false;
                });

                const address = `${street}, ${zip} ${city}, ${countryName.name}`;
                setAddress(address);
            } else {
                const { resetgoogleMapsSetting } = this.props;
                resetgoogleMapsSetting();
            }
        }
    }

    handleCheckboxChange = (name) => (event) => {
        this.setState({ [name]: event.target.checked });

        if (name === 'gn_mod_campaign') {
            this.setState({ descriptionRequired: event.target.checked });
        }

        this.moduleDependencies(name, event.target.checked);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            requestCurrentUser,
            appStatus,
        } = this.props;
        if (appStatus.isOnLine) {
            this.setState({
                sendIfLogIn: true,
            });
            requestCurrentUser();
        } else {
            this.submitForm();
        }
        return false;
    };

    autocompleteSetAddress = (address, step) => {
        if (!address || step >= address.address_components.length) {
            return false;
        }
        const { countriesList } = this.props;
        const { street } = this.state;
        const element = address.address_components[step];

        if (element.types.includes('street_number')) {
            const streetTxt = `${street} ${element.long_name}`.trim();
            this.setState({ street: streetTxt }, () => {
                this.setAddressOnMap('street');
                this.autocompleteSetAddress(address, step + 1);
            });
        } else if (element.types.includes('route')) {
            const streetTxt = `${element.long_name} ${street}`.trim();
            this.setState({ street: streetTxt }, () => {
                this.setAddressOnMap('street');
                this.autocompleteSetAddress(address, step + 1);
            });
        } else if (element.types.includes('locality')) {
            const city = `${element.long_name}`.trim();
            this.setState({ city }, () => {
                this.setAddressOnMap('city');
                this.autocompleteSetAddress(address, step + 1);
            });
        } else if (element.types.includes('postal_code')) {
            const zip = `${element.long_name}`.trim();
            this.setState({ zip }, () => {
                this.setAddressOnMap('zip');
                this.autocompleteSetAddress(address, step + 1);
            });
        } else if (element.types.includes('country')) {
            const country = countriesList.LeadCountry.find((con) => {
                if (con.name === element.long_name) {
                    return element;
                }
                return false;
            });
            if (country) {
                this.setState({ country_id: country.id }, () => {
                    this.setAddressOnMap('country_id');
                    this.autocompleteSetAddress(address, step + 1);
                });
            }
        } else {
            this.autocompleteSetAddress(address, step + 1);
        }
        return false;
    };

    autocompleteHandleChange = (autocompleteAddress) => {
        this.setState({ autocompleteAddress });
    };

    autocompleteHandleSelect = (autocompleteAddress) => {
        this.setState({ autocompleteAddress });
        geocodeByAddress(autocompleteAddress)
            .then((results) => {
                this.setState({ street: '' }, () => {
                    this.autocompleteSetAddress(results[0], 0);
                });
            });
    };

    ocrHelpHandleClose = () => {
        this.setState({
            ocrAnchorEl: null,
            ocrInputEl: null,
        });
    };

    ocrPutText = (inputText) => {
        const {
            ocrInputEl,
            prefix_acceptable,
        } = this.state;
        const el = ocrInputEl;
        let text = inputText;
        let replaceFull = false;
        if (el != null) {
            let newText = this.state[el.name];
            if (el.name === 'email') {
                text = extractEmails(text) ? extractEmails(text) : text;
            }

            if (el.name === 'phone') {
                replaceFull = true;
                const phone = extractPhoneNumber(text, prefix_acceptable);
                if (phone.prefix) {
                    if (prefix_acceptable.includes(phone.prefix)) {
                        this.setState({
                            prefix: phone.prefix,
                        });
                    }
                }
                if (phone.number) {
                    text = extractNum(phone.number);
                } else {
                    text = extractNum(text);
                }
            }

            if (el.name === 'city') {
                text = extractCityName(text);
            }
            if (el.name === 'zip') {
                text = extractZipCode(text);
            }

            if (!replaceFull) {
                newText = `${newText.slice(0, el.selectionStart)} ${text} ${newText.slice(el.selectionEnd)}`;
            } else {
                newText = text;
            }

            this.setState({
                [el.name]: newText.trim(),
            }, () => {
                this.setAddressOnMap(el.name);
            });
        }
        this.ocrHelpHandleClose();
    };

    ocrHelpHandleOpen = (event, ref) => {
        this.setState({
            ocrAnchorEl: event.currentTarget,
            ocrInputEl: ref,
        });
    };

    submitForm() {
        const {
            settings,
            ocrPhotos,
            showProgressBar,
            sendNewLead,
            googleMapsSetting,
            appStatus,
            backMessagesAction,
            sectionNewLead,
        } = this.props;

        const {
            gn_mod_loyalty_disabled,
            campaign_installation_termin,
            gn_mod_reservation,
            gn_mod_reservation_disabled,
            gn_mod_newsletter,
            street,
            zip,
            campaign_miscellaneous_checked,
            campaign_offer_termin,
            country_id,
            campaign_information_checked,
            campaign_terminals_number,
            campaign_email,
            campaign_position,
            gn_mod_franchise_disabled,
            gn_mod_campaign,
            campaign_mobiles_number,
            campaign_integration,
            campaign_training_checked,
            campaign_terminals,
            city, gn_mod_cashbook,
            campaign_integration_txt,
            gn_mod_purchase_disabled,
            campaign_equipment,
            gn_mod_cashbook_disabled,
            gn_mod_campaign_disabled,
            gn_mod_pos_disabled,
            gn_mod_marketing,
            gn_mod_purchase,
            campaign_mobiles,
            campaign_network,
            campaign_information_termin,
            gn_mod_stock,
            name,
            campaign_starttermin,
            internalreference,
            campaign_offer_checked,
            campaign_consulting_checked,
            contact, gn_mod_homepage,
            gn_mod_presentation_disabled,
            gn_mod_marketing_disabled,
            campaign_training_termin,
            campaign_call_termin,
            gn_mod_newsletter_disabled,
            gn_mod_menu_disabled,
            gn_mod_loyalty,
            campaign_tablets_number,
            campaign_termin_termin,
            gn_mod_stock_disabled,
            gn_mod_franchise,
            campaign_numberofbranches,
            campaign_drucker_number,
            campaign_miscellaneous_txt,
            gn_mod_timetracking_disabled,
            phone,
            campaign_equipment_number,
            gn_mod_menu,
            campaign_call_checked,
            gn_mod_timetracking,
            gn_mod_order_disabled,
            prefix, campaign_drucker,
            gn_mod_calculation,
            email,
            gn_mod_order,
            medium_id,
            gn_mod_calculation_disabled,
            campaign_tablets,
            campaign_installation_checked,
            company_type,
            campaign_trial,
            gn_mod_pos,
            campaign_termin_checked,
            campaign_consulting_termin,
            gn_mod_presentation,
            gn_mod_homepage_disabled,
        } = this.state;

        this.setState({
            sendIfLogIn: false,
        });

        if (!this.emailTest('email')) {
            return false;
        }

        if (!this.emailTest('campaign_email')) {
            return false;
        }

        let { description } = this.state;
        let campaignDescription = '';
        /* eslint-disable max-len */
        if (settings.campaign_id) {
            campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.position')}: ${campaign_position}\n`;
            campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.numberofbranches')}: ${campaign_numberofbranches}\n`;
            campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.starttermin')}: ${campaign_starttermin}\n`;
            campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.header.hardware')}\n`;
            campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.terminals')}: ${campaign_terminals_number}    - ${campaign_terminals}\n`;
            campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.tablets')}: ${campaign_tablets_number}    - ${campaign_tablets}\n`;
            campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.mobiles')}: ${campaign_mobiles_number}    - ${campaign_mobiles}\n`;
            campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.drucker')}: ${campaign_drucker_number}    - ${campaign_drucker}\n`;
            campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.equipment')}: ${campaign_equipment_number}    - ${campaign_equipment}\n`;
            if (campaign_network) {
                campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.network')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}\n`;
            } else {
                campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.network')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_integration) {
                campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.integration')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_integration_txt}\n`;
            } else {
                campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.integration')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.header.wishes')}\n`;

            if (campaign_call_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.call')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_call_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.call')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_information_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.information')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_information_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.information')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_offer_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.offer')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_offer_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.offer')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_termin_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.termin')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_termin_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.termin')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_installation_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.installation')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_installation_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.installation')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_consulting_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.consulting')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_consulting_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.consulting')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_training_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.training')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_training_termin}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.training')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_miscellaneous_checked) {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.miscellaneous')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_miscellaneous_txt}\n`;
            } else {
                campaignDescription += `    - ${E.Lang.translate('locals.newleadform.campaign.miscellaneous')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }

            if (campaign_trial) {
                campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.trial')}: ${E.Lang.translate('locals.newleadform.campaign.yes')}    - ${campaign_email}\n`;
            } else {
                campaignDescription += `- ${E.Lang.translate('locals.newleadform.campaign.trial')}: ${E.Lang.translate('locals.newleadform.campaign.no')}\n`;
            }
        }
        /* eslint-enabled max-len */

        if (campaignDescription) {
            description = description + (description.length ? '\n\n' : '') + campaignDescription;
        }

        const ocrPhotosArray = [];
        ocrPhotos.forEach((img) => {
            const ocrLines = [];
            if (Object.prototype.hasOwnProperty.call(img, 'ocrInfo')) {
                if (Object.prototype.hasOwnProperty.call(img.ocrInfo.responses[0], 'fullTextAnnotation')) {
                    let lines = img.ocrInfo.responses[0].fullTextAnnotation.text;
                    lines = lines.split(/\r?\n/);
                    for (let z = 0; z < lines.length; z++) {
                        if (lines[z] !== '') {
                            ocrLines.push(lines[z]);
                        }
                    }
                }
                const i = img.image.split(',');
                ocrPhotosArray.push({
                    photo: i[1],
                    lines: ocrLines,
                });
            }
        });

        const gn_temp_data_json = {};

        const googleMaps = {};
        googleMaps.markers = [];

        if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers') && googleMapsSetting.markers.length > 0) {
            for (let i = 0; i < googleMapsSetting.markers.length; i++) {
                const marker = {};
                marker.location = googleMapsSetting.markers[i].location;
                googleMaps.markers.push(marker);
            }
            googleMaps.zoom = googleMapsSetting.zoom;
        }

        gn_temp_data_json.googleMaps = googleMaps;

        showProgressBar({ showProgressBar: true });

        const sendData = {
            id: Math.floor(Math.random() * 1000000 + 1), // some unique key
            name,
            contact,
            email,
            phone: `${prefix} ${phone}`,
            street,
            city,
            zip,
            country_id,
            description,
            internalreference,
            company_type,

            gn_mod_pos: gn_mod_pos_disabled ? false : gn_mod_pos,
            gn_mod_loyalty: gn_mod_loyalty_disabled ? false : gn_mod_loyalty,
            gn_mod_cashbook: gn_mod_cashbook_disabled ? false : gn_mod_cashbook,
            gn_mod_order: gn_mod_order_disabled ? false : gn_mod_order,
            gn_mod_purchase: gn_mod_purchase_disabled ? false : gn_mod_purchase,
            gn_mod_calculation: gn_mod_calculation_disabled ? false : gn_mod_calculation,
            gn_mod_reservation: gn_mod_reservation_disabled ? false : gn_mod_reservation,
            gn_mod_menu: gn_mod_menu_disabled ? false : gn_mod_menu,
            gn_mod_marketing: gn_mod_marketing_disabled ? false : gn_mod_marketing,
            gn_mod_homepage: gn_mod_homepage_disabled ? false : gn_mod_homepage,
            gn_mod_newsletter: gn_mod_newsletter_disabled ? false : gn_mod_newsletter,
            gn_mod_presentation: gn_mod_presentation_disabled ? false : gn_mod_presentation,
            gn_mod_stock: gn_mod_stock_disabled ? false : gn_mod_stock,
            gn_mod_timetracking: gn_mod_timetracking_disabled ? false : gn_mod_timetracking,
            gn_mod_franchise: gn_mod_franchise_disabled ? false : gn_mod_franchise,
            gn_mod_campaign: gn_mod_campaign_disabled ? false : gn_mod_campaign,

            medium_id,
            source_id: settings.source_id,
            campaign_id: settings.campaign_id,

            ocrPhotosArray,
            gn_temp_data_json,

        };

        if (!appStatus.isOnLine && appStatus.indexDB !== false) {
            console.log('Save to datebase');
            // Save to datebase
            appStatus.indexDB.addToObjectStore('leads', sendData).then(() => {
                console.log('addToObjectStore -> OK');

                const messages = [{
                    message: 'Lead was save in indexeDB', type: 'ok', place: '', icon: 'done',
                }];
                const section = 'message';
                showProgressBar({ showProgressBar: false });
                backMessagesAction(messages);
                sectionNewLead({ section });

            }).catch(() => {
                console.log('addToObjectStore -> FALSE');
            });
            return true;
        }
        console.log('Send LEAD');
        sendNewLead(sendData);
        return true;
    }

    handleInputChange(e) {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        this.setState({
            [name]: value,
        }, () => {
            this.debouncedAddressOnMap(name);
        });
    }

    moduleDependencies(name, check) {
        switch (name) {
            case 'gn_mod_pos':
                if (!check) {
                    this.setState({
                        gn_mod_loyalty: false,
                        gn_mod_cashbook: false,
                        gn_mod_order: false,
                    });
                }
                break;
            case 'gn_mod_loyalty':
                if (check) {
                    this.setState({
                        gn_mod_pos: true,
                    });
                }
                break;
            case 'gn_mod_cashbook':
                if (check) {
                    this.setState({
                        gn_mod_pos: true,
                    });
                }
                break;
            case 'gn_mod_order':
                if (check) {
                    this.setState({
                        gn_mod_pos: true,
                    });
                }
                break;
            case 'gn_mod_marketing':
                if (check) {
                    this.setState({
                        gn_mod_menu: true,
                        gn_mod_menu_disabled: true,
                        gn_mod_homepage: true,
                        gn_mod_homepage_disabled: true,
                        gn_mod_newsletter: true,
                        gn_mod_newsletter_disabled: true,
                        gn_mod_presentation: true,
                        gn_mod_presentation_disabled: true,
                    });
                }
                if (!check) {
                    this.setState({
                        gn_mod_menu_disabled: false,
                        gn_mod_homepage_disabled: false,
                        gn_mod_newsletter_disabled: false,
                        gn_mod_presentation_disabled: false,
                    });
                }
                break;
            case 'gn_mod_homepage':
                if (!check) {
                    this.setState({
                        gn_mod_newsletter: false,
                    });
                }
                break;
            case 'gn_mod_newsletter':
                if (check) {
                    this.setState({
                        gn_mod_homepage: true,
                    });
                }
                break;
            case 'gn_mod_stock':
                if (check) {
                    this.setState({
                        gn_mod_calculation: true,
                        gn_mod_calculation_disabled: true,
                        gn_mod_purchase: true,
                        gn_mod_purchase_disabled: true,
                    });
                }
                if (!check) {
                    this.setState({
                        gn_mod_calculation_disabled: false,
                        gn_mod_purchase_disabled: false,
                    });
                }
                break;
            default:
                return false;
        }
        return false;
    }

    emailTest(name, field) {
        if (!validateEmail(this.state[name]) && this.state[name] !== '') {
            this.setState({
                [`${name}ErrorMsg`]: E.Lang.translate('locals.users.validation.validemail', field),
            });
            return false;
        }
        this.setState({
            [`${name}ErrorMsg`]: '',
        });

        return true;
    }

    render() {
        const {
            leadsFields,
            backMessages,
            ocr,
            countriesList,
            settings,
            appStatus,
        } = this.props;
        const {
            ocrAnchorEl,
            descriptionRequired,
            description,
            campaign_trial,
            phone,
            zip,
            country_id,
            street,
            email,
            contact,
            campaign_email,
            city,
            autocompleteAddress,
            company_type,
            campaign_integration_txt,
            name,
            internalreference,
            prefix,
            campaign_integration,
            emailErrorMsg,
            ocrArray,
            campaign_position,
            campaign_numberofbranches,
            campaign_starttermin,
            campaign_terminals_number,
            campaign_terminals,
            campaign_tablets_number,
            campaign_tablets,
            campaign_mobiles_number,
            campaign_mobiles,
            campaign_drucker_number,
            campaign_drucker,
            campaign_equipment_number,
            campaign_equipment,
            campaign_network,
            campaign_call_checked,
            campaign_call_termin,
            campaign_information_checked,
            campaign_information_termin,
            campaign_offer_checked,
            campaign_offer_termin,
            campaign_termin_checked,
            campaign_termin_termin,
            campaign_installation_checked,
            campaign_installation_termin,
            campaign_consulting_checked,
            campaign_consulting_termin,
            campaign_training_checked,
            campaign_training_termin,
            campaign_miscellaneous_checked,
            campaign_miscellaneous_txt,
        } = this.state;

        let dataBackValues = [];
        if (backMessages) {
            dataBackValues = backMessages;
        }

        let businessType = [];
        let countriesListArray = [];
        let modulesList = [];
        let modulesList2 = [];

        if (typeof leadsFields.LeadField !== 'undefined') {
            modulesList = [
                [leadsFields.LeadField.gn_mod_pos.string, 'gn_mod_pos'],
                [leadsFields.LeadField.gn_mod_loyalty.string, 'gn_mod_loyalty'],
                [leadsFields.LeadField.gn_mod_cashbook.string, 'gn_mod_cashbook'],
                [leadsFields.LeadField.gn_mod_order.string, 'gn_mod_order'],
                [leadsFields.LeadField.gn_mod_purchase.string, 'gn_mod_purchase'],
                [leadsFields.LeadField.gn_mod_calculation.string, 'gn_mod_calculation'],
                [leadsFields.LeadField.gn_mod_reservation.string, 'gn_mod_reservation'],
                [leadsFields.LeadField.gn_mod_menu.string, 'gn_mod_menu'],

            ];

            modulesList2 = [
                [leadsFields.LeadField.gn_mod_marketing.string, 'gn_mod_marketing'],
                [leadsFields.LeadField.gn_mod_homepage.string, 'gn_mod_homepage'],
                [leadsFields.LeadField.gn_mod_newsletter.string, 'gn_mod_newsletter'],
                [leadsFields.LeadField.gn_mod_presentation.string, 'gn_mod_presentation'],
                [leadsFields.LeadField.gn_mod_stock.string, 'gn_mod_stock'],
                [leadsFields.LeadField.gn_mod_timetracking.string, 'gn_mod_timetracking'],
                [leadsFields.LeadField.gn_mod_franchise.string, 'gn_mod_franchise'],
                [`${leadsFields.LeadField.gn_mod_campaign.string} ${E.Lang.translate('locals.newlead.label.gn_mod_campaign')}`,
                    'gn_mod_campaign'],

            ];
            businessType = leadsFields.LeadField.gn_company_type.selection;
        }


        if (typeof countriesList.LeadCountry !== 'undefined') {
            countriesListArray = countriesList.LeadCountry;
        }

        let campaignIntegrationTxt = '';

        if (campaign_integration) {
            campaignIntegrationTxt = (
                <DebouncedTextfield
                    margin="normal"
                    fullWidth
                    InputProps={{
                        disableUnderline: false,
                        classes: {
                            root: `textFieldRoot ${s.integrationTextField}`,
                            input: 'textFieldInput',
                            underline: 'textUnderline',
                        },
                    }}
                    InputLabelProps={{
                        className: 'textFieldFormLabel',
                    }}
                    name="campaign_integration_txt"
                    onChange={this.handleInputChange}
                    value={campaign_integration_txt}
                    type="text"
                    disabled={!campaign_integration}
                />
            );
        }

        let campaignEmail = '';
        if (campaign_trial) {
            campaignEmail = (
                <DebouncedTextfield
                    label={<Lang>locals.newleadform.campaign.email</Lang>}
                    margin="normal"
                    fullWidth
                    disabled={!campaign_trial}
                    InputProps={{
                        disableUnderline: false,
                        classes: {
                            root: `textFieldRoot ${s.emailTextField}`,
                            input: 'textFieldInput',
                            underline: 'textUnderline',
                        },
                    }}
                    InputLabelProps={{
                        className: 'textFieldFormLabel',
                        disabled: !campaign_trial,
                    }}
                    name="campaign_email"
                    onChange={this.handleInputChange}
                    value={campaign_email}
                    type="text"
                />
            );
        }

        let ocrList = '';
        if (ocrArray.length > 0) {
            ocrList = (
                <Menu
                    id="simple-menu"
                    open={Boolean(ocrAnchorEl)}
                    anchorEl={ocrAnchorEl}
                    onClose={this.ocrHelpHandleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 40 * 4.5,
                        },
                    }}
                >
                    {ocrArray.map((ocrName) => (
                        <MenuItem
                            key={ocrName}
                            onClick={() => {
                                this.ocrPutText(ocrName);
                            }}
                        >
                            {ocrName}
                        </MenuItem>
                    ))}
                </Menu>
            );
        }

        let onLineInfoTxt = '';
        let sendBtnLabel = E.Lang.translate('locals.newleadform.send'); //<Lang>locals.newleadform.send</Lang>
        if (!appStatus.isOnLine) {
            onLineInfoTxt = (
                <p>
                    You are offline now.
                    <br />
                    Save this contact and it will be sent later.
                </p>
            );
            sendBtnLabel = 'Save and send later';
        }


        return (
            <div>
                {ocrList}
                <form onSubmit={this.handleSubmit}>
                    <h2><Lang>locals.newleadform.title</Lang></h2>
                    <div className="statementsContainer">
                        {dataBackValues.map((val) => (
                            <p
                                key={val.type}
                                className={`statement ${val.type}`}
                            >
                                <Icon>error</Icon>
                                <span dangerouslySetInnerHTML={{ __html: val.message }} />
                            </p>
                        ))}
                    </div>

                    <div className={s.ocrHelperContener}>
                        <DebouncedTextfield
                            required
                            label={<Lang>locals.newleadform.company</Lang>}
                            autoComplete="given-name"
                            margin="normal"
                            fullWidth
                            name="name"
                            onChange={this.handleInputChange}
                            value={name}
                            inputRef={(el) => {
                                this.nameElRef = el;
                            }}
                        />
                        {ocr.length > 0 ? (
                            <i
                                className={`material-icons ${s.showOcrMenu}`}
                                onClick={(event) => {
                                    this.ocrHelpHandleOpen(event, this.nameElRef);
                                }}
                                role="presentation"
                            >
                                more_horiz
                            </i>
                        ) : (
                            ''
                        )}
                    </div>


                    <div className={s.ocrHelperContener}>
                        <DebouncedTextfield
                            required
                            label={<Lang>locals.newleadform.name</Lang>}
                            autoComplete="given-name"
                            margin="normal"
                            fullWidth
                            name="contact"
                            onChange={this.handleInputChange}
                            value={contact}
                            inputRef={(el) => {
                                this.contactElRef = el;
                            }}
                        />
                        {ocr.length > 0 ? (
                            <i
                                className={`material-icons ${s.showOcrMenu}`}
                                onClick={(event) => {
                                    this.ocrHelpHandleOpen(event, this.contactElRef);
                                }}
                                role="presentation"
                            >
                                more_horiz
                            </i>
                        ) : (
                            ''
                        )}
                    </div>


                    <FormControl
                        fullWidth
                    >

                        <InputLabel
                            htmlFor="company_type"
                        >
                            <Lang>locals.newleadform.businesstype</Lang>
                        </InputLabel>
                        <Select
                            value={company_type}
                            onChange={this.handleInputChange}
                            inputProps={{
                                id: 'company_type',
                                name: 'company_type',
                            }}
                        >
                            <MenuItem value="" disabled>
                                <em><Lang>locals.newleadform.selectbusinesstype</Lang></em>
                            </MenuItem>
                            {businessType.map((item) => <MenuItem key={item[0]} value={item[0]}>{item[1]}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <div className={s.ocrHelperContener}>
                        <DebouncedTextfield
                            error={emailErrorMsg !== ''}
                            required
                            id="email"
                            label={<Lang>locals.newleadform.email</Lang>}
                            autoComplete="username"
                            margin="normal"
                            fullWidth
                            name="email"
                            onChange={this.handleInputChange}
                            onBlur={() => {
                                this.emailTest('email', E.Lang.translate('locals.newleadform.email'));
                            }}
                            type="email"
                            value={email}
                            helperText={emailErrorMsg}
                            inputRef={(el) => {
                                this.emailElRef = el;
                            }}
                        />
                        {ocr.length > 0 ? (
                            <i
                                className={`material-icons ${s.showOcrMenu}`}
                                onClick={(event) => {
                                    this.ocrHelpHandleOpen(event, this.emailElRef);
                                }}
                                role="presentation"
                            >
                                more_horiz
                            </i>
                        ) : (
                            ''
                        )}

                    </div>

                    <FormControl
                        className={s.phoneNumberBox}
                        fullWidth
                    >
                        <Grid container spacing={0} alignItems="flex-end">
                            <Grid item xs={2} sm={2} className={s.prefixBox}>

                                <Select
                                    className={s.prefixSelect}
                                    value={prefix}
                                    onChange={this.handleInputChange}
                                    inputProps={{
                                        id: 'prefix',
                                        name: 'prefix',
                                    }}
                                >
                                    <MenuItem value="+33">+33</MenuItem>
                                    <MenuItem value="+49">+49</MenuItem>
                                    <MenuItem value="+43">+43</MenuItem>
                                    <MenuItem value="+41">+41</MenuItem>

                                </Select>
                            </Grid>
                            <Grid item xs={10} sm={10}>
                                <div className={s.ocrHelperContener}>
                                    <DebouncedTextfield
                                        label={<Lang>locals.newleadform.phone</Lang>}
                                        margin="normal"
                                        fullWidth
                                        InputProps={{
                                            disableUnderline: false,
                                        }}
                                        name="phone"
                                        onChange={this.handleInputChange}
                                        value={phone}
                                        type="tel"
                                        inputRef={(el) => {
                                            this.phoneElRef = el;
                                        }}
                                    />
                                    {ocr.length > 0 ? (
                                        <i
                                            className={`material-icons ${s.showOcrMenu}`}
                                            onClick={(event) => {
                                                this.ocrHelpHandleOpen(event, this.phoneElRef);
                                            }}
                                            role="presentation"
                                        >
                                            more_horiz
                                        </i>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </Grid>
                        </Grid>

                    </FormControl>
                    <br />
                    <div className={s.addressContainer}>

                        <PlacesAutocomplete
                            value={autocompleteAddress}
                            onChange={this.autocompleteHandleChange}
                            onSelect={this.autocompleteHandleSelect}
                        >
                            {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                            }) => (
                                <div>
                                    <div className={s.autocompleteSearchPlace}>
                                        <DebouncedTextfield
                                            {...getInputProps({})}
                                            label={E.Lang.translate('globals.autocomplete.label.searchAddress')}
                                            margin="normal"
                                            fullWidth
                                            autoComplete="nope"
                                        />
                                    </div>
                                    <div className={s.autocompleteDropdownContainer}>
                                        {loading
                                        && (
                                            <div className={s.autocompleteLoading}>
                                                <div
                                                    className={s.progressBarcontainer}
                                                >
                                                    <LinearProgress className={s.progressBar} />
                                                </div>
                                            </div>
                                        )}
                                        {!loading && suggestions.map((suggestion) => {
                                            const className = suggestion.active
                                                ? s.suggestionItemActive
                                                : s.suggestionItem;
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>

                        <div className={s.ocrHelperContener}>
                            <DebouncedTextfield
                                id="street"
                                label={<Lang>locals.newleadform.street</Lang>}
                                margin="normal"
                                fullWidth
                                name="street"
                                onChange={this.handleInputChange}
                                value={street}
                                inputRef={(el) => {
                                    this.streetElRef = el;
                                }}
                            />
                            {ocr.length > 0 ? (
                                <i
                                    className={`material-icons ${s.showOcrMenu}`}
                                    onClick={(event) => {
                                        this.ocrHelpHandleOpen(event, this.streetElRef);
                                    }}
                                    role="presentation"
                                >
                                    more_horiz
                                </i>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className={s.ocrHelperContener}>
                            <DebouncedTextfield
                                required
                                id="city"
                                label={<Lang>locals.newleadform.city</Lang>}
                                margin="normal"
                                fullWidth
                                name="city"
                                onChange={this.handleInputChange}
                                value={city}
                                inputRef={(el) => {
                                    this.cityElRef = el;
                                }}
                            />
                            {ocr.length > 0 ? (
                                <i
                                    className={`material-icons ${s.showOcrMenu}`}
                                    onClick={(event) => {
                                        this.ocrHelpHandleOpen(event, this.cityElRef);
                                    }}
                                    role="presentation"
                                >
                                    more_horiz
                                </i>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className={s.ocrHelperContener}>
                            <DebouncedTextfield
                                required
                                id="zip"
                                label={<Lang>locals.newleadform.zip</Lang>}
                                margin="normal"
                                fullWidth
                                name="zip"
                                onChange={this.handleInputChange}
                                value={zip}
                                inputRef={(el) => {
                                    this.zipElRef = el;
                                }}
                            />
                            {ocr.length > 0 ? (
                                <i
                                    className={`material-icons ${s.showOcrMenu}`}
                                    onClick={(event) => {
                                        this.ocrHelpHandleOpen(event, this.zipElRef);
                                    }}
                                    role="presentation"
                                >
                                    more_horiz
                                </i>
                            ) : (
                                ''
                            )}
                        </div>
                        {(countriesListArray.length > 0) && (
                            <FormControl fullWidth>
                                <InputLabel htmlFor="country_id">
                                    <Lang>locals.newleadform.country</Lang>
                                </InputLabel>
                                <Select
                                    value={country_id}
                                    onChange={this.handleInputChange}
                                    inputProps={{
                                        id: 'country_id',
                                        name: 'country_id',
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <em><Lang>locals.newleadform.selectcountry</Lang></em>
                                    </MenuItem>
                                    {countriesListArray.map((item) => <MenuItem key={item.id} disabled={!item.id} value={item.id}>{item.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}
                    </div>
                    <br />

                    {(() => {
                        if (settings.campaign_id) {
                            return (
                                <div>
                                    <br />
                                    <h3>
                                        <Lang>locals.newleadform.campaign.header.name</Lang>
                                    </h3>
                                    <div className={s.ocrHelperContener}>
                                        <DebouncedTextfield
                                            id="street"
                                            label={<Lang>locals.newleadform.campaign.position</Lang>}
                                            margin="normal"
                                            fullWidth
                                            name="campaign_position"
                                            onChange={this.handleInputChange}
                                            value={campaign_position}
                                            inputRef={(el) => {
                                                this.campaignPositionElRef = el;
                                            }}
                                        />
                                        {ocr.length > 0 ? (
                                            <i
                                                className={`material-icons ${s.showOcrMenu}`}
                                                onClick={(event) => {
                                                    this.ocrHelpHandleOpen(event, this.campaignPositionElRef);
                                                }}
                                                role="presentation"
                                            >
                                                more_horiz
                                            </i>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <br />
                                    <DebouncedTextfield
                                        label={<Lang>locals.newleadform.campaign.numberofbranches</Lang>}
                                        margin="normal"
                                        fullWidth
                                        name="campaign_numberofbranches"
                                        onChange={this.handleInputChange}
                                        value={campaign_numberofbranches}
                                        type="number"
                                    />
                                    <br />
                                    <DebouncedTextfield
                                        label={<Lang>locals.newleadform.campaign.starttermin</Lang>}
                                        margin="normal"
                                        fullWidth
                                        name="campaign_starttermin"
                                        onChange={this.handleInputChange}
                                        value={campaign_starttermin}
                                    />
                                </div>
                            );
                        }
                        return '';
                    })()}

                    <h3><Lang>locals.newleadform.modules</Lang></h3>


                    <Grid container spacing={5} alignContent="center" alignItems="flex-start">
                        <Grid item sm={6} xs={12}>
                            <FormGroup>
                                {modulesList.map((item) => (
                                    <FormControlLabel
                                        key={item[1]}
                                        control={(
                                            <Checkbox
                                                disabled={this.state[`${item[1]}_disabled`]}
                                                checked={this.state[item[1]]}
                                                onChange={this.handleCheckboxChange(item[1])}
                                                value={item[1]}
                                            />
                                        )}
                                        classes={{
                                            label: 'formControlLabel',
                                        }}
                                        label={item[0]}
                                    />
                                ))}

                            </FormGroup>

                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <FormGroup>
                                {modulesList2.map((item) => (
                                    <FormControlLabel
                                        key={item[1]}
                                        control={(
                                            <Checkbox
                                                disabled={this.state[`${item[1]}_disabled`]}
                                                checked={this.state[item[1]]}
                                                onChange={this.handleCheckboxChange(item[1])}
                                                value={item[1]}
                                            />
                                        )}
                                        classes={{
                                            label: 'formControlLabel',
                                        }}
                                        label={item[0]}
                                    />
                                ))}

                            </FormGroup>

                        </Grid>
                    </Grid>

                    {(() => {
                        if (settings.campaign_id) {
                            return (
                                <div>
                                    <h3><Lang>locals.newleadform.campaign.header.hardware</Lang></h3>
                                    <FormControl
                                        className={s.hardwareBox}
                                        fullWidth
                                    >
                                        <Grid container spacing={4} alignItems="flex-end">
                                            <Grid item xs={2} sm={2} className={s.prefixBox}>
                                                <Select
                                                    className={s.prefixSelect}
                                                    value={campaign_terminals_number}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_terminals_number',
                                                        name: 'campaign_terminals_number',
                                                    }}
                                                >
                                                    <MenuItem value="">-----</MenuItem>
                                                    {(() => {
                                                        const options = [];

                                                        for (let i = 0; i <= 20; i++) {
                                                            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
                                                        }
                                                        return options;
                                                    })()}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={10} sm={10}>
                                                <DebouncedTextfield
                                                    label={<Lang>locals.newleadform.campaign.terminals</Lang>}
                                                    margin="none"
                                                    fullWidth
                                                    InputProps={{
                                                        disableUnderline: false,
                                                    }}
                                                    name="campaign_terminals"
                                                    onChange={this.handleInputChange}
                                                    value={campaign_terminals}
                                                    type="text"
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                    <FormControl
                                        className={s.hardwareBox}
                                        fullWidth
                                    >
                                        <Grid container spacing={4} alignItems="flex-end">
                                            <Grid item xs={2} sm={2} className={s.prefixBox}>
                                                <Select
                                                    className={s.prefixSelect}
                                                    value={campaign_tablets_number}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_tablets_number',
                                                        name: 'campaign_tablets_number',
                                                    }}
                                                >
                                                    <MenuItem value="">-----</MenuItem>
                                                    {(() => {
                                                        const options = [];

                                                        for (let i = 0; i <= 20; i++) {
                                                            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
                                                        }
                                                        return options;
                                                    })()}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={10} sm={10}>
                                                <DebouncedTextfield
                                                    label={<Lang>locals.newleadform.campaign.tablets</Lang>}
                                                    margin="none"
                                                    fullWidth
                                                    InputProps={{
                                                        disableUnderline: false,
                                                    }}
                                                    name="campaign_tablets"
                                                    onChange={this.handleInputChange}
                                                    value={campaign_tablets}
                                                    type="text"
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                    <FormControl
                                        className={s.hardwareBox}
                                        fullWidth
                                    >
                                        <Grid container spacing={4} alignItems="flex-end">
                                            <Grid item xs={2} sm={2} className={s.prefixBox}>
                                                <Select
                                                    className={s.prefixSelect}
                                                    value={campaign_mobiles_number}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_mobiles_number',
                                                        name: 'campaign_mobiles_number',
                                                    }}
                                                >
                                                    <MenuItem value="">-----</MenuItem>
                                                    {(() => {
                                                        const options = [];

                                                        for (let i = 0; i <= 20; i++) {
                                                            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
                                                        }
                                                        return options;
                                                    })()}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={10} sm={10}>
                                                <DebouncedTextfield
                                                    label={<Lang>locals.newleadform.campaign.mobiles</Lang>}
                                                    margin="none"
                                                    fullWidth
                                                    name="campaign_mobiles"
                                                    onChange={this.handleInputChange}
                                                    value={campaign_mobiles}
                                                    type="text"
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                    <FormControl
                                        className={s.hardwareBox}
                                        fullWidth
                                    >
                                        <Grid container spacing={4} alignItems="flex-end">
                                            <Grid item xs={2} sm={2} className={s.prefixBox}>
                                                <Select
                                                    className={s.prefixSelect}
                                                    value={campaign_drucker_number}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_drucker_number',
                                                        name: 'campaign_drucker_number',
                                                    }}
                                                >
                                                    <MenuItem value="">-----</MenuItem>
                                                    {(() => {
                                                        const options = [];

                                                        for (let i = 0; i <= 20; i++) {
                                                            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
                                                        }
                                                        return options;
                                                    })()}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={10} sm={10}>
                                                <DebouncedTextfield
                                                    label={<Lang>locals.newleadform.campaign.drucker</Lang>}
                                                    margin="none"
                                                    fullWidth
                                                    name="campaign_drucker"
                                                    onChange={this.handleInputChange}
                                                    value={campaign_drucker}
                                                    type="text"
                                                />
                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                    <FormControl
                                        className={s.hardwareBox}
                                        fullWidth
                                    >
                                        <Grid container spacing={4} alignItems="flex-end">
                                            <Grid item xs={2} sm={2} className={s.prefixBox}>
                                                <Select
                                                    className={s.prefixSelect}
                                                    value={campaign_equipment_number}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_equipment_number',
                                                        name: 'campaign_equipment_number',
                                                    }}
                                                >
                                                    <MenuItem value="">-----</MenuItem>
                                                    {(() => {
                                                        const options = [];

                                                        for (let i = 0; i <= 20; i++) {
                                                            options.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
                                                        }
                                                        return options;
                                                    })()}
                                                </Select>

                                            </Grid>
                                            <Grid item xs={10} sm={10}>
                                                <DebouncedTextfield
                                                    label={<Lang>locals.newleadform.campaign.equipment</Lang>}
                                                    margin="none"
                                                    fullWidth
                                                    name="campaign_equipment"
                                                    onChange={this.handleInputChange}
                                                    value={campaign_equipment}
                                                    type="text"
                                                />

                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                    <Grid container spacing={4} alignItems="flex-start">
                                        <Grid item xs={6} sm={2}>
                                            <FormControl>
                                                <InputLabel
                                                    htmlFor="campaign_network"
                                                >
                                                    <Lang>locals.newleadform.campaign.network</Lang>
                                                </InputLabel>
                                                <Select
                                                    value={campaign_network}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_network',
                                                        name: 'campaign_network',
                                                    }}
                                                >
                                                    <MenuItem value={1}><Lang>locals.newleadform.campaign.yes</Lang></MenuItem>
                                                    <MenuItem value={0}><Lang>locals.newleadform.campaign.no</Lang></MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} sm={2}>
                                            <FormControl>

                                                <InputLabel
                                                    htmlFor="campaign_integration"
                                                >
                                                    <Lang>locals.newleadform.campaign.integration</Lang>
                                                </InputLabel>
                                                <Select
                                                    value={campaign_integration}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_integration',
                                                        name: 'campaign_integration',
                                                    }}
                                                >
                                                    <MenuItem value={1}><Lang>locals.newleadform.campaign.yes</Lang></MenuItem>
                                                    <MenuItem value={0}><Lang>locals.newleadform.campaign.no</Lang></MenuItem>
                                                </Select>
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            {campaignIntegrationTxt}
                                        </Grid>
                                    </Grid>


                                    <h3><Lang>locals.newleadform.campaign.header.wishes</Lang></h3>

                                    <Grid container spacing={8} alignItems="flex-end">
                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_call_checked}
                                                        onChange={this.handleCheckboxChange('campaign_call_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.call</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_call_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_call_checked,
                                                }}
                                                name="campaign_call_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_call_termin}
                                                type="text"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_information_checked}
                                                        onChange={this.handleCheckboxChange('campaign_information_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.information</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_information_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_information_checked,
                                                }}
                                                name="campaign_information_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_information_termin}
                                                type="text"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_offer_checked}
                                                        onChange={this.handleCheckboxChange('campaign_offer_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.offer</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_offer_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_offer_checked,
                                                }}
                                                name="campaign_offer_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_offer_termin}
                                                type="text"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_termin_checked}
                                                        onChange={this.handleCheckboxChange('campaign_termin_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.termin</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_termin_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_termin_checked,
                                                }}
                                                name="campaign_termin_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_termin_termin}
                                                type="text"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_installation_checked}
                                                        onChange={this.handleCheckboxChange('campaign_installation_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.installation</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_installation_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_installation_checked,
                                                }}
                                                name="campaign_installation_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_installation_termin}
                                                type="text"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_consulting_checked}
                                                        onChange={this.handleCheckboxChange('campaign_consulting_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.consulting</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_consulting_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_consulting_checked,
                                                }}
                                                name="campaign_consulting_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_consulting_termin}
                                                type="text"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_training_checked}
                                                        onChange={this.handleCheckboxChange('campaign_training_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.training</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={6} sm={8}>
                                            <DebouncedTextfield
                                                label={<Lang>locals.newleadform.campaign.header.termin</Lang>}
                                                margin="none"
                                                classes={{
                                                    root: 'formControlNoSpacing',
                                                }}
                                                fullWidth
                                                disabled={!campaign_training_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_training_checked,
                                                }}
                                                name="campaign_training_termin"
                                                onChange={this.handleInputChange}
                                                value={campaign_training_termin}
                                                type="text"
                                            />
                                        </Grid>


                                        <Grid item xs={4} sm={2}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={campaign_miscellaneous_checked}
                                                        onChange={this.handleCheckboxChange('campaign_miscellaneous_checked')}
                                                        value="checked"
                                                    />
                                                )}
                                                classes={{
                                                    label: 'formControlLabel',
                                                }}
                                                label={<Lang>locals.newleadform.campaign.miscellaneous</Lang>}
                                            />

                                        </Grid>
                                        <Grid item xs={8} sm={10}>
                                            <DebouncedTextfield
                                                margin="none"
                                                fullWidth
                                                disabled={!campaign_miscellaneous_checked}
                                                InputProps={{
                                                    disableUnderline: false,
                                                }}
                                                InputLabelProps={{
                                                    disabled: !campaign_miscellaneous_checked,
                                                }}
                                                name="campaign_miscellaneous_txt"
                                                onChange={this.handleInputChange}
                                                value={campaign_miscellaneous_txt}
                                                type="text"
                                            />
                                        </Grid>

                                    </Grid>


                                    <Grid container spacing={5} alignItems="flex-end">
                                        <Grid item xs={4} sm={2}>
                                            <FormControl>

                                                <InputLabel
                                                    htmlFor="campaign_trial"
                                                >
                                                    <Lang>locals.newleadform.campaign.trial</Lang>
                                                </InputLabel>
                                                <Select
                                                    value={campaign_trial}
                                                    onChange={this.handleInputChange}
                                                    inputProps={{
                                                        id: 'campaign_trial',
                                                        name: 'campaign_trial',
                                                    }}
                                                >
                                                    <MenuItem value={1}><Lang>locals.newleadform.campaign.yes</Lang></MenuItem>
                                                    <MenuItem value={0}><Lang>locals.newleadform.campaign.no</Lang></MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={10}>
                                            {campaignEmail}
                                        </Grid>
                                    </Grid>


                                </div>
                            );
                        }
                        return '';
                    })()}


                    <DebouncedTextfield
                        required={descriptionRequired}
                        id="description"
                        label={<Lang>locals.newleadform.description</Lang>}
                        margin="normal"
                        fullWidth
                        multiline
                        rows="4"
                        InputProps={{
                            disableUnderline: false,
                            classes: {
                                root: 'textFieldRoot',
                                input: 'textFieldInput',
                                underline: 'textUnderline',
                            },
                        }}
                        InputLabelProps={{
                            className: 'textFieldFormLabel',
                        }}
                        name="description"
                        onChange={this.handleInputChange}
                        value={description}
                    />

                    <br />
                    <DebouncedTextfield
                        id="internalreference"
                        label={<Lang>locals.newleadform.internalreference</Lang>}
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                            classes: {
                                root: 'textFieldRoot',
                                input: 'textFieldInput',
                                underline: 'textUnderline',
                            },
                        }}
                        InputLabelProps={{
                            className: 'textFieldFormLabel',
                        }}
                        name="internalreference"
                        onChange={this.handleInputChange}
                        value={internalreference}
                    />


                    <div className={s.buttonPlace}>
                        {onLineInfoTxt}
                        <Button className="button" type="submit">{sendBtnLabel}</Button>
                    </div>
                </form>
            </div>
        );
    }
}

NewLeadForm.propTypes = {
    settings: PropTypes.shape({
        inProgress: PropTypes.array,
        settingForUserActive: PropTypes.bool,
        showSettingWindow: PropTypes.bool,
        source_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        sourceFixed: PropTypes.bool,
        campaign_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        campaignList: PropTypes.array,
        campaignFixed: PropTypes.bool,
    }),
    countriesList: PropTypes.shape({
        LeadCountry: PropTypes.array,
    }),
    ocr: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    requestCurrentUser: PropTypes.func.isRequired,
    leadsFields: PropTypes.shape({
        LeadField: PropTypes.shape({
            gn_company_type: PropTypes.shape({ selection: PropTypes.array }),
            gn_mod_campaign: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_franchise: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_timetracking: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_stock: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_presentation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_newsletter: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_homepage: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_marketing: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_menu: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_reservation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_calculation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_purchase: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_order: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_cashbook: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_loyalty: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_pos: PropTypes.shape({ string: PropTypes.string }),
        }),
    }),
    clearMessages: PropTypes.func.isRequired,
    getLeadsFieldsNewLead: PropTypes.func.isRequired,
    getCountriesList: PropTypes.func.isRequired,
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    sendNewLead: PropTypes.func.isRequired,
    showProgressBar: PropTypes.func.isRequired,
    googleMapsSetting: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({}),
    ]),
    ocrPhotos: PropTypes.arrayOf(PropTypes.shape({
        image: PropTypes.string,
        ocrInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.bool, PropTypes.shape({})]),
    })),
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.bool, PropTypes.shape({})]),
    setAddress: PropTypes.func.isRequired,
    removeAllPhotos: PropTypes.func.isRequired,
    resetgoogleMapsSetting: PropTypes.func.isRequired,
    appStatus: PropTypes.shape({
        isOnLine: PropTypes.bool,
    }),
    sectionNewLead: PropTypes.func.isRequired,
};

NewLeadForm.defaultProps = {
    settings: {
        inProgress: [],
        settingForUserActive: true,
        showSettingWindow: false,
        source_id: false,
        sourceFixed: false,
        campaign_id: false,
        campaignList: [],
        campaignFixed: false,
    },
    countriesList: {
        LeadCountry: {},
    },
    ocr: [],
    leadsFields: {
        LeadField: {},
    },
    backMessages: null,
    googleMapsSetting: false,
    ocrPhotos: [],
    user: {},
    appStatus: {
        isOnLine: false,
    },
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    leadsFields: state.newLead.fields,
    countriesList: state.newLead.countriesList,
    user: state.users.user,
    isLoginIn: state.users.isLoginIn,
    settings: state.settings,
    appStatus: state.appStatus,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    sendNewLead: sendNewLeadAction,
    showProgressBar: showProgressBarAction,
    clearMessages: clearMessagesAction,
    getLeadsFieldsNewLead: getLeadsFieldsNewLeadAction,
    getCountriesList: getCountriesListAction,
    requestCurrentUser: requestCurrentUserAction,
    sectionNewLead: sectionNewLeadAction,
    backMessagesAction: backMessagesAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewLeadForm);
