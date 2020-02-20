import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    CircularProgress,
    Dialog,
    Fab,
    Grid,
    Icon,
    LinearProgress,
    TextField,
} from '@material-ui/core';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';

import s from './AlertDialogLoginForm.scss';

import { requestLogin as requestLoginAction } from '../../store/actions/users';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
import { dataSendingLoginPage as dataSendingLoginPageAction } from '../../store/actions/loginPage';

import Lang from '../../hoc/Lang/Lang';

// RESOURCES
import logo from '../../images/GN-small.png';

class AlertDialogLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

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

    handleInputChange(e) {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        const {
            isLoginIn,
            backMessages,
            dataSending,
        } = this.props;
        const {
            username,
            password,
        } = this.state;
        let circularProgress = '';
        let linearProgress = '';
        const icon = 'https';
        let dataBackValues = [];

        if (dataSending) {
            circularProgress = <CircularProgress size={56} thickness={2} />;
            linearProgress = (
                <div
                    className={`progressBarcontainer ${s.progressBarcontainer}`}
                >
                    <LinearProgress className={s.progressBar} />
                </div>
            );
        }

        if (backMessages) {
            dataBackValues = backMessages;
        }

        return (
            <div>
                <Dialog
                    open={!isLoginIn}
                    disableBackdropClick
                    disableEscapeKeyDown
                    classes={{ paper: s.paper }}
                >
                    <Fab className={`asIcon ${s.asIcon}`} disableFocusRipple disableRipple>
                        <Icon>
                            {icon}
                        </Icon>
                        {circularProgress}
                    </Fab>
                    {linearProgress}
                    <Grid container spacing={8} alignContent="center" alignItems="center">
                        <Grid className={s.gnimage} item xs={12} sm={4}>

                            <div className={s.logoContainer}>
                                <img src={logo} alt="" />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <section>
                                <div className={`${s.loginForm} form`}>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="statementsContainer">
                                            {dataBackValues.map((val) => (
                                                <p
                                                    key={val.type}
                                                    className={`statement ${val.type}`}
                                                >
                                                    <Icon>error</Icon>
                                                    {' '}
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
                                            <Button className="button" type="submit"><Lang>locals.users.login.login</Lang></Button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </Grid>
                    </Grid>


                </Dialog>
            </div>
        );
    }
}

AlertDialogLoginForm.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array, PropTypes.shape({})]),
    requestLogin: PropTypes.func.isRequired,
    dataSendingLoginPage: PropTypes.func.isRequired,
    isLoginIn: PropTypes.bool,
    dataSending: PropTypes.bool,
};

AlertDialogLoginForm.defaultProps = {
    backMessages: null,
    isLoginIn: false,
    dataSending: false,
};

const mapStateToProps = (state) => ({
    isLoginIn: state.users.isLoginIn,
    backMessages: state.backMessages.messages,
    dataSending: state.loginPage.dataSending,
    isMounted: state.dashboard.isMounted,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    requestLogin: requestLoginAction,
    clearMessages: clearMessagesAction,
    dataSendingLoginPage: dataSendingLoginPageAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialogLoginForm);
