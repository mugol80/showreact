/* eslint react/no-danger: [0] */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    Grid,
    Icon,
    TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
import { showProgressBar as showProgressBarAction } from '../../store/actions/dashboard';
import {
    requestCurrentUser as requestCurrentUserAction,
    saveUserData as saveUserDataAction,
    saveUserPassword as saveUserPasswordAction,
} from '../../store/actions/users';
// HELPERS
import { validateEmail } from '../../helpers/validateForm';
// CSS
import s from './AccountForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class AccountForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            emailErrorMsg: '',
            password: '',
            passwordErrorMsg: '',
            currentPassword: '',
            currentPassword2: '',
            passwordVerification: '',
            passwordVerificationErrorMsg: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.emailTest = this.emailTest.bind(this);
        this.matches = this.matches.bind(this);
        this.minlength = this.minlength.bind(this);
    }

    componentDidMount() {
        const {
            user,
            clearMessages,
        } = this.props;
        this.setState({
            name: user.name,
            email: user.email,
        });
        clearMessages();
    }

    componentWillUnmount() {
        const { clearMessages } = this.props;
        clearMessages();
    }

    handleSubmitData = (e) => {
        e.preventDefault();

        if (!this.emailTest('email')) {
            return;
        }
        const {
            saveUserData,
            showProgressBar,
        } = this.props;
        const {
            currentPassword,
            email,
            name,
        } = this.state;
        showProgressBar({ showProgressBar: true });
        saveUserData({ name, email, currentPassword });
        this.setState({
            currentPassword: '',
        });
    };

    handleSubmitPassword = (e) => {
        e.preventDefault();

        if (!this.matches(
            'passwordVerification',
            E.Lang.translate('locals.users.register.labelpasswordverification'),
            'password',
            E.Lang.translate('locals.users.register.labelpassword'),
        )) {
            return false;
        }

        if (!this.minlength('password', E.Lang.translate('locals.users.register.labelpassword'))) {
            return false;
        }

        const {
            saveUserPassword,
            showProgressBar,
        } = this.props;
        const {
            password,
            currentPassword2,
        } = this.state;
        showProgressBar({ showProgressBar: true });
        saveUserPassword({ password, currentPassword: currentPassword2 });
        this.setState({
            currentPassword2: '',
        });
        return false;
    };

    handleInputChange(e) {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        this.setState({
            [name]: value,
        });
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

    matches(name, field, nameTest, fieldTest) {
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

    render() {
        const { backMessages } = this.props;
        const {
            name,
            emailErrorMsg,
            email,
            currentPassword,
            passwordErrorMsg,
            password,
            passwordVerificationErrorMsg,
            passwordVerification,
            currentPassword2,
        } = this.state;
        const dataBackValuesData = backMessages
            ? backMessages.filter((val) => (val.place === 'data')) : [];

        const dataBackValuesPassword = backMessages
            ? backMessages.filter((val) => (val.place === 'pass')) : [];

        return (
            <div className="accountForm">
                <div className="header">
                    <div className="contentContainerCenter">
                        <h1>
                            <Lang>locals.users.account.title</Lang>
                            <br />
                            <span><Lang>locals.users.account.titlesmall</Lang></span>
                        </h1>
                    </div>
                </div>
                <div className="content">
                    <div className="contentContainerCenter">
                        <Grid container spacing={8}>
                            <Grid className="" item sm={4} xs={12}>
                                <div className="infoText">
                                    <p><Lang>locals.users.account.msg</Lang></p>
                                </div>

                            </Grid>
                            <Grid item sm={8} xs={12}>
                                <form onSubmit={this.handleSubmitData}>
                                    <h2>
                                        <Lang>locals.users.account.changeyourdata</Lang>
                                        {' '}
                                    </h2>
                                    <div className="statementsContainer">
                                        {dataBackValuesData.map((val) => (
                                            <p
                                                key={val.place}
                                                className={`statement ${val.type}`}
                                            >
                                                <Icon>{val.icon}</Icon>
                                                <span dangerouslySetInnerHTML={{ __html: val.message }} />
                                            </p>
                                        ))}
                                    </div>

                                    <TextField
                                        required
                                        label={<Lang>locals.users.account.name</Lang>}
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
                                        error={emailErrorMsg !== ''}
                                        required
                                        id="email"
                                        label={<Lang>locals.users.account.email</Lang>}
                                        autoComplete="username"
                                        margin="normal"
                                        fullWidth
                                        InputProps={{
                                            disableUnderline: false,
                                        }}
                                        name="email"
                                        onChange={this.handleInputChange}
                                        onBlur={() => {
                                            this.emailTest('email', E.Lang.translate('locals.users.account.email'));
                                        }}
                                        type="email"
                                        value={email}
                                        helperText={emailErrorMsg}

                                    />
                                    <br />
                                    <TextField
                                        required
                                        label={<Lang>locals.users.account.currentpassword</Lang>}
                                        margin="normal"
                                        fullWidth
                                        InputProps={{
                                            disableUnderline: false,
                                        }}
                                        name="currentPassword"
                                        type="password"
                                        onChange={this.handleInputChange}
                                        value={currentPassword}
                                    />
                                    <div className={s.buttonPlace}>
                                        <Button className="button" type="submit">
                                            <Lang>locals.users.account.save</Lang>
                                            {' '}
                                        </Button>
                                    </div>
                                </form>

                                <form onSubmit={this.handleSubmitPassword}>
                                    <h2>
                                        <Lang>locals.users.account.titlechangeyourpassword</Lang>
                                    </h2>
                                    <div className="statementsContainer">
                                        {dataBackValuesPassword.map((val) => (
                                            <p
                                                key={val.place}
                                                className={`statement ${val.type}`}
                                            >
                                                <Icon>error</Icon>
                                                {' '}
                                                <span dangerouslySetInnerHTML={{ __html: val.message }} />
                                            </p>
                                        ))}
                                    </div>

                                    <TextField
                                        error={passwordErrorMsg !== ''}
                                        required
                                        id="password"
                                        label={<Lang>locals.users.account.newpassword</Lang>}
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
                                        type="password"
                                        value={password}
                                        helperText={passwordErrorMsg}
                                    />
                                    <br />
                                    <TextField
                                        error={passwordVerificationErrorMsg !== ''}
                                        required
                                        id="passwordVerification"
                                        label={<Lang>locals.users.account.confirmpassword</Lang>}
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
                                        type="password"
                                        value={passwordVerification}
                                        helperText={passwordVerificationErrorMsg}
                                    />
                                    <br />
                                    <TextField
                                        required
                                        label={<Lang>locals.users.account.currentpassword</Lang>}
                                        margin="normal"
                                        fullWidth
                                        InputProps={{
                                            disableUnderline: false,
                                        }}
                                        name="currentPassword2"
                                        type="password"
                                        onChange={this.handleInputChange}
                                        value={currentPassword2}
                                    />


                                    <div className={s.buttonPlace}>
                                        <Button className="button" type="submit"><Lang>locals.users.account.buttonchangepassword</Lang></Button>
                                    </div>
                                </form>

                            </Grid>


                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

AccountForm.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array, PropTypes.shape({})]),
    saveUserData: PropTypes.func.isRequired,
    saveUserPassword: PropTypes.func.isRequired,
    showProgressBar: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.shape({})]),
};

AccountForm.defaultProps = {
    backMessages: null,
    user: null,
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    user: state.users.user,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    saveUserData: saveUserDataAction,
    saveUserPassword: saveUserPasswordAction,
    showProgressBar: showProgressBarAction,
    clearMessages: clearMessagesAction,
    requestCurrentUser: requestCurrentUserAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AccountForm);
