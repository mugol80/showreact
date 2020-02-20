import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { createMuiTheme, LinearProgress, MuiThemeProvider } from '@material-ui/core';

import { requestCurrentUser as requestCurrentUserAction } from './store/actions/users';

import LoginPage from './components/LoginPage/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';

import './global.css';
import './App.scss';


const theme = createMuiTheme({
    typography: {
        fontFamily: 'UnitOffcPro, Arial, Verdana, sans-serif',
    },
});

class AppComponent extends React.Component {
    componentDidMount() {
        const { requestCurrentUser } = this.props;
        requestCurrentUser();
    }

    render() {
        const {
            preLoading: preLoadingProps,
            isLoginIn,
            dashboardIsMounted,
        } = this.props;
        let preloader = '';
        if (preLoadingProps) {
            preloader = (
                <div className="preloaderProgressBarcontainer preloader"><LinearProgress className="preloaderProgressBar" /></div>
            );
        }

        const $routeDash = <Route exact path="/*" component={Dashboard} />;
        const $routeLog = <Route exact path="/*" component={LoginPage} />;
        return (
            <MuiThemeProvider theme={theme}>
                <div className="app">
                    <HashRouter>
                        {isLoginIn || dashboardIsMounted ? $routeDash : $routeLog}
                    </HashRouter>
                    {preloader}
                </div>
            </MuiThemeProvider>
        );
    }
}

AppComponent.propTypes = {
    isLoginIn: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    preLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    dashboardIsMounted: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    requestCurrentUser: PropTypes.func.isRequired,
};

AppComponent.defaultProps = {
    isLoginIn: false,
    preLoading: false,
    dashboardIsMounted: false,
};

const mapStateToProps = (state) => ({
    user: state.users.user,
    isLoginIn: state.users.isLoginIn,
    preLoading: state.users.preloading,
    dashboardIsMounted: state.dashboard.isMounted,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    requestCurrentUser: requestCurrentUserAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
