/* eslint camelcase: [0] */
/* eslint react/no-danger: [0] */

import { cloneDeep } from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import PropTypes from 'prop-types';
// ACTIONS
import { saveLead as saveLeadAction } from '../../store/actions/lead';
import { addressGeocodingOnce as addressGeocodingOnceAction } from '../../store/actions/googleMaps';
// Google Maps
import GoogleMaps from '../../containers/GoogleMaps/GoogleMaps';
// CSS
import s from './InfoRenderer.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';


class ShowLeadLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            saveMarkers: false,
            googleMapsSetting: {
                zoom: 14,
            },
            showMapContainer: false,
        };
    }

    componentDidMount() {
        const { isOpen } = this.props;
        if (isOpen) {
            this.setMarkerOnMap();
        }
    }

    setMarkerOnMap = () => {
        // here test if we have google maps info in props
        const { value } = this.props;
        const { googleMapsSetting } = this.state;
        if (Object.prototype.hasOwnProperty.call(value, 'gn_temp_data_json')) {
            if (Object.prototype.hasOwnProperty.call(value.gn_temp_data_json, 'googleMaps')) {
                this.setState({
                    googleMapsSetting: {
                        ...googleMapsSetting,
                        markers: cloneDeep(value.gn_temp_data_json.googleMaps.markers),
                        zoom: cloneDeep(value.gn_temp_data_json.googleMaps.zoom === undefined
                            ? 14 : value.gn_temp_data_json.googleMaps.zoom),
                    },
                });
                return;
            }
        }
        this.askAboutMarker();
    };

    showMarkerOnMap = (data) => {
        const { googleMapsSetting } = this.state;
        const markers = [];
        let saveMarkers = false;
        if (data.status === 'OK') {
            saveMarkers = true;

            for (let i = 0; i < data.results.length; i++) {
                const marker = {};
                marker.location = data.results[i].geometry.location;
                markers.push(marker);
            }

            this.setState({
                googleMapsSetting: {
                    ...googleMapsSetting,
                    markers,
                    showLoading: false,
                },
                saveMarkers,
            });
            return;
        }
        if (data.status === 'ZERO_RESULTS') {
            this.setState({
                googleMapsSetting: {
                    ...googleMapsSetting,
                    markers,
                    showLoading: false,
                },
                saveMarkers,
            });
        }
    };

    askAboutMarker = () => {
        const { addressGeocodingOnce, value } = this.props;
        const { googleMapsSetting } = this.state;
        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                showLoading: true,
            },
            saveMarkers: false,
        });

        const address = `${value.street}, ${value.zip}, ${value.city}, ${value.country_id[1]}`;
        addressGeocodingOnce({ address, callback: this.showMarkerOnMap });
    };

    addMarkerToMap = (mapProps, map, clickEvent) => {
        const { googleMapsSetting } = this.state;
        const markers = [];
        const marker = {};
        const latitude = clickEvent.latLng.lat();
        const longitude = clickEvent.latLng.lng();
        marker.location = { lat: latitude, lng: longitude };
        markers.push(marker);

        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                markers,
                showLoading: false,
            },
            saveMarkers: true,
        });
    };

    updateMarkerOnMap = (coord, idx, zoom) => {
        const { googleMapsSetting } = this.state;
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const marker = googleMapsSetting.markers[idx];
        marker.location = { lat, lng };
        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                zoom,
            },
            saveMarkers: true,
        });
    };

    saveLeadCallback = () => {
        const { googleMapsSetting } = this.state;
        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                showLoading: false,
            },
            saveMarkers: false,
        });
    };

    removeMarker = (props, marker, e, key) => {
        const { googleMapsSetting } = this.state;
        if (googleMapsSetting.markers.length > 1) {
            const markers = [];
            for (let i = 0; i < googleMapsSetting.markers.length; i++) {
                if (i !== key) {
                    markers.push(googleMapsSetting.markers[i]);
                }
            }

            this.setState({
                googleMapsSetting: {
                    ...googleMapsSetting,
                    markers,
                },
                saveMarkers: true,
            });
        }
    };

    showMapContainer = () => {
        this.setState({
            showMapContainer: true,
        });
    };

    saveMarkersPositions(e) {
        if (e) {
            e.preventDefault();
        }
        const {
            value,
            modelName,
            uuid,
            saveLead,
        } = this.props;
        const { googleMapsSetting } = this.state;
        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                showLoading: true,
            },
            saveMarkers: false,
        }, () => {
            const googleMaps = {
                ...value.gn_temp_data_json.googleMaps,
                markers: googleMapsSetting.markers,
                zoom: googleMapsSetting.zoom,
            };
            const gn_temp_data_json = {
                ...value.gn_temp_data_json,
                googleMaps,
            };
            saveLead({
                id: value.id,
                gn_temp_data_json,
                callback: this.saveLeadCallback,
                gridUuid: uuid,
                fieldLabel: 'id',
                modelName,
            });
        });

        return false;
    }

    render() {
        const {
            fieldsList,
            showgoogleMaps,
            value,
        } = this.props;
        const {
            saveMarkers,
            googleMapsSetting,
            showMapContainer,
        } = this.state;
        let modulesList = [];
        let modulesList2 = [];

        if (typeof fieldsList !== 'undefined') {
            modulesList = [
                [fieldsList.gn_mod_pos.string, value.gn_mod_pos],
                [fieldsList.gn_mod_loyalty.string, value.gn_mod_loyalty],
                [fieldsList.gn_mod_cashbook.string, value.gn_mod_cashbook],
                [fieldsList.gn_mod_order.string, value.gn_mod_order],
                [fieldsList.gn_mod_purchase.string, value.gn_mod_purchase],
                [fieldsList.gn_mod_calculation.string, value.gn_mod_calculation],
                [fieldsList.gn_mod_reservation.string, value.gn_mod_reservation],
                [fieldsList.gn_mod_menu.string, value.gn_mod_menu],

            ];

            modulesList2 = [
                [fieldsList.gn_mod_marketing.string, value.gn_mod_marketing],
                [fieldsList.gn_mod_homepage.string, value.gn_mod_homepage],
                [fieldsList.gn_mod_newsletter.string, value.gn_mod_newsletter],
                [fieldsList.gn_mod_presentation.string, value.gn_mod_presentation],
                [fieldsList.gn_mod_stock.string, value.gn_mod_stock],
                [fieldsList.gn_mod_timetracking.string, value.gn_mod_timetracking],
                [fieldsList.gn_mod_franchise.string, value.gn_mod_franchise],
                [fieldsList.gn_mod_campaign.string, value.gn_mod_campaign],

            ];
        }

        let description = '';
        if (value.description !== false) {
            description = (
                <div className={s.box}>
                    <h3>{E.Lang.translate('locals.newleadform.description')}</h3>
                    <div>
                        <p>
                            <span dangerouslySetInnerHTML={{ __html: value.description.replace(/\n/g, '<br />') }} />
                        </p>
                    </div>
                </div>
            );
        }

        let ocrPhotos = '';
        if (value.ocrPhotos !== false) {
            ocrPhotos = (
                <div className={s.box}>
                    <h3>Business card</h3>
                    <Grid container spacing={2} alignContent="center" alignItems="flex-start">
                        {value.ocrPhotos.map((img) => (
                            <Grid item sm={6} xs={12} key={img.id}>
                                <Table className={s.table}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <img
                                                    src={`data:image/png;base64,${img.datas}`}
                                                    alt={img.name}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            );
        }

        let googleMapsContainer = '';
        if (showgoogleMaps) {
            let saveMarkersBtn = '';
            if (saveMarkers) {
                saveMarkersBtn = (
                    <span
                        role="presentation"
                        className={s.saveMarkersBtn}
                        onClick={(e) => {
                            this.saveMarkersPositions(e);
                        }}
                    >
                        <i className="material-icons">
                            done
                        </i>
                    </span>
                );
            }

            const info = [];
            if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers')
                && googleMapsSetting.markers.length > 0
                && googleMapsSetting.markers.length < 2) {
                info.push(E.Lang.translate('globals.googlemaps.dragAndDropMarker'));
            }
            if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers')
                && googleMapsSetting.markers.length > 1) {
                info.push(E.Lang.translate('globals.googlemaps.clickMarkerToRemove'));
            }

            if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers')
                && googleMapsSetting.markers.length === 0) {
                info.push(E.Lang.translate('globals.googlemaps.clickMapToAddMarker'));
            }

            let googleMapsHideContainer = '';
            let hideMapContainerClass = '';
            if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers')
                && googleMapsSetting.markers.length === 0
                && !showMapContainer) {
                hideMapContainerClass = s.hidegoogleMapsContainer;
                googleMapsHideContainer = (
                    <div>
                        <div className={s.noMapInfo}>
                            <p><Lang>globals.googlemaps.cantFindAddress</Lang></p>
                            <br />
                            <span
                                className={s.addMarkerManually}
                                onClick={this.showMapContainer}
                                role="presentation"
                            >
                                <Lang>globals.googlemaps.clickMapToAddMarker</Lang>
                            </span>
                        </div>
                    </div>
                );
            }

            googleMapsContainer = (
                <div className={s.box}>
                    <h3>
                        <Lang>globals.googlemaps.lead.infoTitle</Lang>
                        {saveMarkersBtn}
                    </h3>
                    { googleMapsHideContainer }
                    <Grid container spacing={2} alignContent="center" alignItems="flex-start">
                        <div className={`${s.googleMapsContainer} ${hideMapContainerClass}`}>
                            <GoogleMaps
                                googleMapsSetting={googleMapsSetting}
                                isSetTimeout
                                draggableFunction={this.updateMarkerOnMap}
                                clickMapFunction={this.addMarkerToMap}
                                clickFunction={this.removeMarker}
                            />
                        </div>
                        <div className={`${s.googleMapsInfo} ${hideMapContainerClass}`}>
                            {info.map((infoTxt) => <p key={infoTxt}>{infoTxt}</p>)}
                        </div>
                    </Grid>
                </div>
            );
        }

        let lostReason = (
            <Table className={s.table}>
                <TableBody>
                    <TableRow>
                        <TableCell><Lang>locals.leadpage.tablecolumn.salesman</Lang></TableCell>
                        <TableCell>{value.user_id ? value.user_id[1] : ''}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Lang>locals.leadpage.tablecolumn.salesmanEmail</Lang></TableCell>
                        <TableCell>{value.user_email}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
        if (value.lost_reason !== false) {
            lostReason = (
                <Table className={s.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell><Lang>locals.leadpage.tablecolumn.salesman</Lang></TableCell>
                            <TableCell>{value.user_id ? value.user_id[1] : ''}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Lang>locals.leadpage.tablecolumn.salesmanEmail</Lang></TableCell>
                            <TableCell>{value.user_email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Lang>locals.leadpage.tablecolumn.lostreason</Lang></TableCell>
                            <TableCell>{value.lost_reason[1]}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }
        return (
            <div>
                <div className={s.box}>

                    <Grid container spacing={2} alignContent="center" alignItems="flex-start">
                        <Grid item sm={6} xs={12}>

                            <Table className={s.table}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.createdate</Lang></TableCell>
                                        <TableCell>{value.create_date}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.stage</Lang></TableCell>
                                        <TableCell>{value.stage_id ? value.stage_id[1] : ''}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.recommended</Lang></TableCell>
                                        <TableCell>{value.gn_provision_recommended ? value.gn_provision_recommended[1] : ''}</TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            {lostReason}

                        </Grid>
                    </Grid>
                </div>


                <div className={s.box}>

                    <Grid container spacing={2} alignContent="center" alignItems="flex-start">
                        <Grid item sm={6} xs={12}>

                            <Table className={s.table}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.company</Lang></TableCell>
                                        <TableCell>{value.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.name</Lang></TableCell>
                                        <TableCell>{value.contact_name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.phone</Lang></TableCell>
                                        <TableCell>{value.phone}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.email</Lang></TableCell>
                                        <TableCell>{value.email_from}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.newleadform.internalreference</Lang></TableCell>
                                        <TableCell>{value.gn_partner_internal_reference}</TableCell>
                                    </TableRow>


                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item sm={6} xs={12}>

                            <Table className={s.table}>
                                <TableBody>

                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.street</Lang></TableCell>
                                        <TableCell>{value.street}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.city</Lang></TableCell>
                                        <TableCell>{value.city}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.zip</Lang></TableCell>
                                        <TableCell>{value.zip}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><Lang>locals.leadpage.tablecolumn.country</Lang></TableCell>
                                        <TableCell>{value.country_id ? value.country_id[1] : ''}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </div>

                {googleMapsContainer}


                <div className={s.modules}>

                    <h3>Modules</h3>

                    <Grid container spacing={2} alignContent="center" alignItems="flex-start">
                        <Grid item sm={6} xs={12}>
                            <Table className={s.table}>
                                <TableBody>
                                    {modulesList.map((name) => (
                                        <TableRow key={name[0]}>
                                            <TableCell>{name[0]}</TableCell>
                                            <TableCell
                                                classes={{
                                                    root: s.rootTableCell,
                                                }}
                                            >
                                                <Checkbox
                                                    checked={name[1]}
                                                    disabled
                                                    classes={{
                                                        root: s.defaultCheckbox,
                                                        checked: s.checkedCheckbox,
                                                        disabled: s.disabledCheckbox,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Table className={s.table}>
                                <TableBody>
                                    {modulesList2.map((name) => (
                                        <TableRow key={name[0]}>
                                            <TableCell>{name[0]}</TableCell>
                                            <TableCell
                                                classes={{
                                                    root: s.rootTableCell,
                                                }}
                                            >
                                                <Checkbox
                                                    checked={name[1]}
                                                    disabled
                                                    classes={{
                                                        root: s.defaultCheckbox,
                                                        checked: s.checkedCheckbox,
                                                        disabled: s.disabledCheckbox,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>

                </div>

                {description}
                {ocrPhotos}
            </div>
        );
    }
}

ShowLeadLayout.propTypes = {
    value: PropTypes.shape({
        street: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        city: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        zip: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        country_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.shape({}), PropTypes.array]),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        contact_name: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        phone: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        email_from: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_partner_internal_reference: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        create_date: PropTypes.string,
        stage_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.shape({}), PropTypes.array]),
        gn_provision_recommended: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.array]),
        lost_reason: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.string]).isRequired,
        user_email: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.array]),
        ocrPhotos: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool, PropTypes.string, PropTypes.array]),
        description: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_company_type: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_franchise: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_timetracking: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_stock: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_presentation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_newsletter: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_homepage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_marketing: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_menu: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_reservation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_calculation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_purchase: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_order: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_cashbook: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_loyalty: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_mod_pos: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
        gn_temp_data_json: PropTypes.shape({
            googleMaps: PropTypes.shape({
                markers: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.shape]),
                zoom: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
            }),
        }),
    }).isRequired,
    modelName: PropTypes.string,
    uuid: PropTypes.string,
    showgoogleMaps: PropTypes.bool,
    addressGeocodingOnce: PropTypes.func.isRequired,
    saveLead: PropTypes.func.isRequired,
    fieldsList: PropTypes.shape({
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
    }).isRequired,
    isOpen: PropTypes.bool,
};

ShowLeadLayout.defaultProps = {
    showgoogleMaps: false,
    isOpen: false,
    modelName: '',
    uuid: '',
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addressGeocodingOnce: addressGeocodingOnceAction,
    saveLead: saveLeadAction,
}, dispatch);

export default connect(null, mapDispatchToProps)(ShowLeadLayout);
