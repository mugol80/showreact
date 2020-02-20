import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    CircularProgress,
    Dialog,
    DialogTitle,
    Drawer,
    Icon,
    IconButton,
    LinearProgress,
    Toolbar,
    Tooltip,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { cloneDeep } from 'lodash';
// COMPONENTS/CONTAINERS
import GoogleMaps from '../GoogleMaps/GoogleMaps';
import ShowLeadLayout from '../../components/InfoRenderer/ShowLeadLayout';
// ACTIONS
import {
    getLeadsList as getLeadsListAction,
    setLeadIsAsk as setLeadIsAskAction,
    setLeadIsSave as setLeadIsSaveAction,
    setLeadsAsking as setLeadsAskingAction,
    setLeadsSaveing as setLeadsSaveingAction,
    setLeadToAsk as setLeadToAskAction,
    setLeadToSave as setLeadToSaveAction,
    workInProgressLeadOnMap as workInProgressLeadOnMapAction,
} from '../../store/actions/leadOnMap';
import {
    addressGeocoding as addressGeocodingAction,
    addressGeocodingOnce as addressGeocodingOnceAction,
} from '../../store/actions/googleMaps';
import { saveLead as saveLeadAction } from '../../store/actions/lead';
// CSS
import s from './LeadOnMap.scss';
import Lang from '../../hoc/Lang/Lang';

class LeadOnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoDialogOpen: false,
            mapDialogOpen: false,
            showLeadInfo: false,
            googleMapsShowMoreValue: {},
        };
    }

    componentDidMount() {
        const {
            getLeadsList,
            modelName,
            uuid,
        } = this.props;
        let { urlConfig } = this.props;
        urlConfig = cloneDeep(urlConfig);
        urlConfig.additionalParams.push({ key: 'noimages', value: 'true' });
        getLeadsList({
            modelName,
            urlConfig,
            page: 0,
            rowsPerPage: 99999,
            uuid,
        });
    }

    handleMapOpen = () => {
        this.setState({ mapDialogOpen: true });
        return false;
    };

    handleMapClose = () => {
        const { workInProgress } = this.props;
        if (workInProgress) {
            return false;
        }
        this.setState({ mapDialogOpen: false });
        return true;
    };

    handleInfoOpen = () => {
        this.setState({ infoDialogOpen: true });
        return false;
    };

    handleInfoClose = () => {
        const { workInProgress } = this.props;
        if (workInProgress) {
            return false;
        }
        this.setState({ infoDialogOpen: false });
        return true;
    };

    toggleDrawer = (menu, open) => () => {
        this.setState({
            [menu]: open,
        });
    };

    markerClick = (e) => {
        this.setState({
            googleMapsShowMoreValue: e.data,
        }, () => {
            this.setState({
                showLeadInfo: true,
            });
        });
    };

    askAboutMarkers = (e) => {
        if (e) {
            e.preventDefault();
        }
        const {
            setLeadsAsking,
            workInProgressLeadOnMap,
            uuid,
        } = this.props;
        setLeadsAsking({ uuid, leadsIsAsking: true });
        workInProgressLeadOnMap({ uuid, workInProgress: true });

        setTimeout(() => {
            this.timer = setInterval(() => {
                this.askAboutMarkersTimer();
            }, 1000);
        }, 500);
        return false;
    };

    askAboutMarkersTimer = () => {
        const {
            leadsIsAsking,
            setLeadIsAsk,
            leadsInAsking,
            setLeadToAsk,
            uuid,
            leadsToAsk,
        } = this.props;
        if (leadsToAsk.length === 0 || !leadsIsAsking) {
            clearInterval(this.timer);
            return false;
        }

        setLeadToAsk({ uuid });
        for (let i = 0; i < leadsInAsking.length; i++) {
            if (!leadsInAsking[i].asking) {
                setLeadIsAsk({ uuid, id: leadsInAsking[i].lead.id, asking: true });
                this.askAboutMarker(leadsInAsking[i].lead);
            }
        }
        return false;
    };

    askAboutMarker = (lead) => {
        const {
            addressGeocoding,
            uuid,
        } = this.props;
        const address = `${lead.street}, ${lead.zip}, ${lead.city}, ${lead.country_id[1]}`;
        addressGeocoding({ address, leadData: lead, uuid });
    };

    cancelAskAboutMarkers = () => {
        const {
            setLeadsAsking,
            uuid,
        } = this.props;
        setLeadsAsking({ uuid, leadsIsAsking: false });
    };

    saveMarkers = (e) => {
        if (e) {
            e.preventDefault();
        }
        const {
            setLeadsSaveing,
            workInProgressLeadOnMap,
            uuid,
        } = this.props;
        setLeadsSaveing({ uuid, leadsIsSaveing: true });
        workInProgressLeadOnMap({ uuid, workInProgress: true });

        setTimeout(() => {
            this.timer = setInterval(() => {
                this.saveMarkersTimer();
            }, 1000);
        }, 500);
        return false;
    };

    saveMarkersTimer = () => {
        const {
            leadsToSave,
            setLeadIsSave,
            uuid,
            setLeadToSave,
            leadsInSaveing,
            leadsIsSaveing,
        } = this.props;
        if (leadsToSave.length === 0 || !leadsIsSaveing) {
            clearInterval(this.timer);
            return false;
        }

        setLeadToSave({ uuid });
        for (let i = 0; i < leadsInSaveing.length; i++) {
            if (!leadsInSaveing[i].saveing) {
                setLeadIsSave({ uuid, id: leadsInSaveing[i].lead.id, saveing: true });
                this.saveMarker(leadsInSaveing[i].lead);
            }
        }
        return false;
    };

    saveMarker = (lead) => {
        const {
            modelName,
            saveLead,
            uuid,
        } = this.props;
        saveLead({
            id: lead.id,
            gn_temp_data_json: lead.gn_temp_data_json,
            gridUuid: uuid,
            fieldLabel: 'id',
            modelName,
        });
    };

    cancelSaveMarkers = () => {
        const {
            setLeadsSaveing,
            uuid,
        } = this.props;
        setLeadsSaveing({ uuid, leadsIsSaveing: false });
    };

    render() {
        const {
            loading,
            markers,
            leadsIsSaveing,
            leadsFields,
            mapTitle,
            workInProgress,
            googleMapsSetting,
            leadsToSave,
            leadsIsAsking,
            modelName,
            uuid,
            leadsToAsk,
            leadsNoAddressFound,
        } = this.props;
        const {
            mapDialogOpen,
            infoDialogOpen,
            showLeadInfo,
            googleMapsShowMoreValue,
        } = this.state;
        let circularProgress = '';
        let isInProgressClass = '';
        if (loading) {
            circularProgress = <CircularProgress size={30} classes={{ root: s.iconProgress }} className={s.iconProgress} thickness={2} />;
            ({ isInProgressClass } = s);
        }
        let showOnMapButton = '';
        if (loading || markers) {
            showOnMapButton = (
                <div>
                    <Tooltip title={E.Lang.translate('globals.grid.toolbar.showOnMap.tooltip')}>
                        <IconButton onClick={loading ? () => false : this.handleMapOpen}>
                            <i className={`${isInProgressClass} material-icons`}>
                                map
                            </i>
                            {circularProgress}
                        </IconButton>
                    </Tooltip>
                </div>
            );
        }

        let mapDialogInfo = '';
        if (leadsToAsk.length === 1) {
            mapDialogInfo = (
                <span className={s.mapDialogInfo}>
                    {leadsToAsk.length}
                    <Lang>globals.googlemaps.info.contactNotOnMap</Lang>
                </span>
            );
        }
        if (leadsToAsk.length > 1) {
            mapDialogInfo = (
                <span className={s.mapDialogInfo}>
                    {leadsToAsk.length}
                    <Lang>globals.googlemaps.info.contactsNotOnMap</Lang>
                </span>
            );
        }

        const mapDialog = (
            <Dialog
                fullScreen
                open={mapDialogOpen}
                onClose={this.handleMapClose}
                classes={{
                    root: s.rootDialog,
                    paper: s.paper,
                }}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    id="responsive-dialog-title"
                    classes={{
                        root: s.rootDialogTitle,
                    }}
                >
                    { mapTitle }
                    { mapDialogInfo }
                    <IconButton
                        className={s.iconButtonShowInfo}
                        onClick={!infoDialogOpen ? this.handleInfoOpen : this.handleInfoClose}
                        aria-label="Close"
                    >
                        <Icon>info</Icon>
                    </IconButton>
                    <IconButton className={s.iconButton} onClick={this.handleMapClose} aria-label="Close">
                        <Icon>close</Icon>
                    </IconButton>
                </DialogTitle>
                <div className={s.googleMapsContainer}>
                    <Drawer
                        className="moreInfo"
                        classes={{ paperAnchorRight: s.moreInfoContainer }}
                        anchor="right"
                        open={showLeadInfo}
                        onClose={this.toggleDrawer('showLeadInfo', false)}
                    >
                        <div>
                            <Toolbar className={s.rootDialogTitle}>
                                <h2>{googleMapsShowMoreValue.name}</h2>
                                <IconButton
                                    className={s.iconButton}
                                    onClick={this.toggleDrawer('showLeadInfo', false)}
                                    aria-label="Close"
                                >
                                    <Icon>close</Icon>
                                </IconButton>
                            </Toolbar>
                            <div className={s.layoutContainer}>
                                <ShowLeadLayout
                                    fieldsList={leadsFields ? leadsFields.LeadField : false}
                                    value={googleMapsShowMoreValue}
                                />
                            </div>
                        </div>
                    </Drawer>
                    <GoogleMaps
                        googleMapsSetting={googleMapsSetting}
                        clickFunction={this.markerClick}
                        uuid={uuid}
                        modelName={modelName}
                    />
                </div>
            </Dialog>
        );

        const addressOnMap = (
            <p>
                <Lang>globals.googlemaps.markersOnMap</Lang>
                :
                {markers.length}
            </p>
        );

        let addressToFind = '';
        if (leadsToAsk.length > 0) {
            addressToFind = (
                <p>
                    <Lang>globals.googlemaps.leadWithoutMarkers</Lang>
                    :
                    {leadsToAsk.length}
                    <button
                        type="button"
                        className={`${s.aslink} ${s.aslink__link}`}
                        onClick={this.askAboutMarkers}
                    >
                        <Lang>globals.googlemaps.findMarkers</Lang>
                    </button>
                </p>
            );
        }

        let addressToSave = '';
        if (leadsToSave.length > 0) {
            addressToSave = (
                <p>
                    <Lang>globals.googlemaps.foundMarkers</Lang>
                    :
                    {leadsToSave.length}
                    <button
                        type="button"
                        className={`${s.aslink} ${s.aslink__link}`}
                        onClick={this.saveMarkers}
                    >
                        <Lang>globals.googlemaps.saveMarkers</Lang>
                    </button>
                </p>
            );
        }

        let cantFindAddress = '';
        if (leadsNoAddressFound.length > 0) {
            cantFindAddress = (
                <p>
                    <Lang>globals.googlemaps.cantFindAddressTo</Lang>
                    {leadsNoAddressFound.length}
                </p>
            );
        }

        let linearProgress = '';
        let cencelSaveMarkersBtn = '';
        if (leadsIsSaveing) {
            cencelSaveMarkersBtn = (
                <button
                    type="button"
                    className={`${s.cancleBtn} ${s.aslink} ${s.aslink__link}`}
                    onClick={this.cancelSaveMarkers}
                >
                    Cancel
                </button>
            );
        }
        let cencelAskMarkersBtn = '';
        if (leadsIsAsking) {
            cencelAskMarkersBtn = (
                <button
                    type="button"
                    className={`${s.cancleBtn} ${s.aslink} ${s.aslink__link}`}
                    onClick={this.cancelAskAboutMarkers}
                >
                    Cancel
                </button>
            );
        }
        if (workInProgress) {
            linearProgress = (
                <div
                    className={`progressBarcontainer ${s.progressBarcontainer}`}
                >
                    <LinearProgress
                        className={s.progressBar}
                    />
                    {cencelSaveMarkersBtn}
                    {cencelAskMarkersBtn}
                </div>
            );
        }

        const infoDialogWindow = (
            <Dialog
                fullWidth
                maxWidth="md"
                open={infoDialogOpen}
                onClose={this.handleInfoClose}
                classes={{
                    root: s.rootDialog,
                    paper: s.paper,
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    classes={{
                        root: s.rootDialogTitle,
                    }}
                >
                    <Lang>globals.googlemaps.mapInformation</Lang>
                </DialogTitle>
                <div className={s.moreInfoTxt}>
                    {linearProgress}
                    {addressOnMap}
                    {addressToFind}
                    {addressToSave}
                    {cantFindAddress}
                </div>
            </Dialog>
        );

        return (
            <div>
                {showOnMapButton}
                {mapDialog}
                {infoDialogWindow}
            </div>
        );
    }
}

LeadOnMap.propTypes = {
    getLeadsList: PropTypes.func.isRequired,
    workInProgressLeadOnMap: PropTypes.func.isRequired,
    addressGeocoding: PropTypes.func.isRequired,
    saveLead: PropTypes.func.isRequired,
    leadsFields: PropTypes.shape({
        LeadField: PropTypes.shape({
            gn_company_type: PropTypes.shape({ selection: PropTypes.array }),
            gn_mod_campaign: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_franchise: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_timetracking: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_stock: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_presentation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_newsletter: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_homepage: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_marketing: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_menu: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_reservation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_calculation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_purchase: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_order: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_cashbook: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_loyalty: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_pos: PropTypes.shape({ string: PropTypes.string }),
        }),
    }),
    leadsNoAddressFound: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
    leadsToAsk: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
    leadsToSave: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
    leadsInSaveing: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
    setLeadsSaveing: PropTypes.func.isRequired,
    setLeadToSave: PropTypes.func.isRequired,
    markers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
    googleMapsSetting: PropTypes.shape({}),
    loading: PropTypes.bool,
    leadsIsSaveing: PropTypes.bool,
    workInProgress: PropTypes.bool,
    uuid: PropTypes.string.isRequired,
    modelName: PropTypes.string.isRequired,
    urlConfig: PropTypes.shape({
        additionalParams: PropTypes.array,
    }).isRequired,
    mapTitle: PropTypes.string,
    setLeadIsSave: PropTypes.func.isRequired,

    setLeadIsAsk: PropTypes.func.isRequired,
    leadsInAsking: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
    setLeadsAsking: PropTypes.func.isRequired,
    setLeadToAsk: PropTypes.func.isRequired,
    leadsIsAsking: PropTypes.bool,
};

LeadOnMap.defaultProps = {
    leadsFields: {
        LeadField: {},
    },
    workInProgress: false,
    leadsNoAddressFound: [],
    leadsToSave: [],
    leadsInSaveing: [],
    leadsToAsk: [],
    leadsInAsking: [],
    markers: [],
    googleMapsSetting: {},
    loading: true,
    leadsIsSaveing: false,
    leadsIsAsking: false,
    mapTitle: E.Lang.translate('locals.mainpage.boxlist.myleads'),
};


const mapStateToProps = (state, props) => ({
    leadsFields: state.newLead.fields,
    googleMapsSetting: (state.leadOnMap[props.uuid] || {}).googleMapsSetting,
    leadsToAsk: ((state.leadOnMap[props.uuid] || {}).leadsToAsk) || [],
    leadsToSave: ((state.leadOnMap[props.uuid] || {}).leadsToSave) || [],
    leadsInSaveing: ((state.leadOnMap[props.uuid] || {}).leadsInSaveing) || [],
    leadsSaveFail: ((state.leadOnMap[props.uuid] || {}).leadsSaveFail) || [],
    leadsNoAddressFound: ((state.leadOnMap[props.uuid] || {}).leadsNoAddressFound) || [],
    workInProgress: ((state.leadOnMap[props.uuid] || {}).workInProgress) || false,
    leadsIsSaveing: ((state.leadOnMap[props.uuid] || {}).leadsIsSaveing) || false,
    markers: ((state.leadOnMap[props.uuid] || {}).markers) || [],
    loading: (state.leadOnMap[props.uuid] || {}).loading,
    backMessages: state.backMessages.messages,
    leadsIsAsking: ((state.leadOnMap[props.uuid] || {}).leadsIsAsking) || false,
    leadsInAsking: ((state.leadOnMap[props.uuid] || {}).leadsInAsking) || [],
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    getLeadsList: getLeadsListAction,
    workInProgressLeadOnMap: workInProgressLeadOnMapAction,
    addressGeocodingOnce: addressGeocodingOnceAction,
    addressGeocoding: addressGeocodingAction,
    saveLead: saveLeadAction,
    setLeadsSaveing: setLeadsSaveingAction,
    setLeadToSave: setLeadToSaveAction,
    setLeadIsSave: setLeadIsSaveAction,
    setLeadsAsking: setLeadsAskingAction,
    setLeadToAsk: setLeadToAskAction,
    setLeadIsAsk: setLeadIsAskAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LeadOnMap);
