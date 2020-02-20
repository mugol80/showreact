import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Link,
    NavLink,
    Route,
} from 'react-router-dom';
import {
    Drawer,
    Icon,
    LinearProgress,
    List,
    ListItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';

// ACTIONS
import {
    setMounted as setMountedAction,
    showProgressBar as showProgressBarAction,
} from '../../store/actions/dashboard';
import {
    logOutUser as logOutUserAction,
} from '../../store/actions/users';
import {
    getFairsList as getFairsListAction,
    saveFair as saveFairAction,
    setInProgress as setInProgressAction,
    setSettingValue as setSettingValueAction,
} from '../../store/actions/settings';
import {
    setIndexDB as setIndexDBAction,
} from '../../store/actions/appStatus';
// COMPONENTS/CONTAINERS
import MainPage from '../../containers/MainPage/MainPage';
import NewLead from '../../containers/NewLeadForm/NewLead';
import accountForm from '../../containers/AccountForm/AccountForm';
import contentPage from '../../containers/ContentPage/ContentPage';
import MyLeadPage from '../../containers/MyLeadPage/MyLeadPage';
import AllLeadsPage from '../../containers/AllLeadsPage/AllLeadsPage';
import AlertDialog from '../../containers/AlertDialog/AlertDialog';
import AlertDialogLoginForm from '../../containers/AlertDialogLoginForm/AlertDialogLoginForm';
import Settings from '../../containers/Settings/Settings';
import IfOffLineMsg from '../IfOffLineMsg/IfOffLineMsg';
import StoredLeads from '../../containers/StoredLeads/StoredLeads';
// HELPERS
import {
    getUrlParamId,
    rmUrlParams,
} from '../../helpers/url';

import IndexDBSales from '../../helpers/indexDB';
// CSS
import s from './Dashboard.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';
// RESOURCES
import logo from '../../images/logo.png';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftMenu: false,
        };
    }

    componentDidMount() {
        const {
            setMounted,
            setIndexDB,
        } = this.props;
        setMounted({ isMounted: true });
        this.setSettingValue();

        const indexDB = new IndexDBSales();
        indexDB.openDatabase().then(() => {
            setIndexDB({ indexDB });
        }).catch(() => {
            console.log('DB error');
        });
    }

    componentWillUnmount() {
        const { setMounted } = this.props;
        setMounted({ isMounted: false });
    }

    setSettingValue() {
        const {
            setSettingValue,
            user,
            getFairsList,
            setInProgress,
        } = this.props;
        const paramToRemove = {};
        const sourceId = 23;

        const campaignId = getUrlParamId('campaign_id');
        if (campaignId) {
            setSettingValue({ name: 'campaign_id', value: campaignId });
            paramToRemove.campaign_id = campaignId;
        }

        // GET INFOFROM USER DATA
        if (user.gn_sales_default_campaign !== false) {
            // if we set campaign_id we need set default value for source_id too
            setSettingValue({
                name: 'source_id',
                value: sourceId,
            });
            setSettingValue({
                name: 'campaign_id',
                value: user.gn_sales_default_campaign ? user.gn_sales_default_campaign[0] : false,
            });
        }
        setInProgress({ id: 'getFairsList', action: 'add' });
        getFairsList();

        if (campaignId) {
            rmUrlParams(paramToRemove);
        }
    }

    settingWindow(e) {
        e.preventDefault();
        const { setSettingValue } = this.props;
        setSettingValue({ name: 'showSettingWindow', value: true });
    }

    toggleDrawer = (menu, open) => () => {
        this.setState({
            [menu]: open,
        });
    };

    logOut = () => {
        const {
            setMounted,
            logOutUser,
            showProgressBar,
        } = this.props;
        showProgressBar({ showProgressBar: true });
        setMounted({ isMounted: false });
        logOutUser({});
    };

    render() {
        const {
            user,
            dashboard,
            settings,
        } = this.props;
        const {
            leftMenu,
        } = this.state;
        let loadingClassName = '';
        let linearProgress = '';

        if (dashboard.showProgressBar) {
            loadingClassName = 'loadingInProgress';
            linearProgress = (
                <div className={`progressBarcontainer ${s.fullSideProgressBarcontainer}`}>
                    <LinearProgress
                        className={s.progressBar}
                    />
                </div>
            );
        }


        let routeAllLeads = '';
        let menuAllLeads = '';

        if (user && user.gn_sales_manager) {
            routeAllLeads = <Route exact path="/allleads" component={AllLeadsPage} />;
            menuAllLeads = (
                <ListItem className={s.fullMenuListLi}>
                    <NavLink
                        to="/allleads"
                        activeClassName={s.active}
                    >
                        <Icon>supervised_user_circle</Icon>
                        <Lang>locals.dashboard.menu.allleads</Lang>
                    </NavLink>
                </ListItem>
            );
        }

        return (
            <div className={loadingClassName}>
                <div className={s.dashboard}>
                    <div className={s.menuContainer}>
                        <div className={s.logoContainer}>
                            <Link href="/" to="/">
                                <img
                                    src={logo}
                                    alt=""
                                />
                            </Link>
                        </div>
                        <div
                            className={s.menuButtonContainer}
                            onClick={this.toggleDrawer('leftMenu', true)}
                            role="presentation"
                        >
                            <Icon className={s.menuButton}>menu</Icon>
                        </div>
                        <div className={s.iconConatiner}>
                            <IfOffLineMsg />
                            <StoredLeads />
                        </div>
                    </div>
                    <div className={s.contentContainer}>
                        <Route exact path="/" component={MainPage} />
                        <Route exact path="/newlead" component={NewLead} />
                        <Route exact path="/account" component={accountForm} />
                        <Route exact path="/contents" component={contentPage} />
                        <Route exact path="/myleads" component={MyLeadPage} />
                        {routeAllLeads}
                    </div>
                </div>

                <Drawer
                    className="fullMenu"
                    classes={{ paperAnchorRight: s.fullMenuListContainer }}
                    anchor="right"
                    open={leftMenu}
                    onClose={this.toggleDrawer('leftMenu', false)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('leftMenu', false)}
                        onKeyDown={this.toggleDrawer('leftMenu', false)}
                    >
                        <div>

                            <List className={s.fullMenuList} component="nav">
                                <ListItem className={s.fullMenuListLi}>
                                    <NavLink
                                        to="/"
                                        exact
                                        activeClassName={s.active}
                                    >
                                        <Icon>apps</Icon>
                                        <Lang>locals.dashboard.menu.home</Lang>
                                    </NavLink>
                                </ListItem>
                                <ListItem className={s.fullMenuListLi}>
                                    <NavLink
                                        to="/contents"
                                        activeClassName={s.active}
                                    >
                                        <Icon>view_list</Icon>
                                        <Lang>locals.dashboard.menu.yourcontents</Lang>
                                    </NavLink>
                                </ListItem>
                                <ListItem className={s.fullMenuListLi}>
                                    <NavLink
                                        to="/myleads"
                                        activeClassName={s.active}
                                    >
                                        <Icon>reorder</Icon>
                                        <Lang>locals.dashboard.menu.myleads</Lang>
                                    </NavLink>
                                </ListItem>
                                {menuAllLeads}
                                <ListItem className={s.fullMenuListLi}>
                                    <NavLink
                                        to="/newlead"
                                        activeClassName={s.active}
                                    >
                                        <Icon>add_circle</Icon>
                                        <Lang>locals.dashboard.menu.addlead</Lang>
                                    </NavLink>
                                </ListItem>
                            </List>

                            <List className={`${s.fullMenuList} ${s.personMenu}`} component="nav">
                                <ListItem className={s.fullMenuListLi}>
                                    <NavLink
                                        to="/account"
                                        activeClassName={s.active}
                                    >
                                        <Icon>face</Icon>
                                        <Lang>locals.dashboard.menu.youraccount</Lang>
                                    </NavLink>
                                </ListItem>
                                {
                                    settings.settingForUserActive
                                    && (
                                        <ListItem className={s.fullMenuListLi}>
                                            <NavLink
                                                to="/settings"
                                                onClick={(e) => this.settingWindow(e)}
                                            >
                                                <Icon>settings</Icon>
                                                <Lang>locals.settings.settingsWindowTitle</Lang>
                                            </NavLink>
                                        </ListItem>
                                    )
                                }
                                <ListItem className={s.fullMenuListLi}>
                                    <NavLink
                                        to="#"
                                        onClick={() => this.logOut()}
                                    >
                                        <Icon>exit_to_app</Icon>
                                        <Lang>locals.dashboard.menu.logout</Lang>
                                    </NavLink>
                                </ListItem>
                            </List>
                        </div>
                    </div>
                </Drawer>
                {linearProgress}
                <div className={s.background} />
                <AlertDialog />
                <AlertDialogLoginForm />
                <Settings />
            </div>
        );
    }
}

