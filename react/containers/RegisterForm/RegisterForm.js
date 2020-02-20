/* eslint camelcase: [0] */ // use names like in odoo
/* eslint-disable react/no-danger */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Icon,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
// ACTIONS
import {
    changeSectionLoginPage as changeSectionLoginPageAction,
    dataSendingLoginPage as dataSendingLoginPageAction,
    setPartnerId as setPartnerIdAction,
} from '../../store/actions/loginPage';
import {
    getPartnersList as getPartnersListAction,
    sendRegisterForm as sendRegisterFormAction,
} from '../../store/actions/users';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
// HELPERS
import { validateEmail } from '../../helpers/validateForm';
// CSS
import s from './RegisterForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class LoginFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parent_id: '', // 4735
            partner_id: '',
            partner_idErrorMsg: '',
            email: '',
            emailErrorMsg: '',
            emailVerification: '',
            emailVerificationErrorMsg: '',
            name: '',
            lastName: '',
            company: '',
            vertriebaregion: '',
            password: '',
            passwordErrorMsg: '',
            passwordVerification: '',
            passwordVerificationErrorMsg: '',
            termsOfUse: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.emailTest = this.emailTest.bind(this);
        this.matches = this.matches.bind(this);
        this.minlength = this.minlength.bind(this);
    }

    componentDidMount() {
        const { clearMessages } = this.props;
        clearMessages();
        this.getPartnerId();
    }

    componentWillUnmount() {
        const { setPartnerId } = this.props;
        setPartnerId({ partnerId: false });
    }


    getPartnerId() {
        const { parent_id } = this.props;
        this.setState({
            parent_id,
        });


        this.getPartners(parent_id);
    }

    getPartners(parent_id) {
        const { getPartnersList, dataSendingLoginPage } = this.props;
        dataSendingLoginPage({ dataSending: true });
        getPartnersList({
            parent_id,
        });
    }

    changeSection = (section) => {
        const { changeSectionLoginPage, clearMessages } = this.props;
        clearMessages();
        changeSectionLoginPage({ curentSection: section });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            sendRegisterForm,
            dataSendingLoginPage,
        } = this.props;

        const {
            termsOfUse,
            password,
            name,
            email,
            partner_id,
        } = this.state;

        if (!this.emailTest('email')) {
            return false;
        }

        if (!this.required('partner_id', E.Lang.translate('locals.newleadform.selectpartner'))) {
            return false;
        }
        if (!this.matches(
            'emailVerification',
            E.Lang.translate('locals.users.register.labelemailverification'),
            'email',
            E.Lang.translate('locals.users.register.labelemail'),
        )) {
            return false;
        }

        if (!this.minlength('password', E.Lang.translate('locals.users.register.labelpassword'))) {
            return false;
        }
        if (!this.matches(
            'passwordVerification',
            E.Lang.translate('locals.users.register.labelpasswordverification'),
            'password',
            E.Lang.translate('locals.users.register.labelpassword'),
        )) {
            return false;
        }
        if (!termsOfUse) {
            return false;
        }

        dataSendingLoginPage({ dataSending: true });
        sendRegisterForm({
            parent_id: partner_id,
            email,
            name,
            password,
        });
        return false;
    };

    handleInputChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        this.setState({
            [name]: value,
        });
    }

    emailTest(name, field) {
        // eslint-disable-next-line react/destructuring-assignment
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

    matches(name, field, nameTest, fieldTest) {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state[name] !== this.state[nameTest] && this.state[name] !== '') {
            this.setState({
                [`${name}ErrorMsg`]: E.Lang.translate('locals.users.validation.matches', field, fieldTest),
            });
            return false;
        }
        this.setState({
            [`${name}ErrorMsg`]: '',
        });

        return true;
    }

    minlength(name, field) {
        const min = 8;
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state[name].length < min) {
            this.setState({
                [`${name}ErrorMsg`]: E.Lang.translate('locals.users.validation.minlength', field, min),
            });
            return false;
        }
        this.setState({
            [`${name}ErrorMsg`]: '',
        });

        return true;
    }

    required(name, field) {
        // eslint-disable-next-line react/destructuring-assignment
        if (this.state[name] === '') {
            this.setState({
                [`${name}ErrorMsg`]: E.Lang.translate('locals.users.validation.required', field),
            });
            return false;
        }
        this.setState({
            [`${name}ErrorMsg`]: '',
        });

        return true;
    }

    render() {
        let dataBackValues = [];
        const {
            backMessages,
            partnersList,
        } = this.props;

        const {
            emailErrorMsg,
            email,
            emailVerificationErrorMsg,
            emailVerification,
            name,
            passwordErrorMsg,
            password,
            passwordVerificationErrorMsg,
            passwordVerification,
            partner_idErrorMsg,
            partner_id,
            termsOfUse,
        } = this.state;

        if (backMessages) {
            dataBackValues = backMessages;
        }

        let partnerList = [];

        if (partnersList != null) {
            partnerList = partnersList;
        }

        return (
            <div className={s.registerForm}>
                <form onSubmit={this.handleSubmit} id="registerForm">

                    <h1><Lang>locals.users.register.register</Lang></h1>
                    <div className="statementsContainer">
                        {dataBackValues.map((val) => (
                            <p key={val.type} className={`statement ${val.type}`}>
                                <Icon>error</Icon>
                                {' '}
                                {val.message}
                            </p>
                        ))}
                    </div>


                    <TextField
                        error={emailErrorMsg !== ''}
                        required
                        label={<Lang>locals.users.register.labelemail</Lang>}
                        autoComplete="email"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="email"

                        onChange={this.handleInputChange}
                        onBlur={() => {
                            this.matches(
                                'emailVerification',
                                E.Lang.translate('locals.users.register.labelemailverification'),
                                'email',
                                E.Lang.translate('locals.users.register.labelemail'),
                            );
                        }}
                        type="email"
                        value={email}
                        helperText={emailErrorMsg}
                    />
                    <br />
                    <TextField
                        error={emailVerificationErrorMsg !== ''}
                        required
                        label={<Lang>locals.users.register.labelemailverification</Lang>}
                        autoComplete="email"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="emailVerification"
                        onChange={this.handleInputChange}
                        onBlur={() => {
                            this.matches(
                                'emailVerification',
                                E.Lang.translate('locals.users.register.labelemailverification'),
                                'email',
                                E.Lang.translate('locals.users.register.labelemail'),
                            );
                        }}
                        type="email"
                        value={emailVerification}
                        helperText={emailVerificationErrorMsg}
                    />
                    <br />
                    <TextField
                        required
                        label={<Lang>locals.users.register.labelname</Lang>}
                        autoComplete="given-name"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="name"
                        onChange={this.handleInputChange}
                        value={name}
                    />
                    <br />

                    <TextField
                        error={passwordErrorMsg !== ''}
                        required
                        type="password"
                        label={<Lang>locals.users.register.labelpassword</Lang>}
                        autoComplete="current-password"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="password"
                        onChange={this.handleInputChange}
                        onBlur={() => {
                            this.matches(
                                'passwordVerification',
                                E.Lang.translate('locals.users.register.labelpasswordverification'),
                                'password',
                                E.Lang.translate('locals.users.register.labelpassword'),
                            );
                        }}
                        value={password}
                        helperText={passwordErrorMsg}
                    />
                    <br />
                    <TextField
                        error={passwordVerificationErrorMsg !== ''}
                        required
                        type="password"
                        label={<Lang>locals.users.register.labelpasswordverification</Lang>}
                        autoComplete="current-password"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="passwordVerification"
                        onChange={this.handleInputChange}
                        onBlur={() => {
                            this.matches(
                                'passwordVerification',
                                E.Lang.translate('locals.users.register.labelpasswordverification'),
                                'password',
                                E.Lang.translate('locals.users.register.labelpassword'),
                            );
                        }}
                        value={passwordVerification}
                        helperText={passwordVerificationErrorMsg}
                    />
                    <br />
                    <FormControl
                        fullWidth
                        error={partner_idErrorMsg !== ''}
                    >

                        <InputLabel
                            required
                            htmlFor="partner_id"
                        >
                            <Lang>locals.newleadform.selectpartner</Lang>
                        </InputLabel>
                        <Select
                            value={partner_id}
                            onChange={this.handleInputChange}
                            inputProps={{
                                id: 'partner_id',
                                name: 'partner_id',
                            }}
                        >

                            <MenuItem value="" disabled>
                                <em><Lang>locals.newleadform.selectpartner</Lang></em>
                            </MenuItem>
                            {partnerList.map((partnerName) => (
                                <MenuItem key={partnerName.id} disabled={!partnerName.id} value={partnerName.id}>
                                    {partnerName.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{partner_idErrorMsg}</FormHelperText>
                    </FormControl>

                    <br />
                    <FormGroup>
                        <FormControlLabel
                            required
                            control={(
                                <Checkbox
                                    name="termsOfUse"
                                    checked={termsOfUse}
                                    onChange={this.handleInputChange}
                                    value="1"
                                />
                            )}
                            classes={{
                                label: `formControlLabel ${s.terms}`,
                            }}
                            label={(
                                <span
                                    className={s.terms}
                                    dangerouslySetInnerHTML={{ __html: `${E.Lang.translate('locals.users.register.termsofuse')} *` }}
                                />
                            )}
                        />
                    </FormGroup>
                    <div className={s.buttonPlace}>
                        <Button className="buttonWhite" onClick={() => this.changeSection('loginForm')}>
                            <Lang>locals.users.register.ihaveaccount</Lang>
                        </Button>
                        <Button className="button" type="submit" disabled={!termsOfUse}>
                            <Lang>locals.users.register.register</Lang>
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

LoginFormComponent.propTypes = {
    partnersList: PropTypes.arrayOf(PropTypes.shape({})),
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array]),
    sendRegisterForm: PropTypes.func.isRequired,
    changeSectionLoginPage: PropTypes.func.isRequired,
    dataSendingLoginPage: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
    getPartnersList: PropTypes.func.isRequired,
    setPartnerId: PropTypes.func.isRequired,
    parent_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

LoginFormComponent.defaultProps = {
    backMessages: null,
    parent_id: '',
    partnersList: {},
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    partnersList: state.users.partnersList,
    partnerId: state.loginPage.partnerId,
    parent_id: state.loginPage.partnerId,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    sendRegisterForm: sendRegisterFormAction,
    changeSectionLoginPage: changeSectionLoginPageAction,
    dataSendingLoginPage: dataSendingLoginPageAction,
    clearMessages: clearMessagesAction,
    getPartnersList: getPartnersListAction,
    setPartnerId: setPartnerIdAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormComponent);
