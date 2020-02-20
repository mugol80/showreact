import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import {
    changeSectionLoginPage as changeSectionLoginPageAction,
    dataSendingLoginPage as dataSendingLoginPageAction,
} from '../../store/actions/loginPage';
import { sendPasswordForm as sendPasswordFormAction } from '../../store/actions/users';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
// CSS
import s from './AskPasswordForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class AskPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
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
            dataSendingLoginPage,
            sendPasswordForm,
        } = this.props;
        const { username } = this.state;
        dataSendingLoginPage({ dataSending: true });
        sendPasswordForm({ username });
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
        const { username } = this.state;
        let dataBackValues = [];
        if (backMessages) {
            dataBackValues = backMessages;
        }

        return (
            <div className={`${s.loginForm} form`}>
                <form onSubmit={this.handleSubmit}>
                    <h1><Lang>locals.users.askpassword.resetpassword</Lang></h1>
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
                        required
                        id="login"
                        label={<Lang>locals.users.askpassword.yourlogin</Lang>}
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
                    <div className={s.buttonPlace}>
                        <Button
                            className="buttonWhite"
                            onClick={() => this.changeSection('loginForm')}
                        >
                            <Lang>locals.users.askpassword.backtologin</Lang>
                        </Button>
                        <Button className="button" type="submit"><Lang>locals.users.askpassword.send</Lang></Button>
                    </div>
                </form>
            </div>
        );
    }
}


AskPasswordForm.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    sendPasswordForm: PropTypes.func.isRequired,
    changeSectionLoginPage: PropTypes.func.isRequired,
    dataSendingLoginPage: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
};

AskPasswordForm.defaultProps = {
    backMessages: null,
};


const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    sendPasswordForm: sendPasswordFormAction,
    changeSectionLoginPage: changeSectionLoginPageAction,
    dataSendingLoginPage: dataSendingLoginPageAction,
    clearMessages: clearMessagesAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AskPasswordForm);
