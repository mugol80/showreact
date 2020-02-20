import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Button,
    CircularProgress,
    Fab,
    Grid,
    Icon,
    LinearProgress,
    Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import {
    changeSectionLoginPage as changeSectionLoginPageAction,
    dataSendingLoginPage as dataSendingLoginPageAction,
    setPartnerId as setPartnerIdAction,
} from '../../store/actions/loginPage';
import {
    getContents as getContentsAction,
    setInProgress as setInProgressAction,
} from '../../store/actions/contents';
// COMPONENTS/CONTAINERS
import LoginForm from '../../containers/LoginForm/LoginForm';
import RegisterForm from '../../containers/RegisterForm/RegisterForm';
import AskPasswordForm from '../../containers/AskPasswordForm/AskPasswordForm';
import RegisterFormMessage from '../../containers/RegisterForm/RegisterFormMessage';
import NoPartnerId from '../../containers/RegisterForm/NoPartnerId';
import AlertDialog from '../../containers/AlertDialog/AlertDialog';
// CSS
import s from './LoginPage.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';
// RESOURCES
import logoSmall from '../../images/GN-small.png';

class LoginPage extends React.Component {
    componentWillUnmount() {
        const {
            getContents,
            setInProgress,
        } = this.props;
        setInProgress({ inProgress: true });
        getContents();
    }

    changeSection = (section) => {
        const { changeSectionLoginPage } = this.props;
        changeSectionLoginPage({ curentSection: section });
    };

    render() {
        const { loginPage } = this.props;
        let circularProgress = '';
        let linearProgress = '';
        let icon = 'https';
        let section = <LoginForm />;
        let remindPassword = '';

        if (loginPage.dataSending) {
            circularProgress = <CircularProgress size={56} thickness={2} />;
            linearProgress = (
                <div
                    className={`progressBarcontainer ${s.progressBarcontainer}`}
                >
                    <LinearProgress className={s.progressBar} />
                </div>
            );
        }

        switch (loginPage.curentSection) {
            case 'loginForm':
                section = <LoginForm />;
                remindPassword = (
                    <p
                        className={s.forgottenPassword}
                    >
                        <Button
                            className="buttonGray"
                            disableFocusRipple
                            disableRipple
                            onClick={() => this.changeSection('askPasswordForm')}
                        >
                            <Lang>locals.users.askpassword.passwordForgotten</Lang>
                            {' '}
                            <Icon className={s.small}>enhanced_encryption</Icon>
                        </Button>
                    </p>
                );
                icon = 'https';
                break;
            case 'registerForm':
                section = <RegisterForm />;
                if (!loginPage.partnerId) {
                    section = <NoPartnerId />;
                }
                remindPassword = '';
                icon = 'add_circle';
                break;
            case 'askPasswordForm':
                section = <AskPasswordForm />;
                remindPassword = '';
                icon = 'enhanced_encryption';
                break;
            case 'registerFormMessage':
                section = <RegisterFormMessage />;
                remindPassword = '';
                icon = 'enhanced_encryption';
                break;
            default:
                return false;
        }
        return (
            <div className="screenCenter">
                <div className={s.loginPage}>
                    <Paper className={s.paper} elevation={24}>
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
                                    <img src={logoSmall} alt="" />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <section>
                                    {section}
                                </section>
                            </Grid>
                        </Grid>
                    </Paper>
                    {remindPassword}
                </div>
                <AlertDialog />
            </div>
        );
    }
}


LoginPage.propTypes = {
    loginPage: PropTypes.shape({
        curentSection: PropTypes.string,
        partnerIdCeche: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        dataSending: PropTypes.bool,
        partnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    }),
    changeSectionLoginPage: PropTypes.func.isRequired,
    getContents: PropTypes.func.isRequired,
    setInProgress: PropTypes.func.isRequired,
};

LoginPage.defaultProps = {
    loginPage: {},
};

const mapStateToProps = (state) => ({
    loginPage: state.loginPage,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    changeSectionLoginPage: changeSectionLoginPageAction,
    dataSendingLoginPage: dataSendingLoginPageAction,
    setPartnerId: setPartnerIdAction,
    getContents: getContentsAction,
    setInProgress: setInProgressAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
