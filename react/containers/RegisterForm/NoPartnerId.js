/* eslint-disable react/no-did-mount-set-state */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, TextField } from '@material-ui/core/';
import PropTypes from 'prop-types';
// ACTIONS
import {
    changeSectionLoginPage as changeSectionLoginPageAction,
    dataSendingLoginPage as dataSendingLoginPageAction,
} from '../../store/actions/loginPage';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
import { sendPartnerIdForm as sendPartnerIdFormAction } from '../../store/actions/users';
// HELPERS
import { getPartnerId } from '../../helpers/validateForm';
// CSS
import './RegisterForm.scss';
import s from '../AskPasswordForm/AskPasswordForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class NoPartnerId extends React.Component {
    static cutString(string, nr) {
        const clearString = string.replace(/[^0-9]/gi, '').trim();

        const long = clearString.length;
        let newString = clearString;
        if (long >= nr) {
            newString = clearString.substr(0, nr);
        }
        return newString;
    }

    constructor(props) {
        super(props);
        this.state = {
            partnerid: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        const { loginPage, dataSendingLoginPage, sendPartnerIdForm } = this.props;
        const { partnerid } = this.state;

        const partnerIdFromUrl = getPartnerId();

        if (partnerIdFromUrl) {
            dataSendingLoginPage({ dataSending: true });
            this.setState({
                partnerid: partnerIdFromUrl,
            }, () => {
                sendPartnerIdForm({ partnerId: partnerid });
            });
        } else {
            this.setState({
                partnerid: loginPage.partnerIdCeche,
            });
        }
    }

    componentWillUnmount() {
        const { clearMessages } = this.props;

        clearMessages();
    }

    changeSection = (section) => {
        const { changeSectionLoginPage } = this.props;

        changeSectionLoginPage({
            curentSection: section,
        });
    };

    handleSubmit = (e) => {
        const { sendPartnerIdForm, dataSendingLoginPage } = this.props;
        const { partnerid } = this.state;

        dataSendingLoginPage({ dataSending: true });
        sendPartnerIdForm({ partnerId: partnerid });

        e.preventDefault();
    };

    handleInputChange(event) {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        const { name } = target;
        this.setState({
            [name]: this.constructor.cutString(value, 10),
        });
    }

    render() {
        const { backMessages } = this.props;
        const { partnerid } = this.state;

        let dataBackValues = [];

        if (backMessages) {
            dataBackValues = backMessages;
        }

        return (
            <div className={`${s.loginForm} form`}>
                <form onSubmit={this.handleSubmit}>
                    <h1><Lang>locals.users.askpassword.youridpartnerkey</Lang></h1>
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
                        type="text"
                        required
                        id="partnerid"
                        label="Partner id"
                        margin="normal"
                        fullWidth
                        InputProps={{
                            disableUnderline: false,
                            maxLength: 10,
                            pattern: '[0-9]*',
                        }}
                        InputLabelProps={{
                            className: 'textFieldFormLabel',
                        }}
                        name="partnerid"
                        onChange={this.handleInputChange}
                        value={partnerid}
                    />
                    <div className={s.buttonPlace}>
                        <Button
                            className="buttonWhite"
                            onClick={() => this.changeSection('loginForm')}
                        >
                            <Lang>locals.users.askpassword.backtologin</Lang>
                        </Button>
                        <Button className="button" type="submit"><Lang>locals.users.askpassword.next</Lang></Button>
                    </div>
                </form>
            </div>


        );
    }
}

NoPartnerId.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array]),
    sendPartnerIdForm: PropTypes.func.isRequired,
    changeSectionLoginPage: PropTypes.func.isRequired,
    dataSendingLoginPage: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
    loginPage: PropTypes.shape({
        partnerIdCeche: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    }),
};

NoPartnerId.defaultProps = {
    backMessages: null,
    loginPage: {},
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    loginPage: state.loginPage,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    sendPartnerIdForm: sendPartnerIdFormAction,
    changeSectionLoginPage: changeSectionLoginPageAction,
    dataSendingLoginPage: dataSendingLoginPageAction,
    clearMessages: clearMessagesAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NoPartnerId);
