import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    Icon,
    TextField,
} from '@material-ui/core';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
// ACTIONS
import {
    changeSectionLoginPage as changeSectionLoginPageAction,
    dataSendingLoginPage as dataSendingLoginPageAction,
} from '../../store/actions/loginPage';
import { requestLogin as requestLoginAction } from '../../store/actions/users';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
// CSS
import s from './LoginForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    changeSection = (section) => {
        const {
            changeSectionLoginPage,
            clearMessages,
        } = this.props;
        clearMessages();
        changeSectionLoginPage({ curentSection: section });
    };

    handleSubmit = (e) => {
        const {
            requestLogin,
            dataSendingLoginPage,
        } = this.props;
        const {
            password,
            username,
        } = this.state;
        dataSendingLoginPage({ dataSending: true });
        requestLogin({ username, password });
        e.preventDefault();
    };

    handleInputChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        const { backMessages } = this.props;
        const {
            username,
            password,
        } = this.state;
        let dataBackValues = [];
        if (backMessages) {
            dataBackValues = backMessages;
        }


        return (
            <div className={`${s.loginForm} form`}>
                <form onSubmit={this.handleSubmit}>
                    <div className="statementsContainer">
                        {dataBackValues.map((val) => (
                            <p key={val.type} className={`statement ${val.type}`}>
                                <Icon>error</Icon>
                                {Parser(val.message)}
                            </p>
                        ))}
                    </div>
                    <TextField
                        required
                        id="login"
                        label={<Lang>locals.users.login.labelLogin</Lang>}
                        autoComplete="username"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="username"
                        onChange={this.handleInputChange}
                        type="email"
                        value={username}
                    />
                    <br />
                    <TextField
                        required
                        type="password"
                        id="password"
                        label={<Lang>locals.users.login.labelPassword</Lang>}
                        autoComplete="current-password"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                        }}
                        name="password"
                        onChange={this.handleInputChange}
                        value={password}
                    />
                    <div className={s.buttonPlace}>
                        <Button
                            className="buttonWhite"
                            data-section="registerForm"
                            onClick={() => this.changeSection('registerForm')}
                        >
                            <Lang>locals.users.register.createaccount</Lang>
                        </Button>
                        <Button className="button" type="submit"><Lang>locals.users.login.login</Lang></Button>
                    </div>
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    requestLogin: PropTypes.func.isRequired,
    changeSectionLoginPage: PropTypes.func.isRequired,
    dataSendingLoginPage: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
};

LoginForm.defaultProps = {
    backMessages: null,
};


const mapStateToProps = (state) => ({
    user: state.users.user,
    backMessages: state.backMessages.messages,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    requestLogin: requestLoginAction,
    changeSectionLoginPage: changeSectionLoginPageAction,
    dataSendingLoginPage: dataSendingLoginPageAction,
    clearMessages: clearMessagesAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
