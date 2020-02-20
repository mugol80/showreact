import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    Icon,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import { changeSectionLoginPage as changeSectionLoginPageAction } from '../../store/actions/loginPage';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
// CSS
import s from './RegisterForm.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';


class RegisterFormMessage extends React.Component {
    changeSection = (section) => {
        const {
            changeSectionLoginPage,
            clearMessages,
        } = this.props;
        clearMessages();
        changeSectionLoginPage({ curentSection: section });
    };

    render() {
        const { backMessages } = this.props;
        let dataBackValues = [];
        if (backMessages) {
            dataBackValues = backMessages;
        }

        return (
            <div className="registerForm">
                <div className="statementsContainer">
                    {dataBackValues.map((val) => (
                        <p key={val.type} className={`statement ${val.type}`}>
                            <Icon>{val.icon}</Icon>
                            {val.message}
                        </p>
                    ))}
                </div>

                <div className={s.buttonPlace}>

                    <Button
                        className="button"
                        onClick={() => this.changeSection('loginForm')}
                    >
                        <Lang>locals.users.askpassword.backtologin</Lang>
                    </Button>
                </div>
            </div>
        );
    }
}


RegisterFormMessage.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array, PropTypes.shape({})]),
    clearMessages: PropTypes.func.isRequired,
    changeSectionLoginPage: PropTypes.func.isRequired,
};

RegisterFormMessage.defaultProps = {
    backMessages: null,
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    changeSectionLoginPage: changeSectionLoginPageAction,
    clearMessages: clearMessagesAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterFormMessage);