Dashboard.propTypes = {
    showProgressBar: PropTypes.func.isRequired,
    setMounted: PropTypes.func.isRequired,
    logOutUser: PropTypes.func.isRequired,
    setSettingValue: PropTypes.func.isRequired,
    getFairsList: PropTypes.func.isRequired,
    setInProgress: PropTypes.func.isRequired,
    dashboard: PropTypes.shape({
        showProgressBar: PropTypes.bool,
    }),
    settings: PropTypes.shape({
        inProgress: PropTypes.array,
        settingForUserActive: PropTypes.bool,
        showSettingWindow: PropTypes.bool,
        source_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        sourceList: PropTypes.array,
        sourceFixed: PropTypes.bool,
        campaign_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        campaignList: PropTypes.array,
        campaignFixed: PropTypes.bool,
    }),
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.shape({})]),
    setIndexDB: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
    dashboard: {
        showProgressBar: false,
    },
    settings: {
        inProgress: [],
        settingForUserActive: true,
        showSettingWindow: false,
        source_id: false,
        sourceList: [], // we not use in this moment
        sourceFixed: false,
        campaign_id: false,
        campaignList: [],
        campaignFixed: false,
    },
    user: null,
};

const mapStateToProps = (state) => ({
    dashboard: state.dashboard,
    user: state.users.user,
    isMounted: state.dashboard.isMounted,
    settings: state.settings,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    showProgressBar: showProgressBarAction,
    setMounted: setMountedAction,
    logOutUser: logOutUserAction,
    setSettingValue: setSettingValueAction,
    getFairsList: getFairsListAction,
    setInProgress: setInProgressAction,
    saveFair: saveFairAction,
    setIndexDB: setIndexDBAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
