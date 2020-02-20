import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
import { showProgressBar as showProgressBarAction } from '../../store/actions/dashboard';
import {
    addPhoto as addPhotoAction,
    removePhoto as removePhotoAction,
    sendPhoto as sendPhotoAction,
} from '../../store/actions/ocr';
import {
    addressGeocoding as addressGeocodingAction,
    addressGeocodingOnce as addressGeocodingOnceAction,
} from '../../store/actions/googleMaps';
// COMPONENTS/CONTAINERS
import NewLeadForm from './NewLeadForm';
import NewLeadFormMessage from './NewLeadFormMessage';
import Camera from '../Camera/Camera';
import ShowInfoHeader from '../../components/ShowInfoHeader/ShowInfoHeader';
import GoogleMaps from '../GoogleMaps/GoogleMaps';
// CSS
import s from './NewLead.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class NewLead extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openCamera: false,
            videoSource: '',
            videoSources: [],
            facingMode: 'user',
            googleMapsSetting: {
                zoom: 14,
            },
        };
    }

    componentDidMount() {
        this.videoSources();
    }

    setMarkerOnMap = (data) => {
        const { googleMapsSetting } = this.state;
        const markers = [];
        if (data.status === 'OK') {
            for (let i = 0; i < data.results.length; i++) {
                const marker = {};
                marker.location = data.results[i].geometry.location;
                markers.push(marker);
            }
        }

        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                markers,
                showLoading: false,
            },
        });
    };

    setVideoSource = (newState) => {
        this.setState(newState);
    };

    setAddress = (address) => {
        const { addressGeocodingOnce } = this.props;
        const { googleMapsSetting } = this.state;
        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                showLoading: true,
            },
        });
        addressGeocodingOnce({ address, callback: this.setMarkerOnMap });
    };

    takePhoto = (img) => {
        const { sendPhoto, addPhoto } = this.props;
        this.handleCloseCamera();
        const id = Math.floor(Math.random() * 1000000);
        addPhoto({ img: img.show, id });
        sendPhoto({ imageSrc: img.send, id });
    };

    removePhoto = (idx) => {
        const { removePhoto } = this.props;
        removePhoto({ idx });
    };

    removeAllPhotos = () => {
        const { photos } = this.props;
        for (let i = 0; i < photos.length; i++) {
            this.removePhoto({ idx: photos[i].id });
        }
    };

    handleError = (error) => {
        /* eslint-disable no-console */
        console.log('navigator.getUserMedia error:');
        console.log(error);
        /* eslint-enable no-console */
    };

    handleCloseCamera = () => {
        this.setState({ openCamera: false });
    };

    handleClickOpenCamera = () => {
        this.setState({ openCamera: true });
    };

    gotDevices = (deviceInfos) => {
        const { videoSource } = this.state;
        const videoSources = [];
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === 'videoinput') {
                videoSources.push(deviceInfo);
            }
        }

        this.setState({
            videoSources,
        });

        if (videoSources.length > 0 && videoSource === '') {
            this.setState({
                videoSource: videoSources[0].deviceId,
            });
        }
    };

    addMarkerToMap = (e) => {
        const { googleMapsSetting } = this.state;
        const markers = [];
        const marker = {};
        const latitude = e.latLng.lat();
        const longitude = e.latLng.lng();
        marker.location = { lat: latitude, lng: longitude };
        markers.push(marker);

        this.setState({
            googleMapsSetting: {
                ...googleMapsSetting,
                markers,
                showLoading: false,
                zoom: 14,
            },
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
        });
    };

    removeMarker = (e, key) => {
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
            });
        }
    };

    resetgoogleMapsSetting = () => {
        const googleMapsSetting = {
            zoom: 14,
        };
        this.setState({ googleMapsSetting });
    };

    videoSources() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.enumerateDevices().then(this.gotDevices).catch(this.handleError);
        }
    }

    render() {
        const {
            newLead,
            photos,
        } = this.props;
        const {
            googleMapsSetting,
            videoSources,
            openCamera,
            videoSource,
            facingMode,
        } = this.state;

        let section = <NewLeadForm />;

        let cameraPopUp = '';
        let businessCardContainer = '';
        let businessCardImgs = '';
        let googleMapsContainer = '';


        const ocrLines = [];
        const ocrToSection = [];

        if (photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
                ocrToSection.push(photos[i]);
                if (photos[i].ocrInfo !== ''
                    && typeof photos[i].ocrInfo.responses !== 'undefined'
                    && typeof photos[i].ocrInfo.responses[0].fullTextAnnotation !== 'undefined') {
                    let lines = photos[i].ocrInfo.responses[0].fullTextAnnotation.text;

                    lines = lines.replace(/[\s]?,[\s]?/gi, '\r\n'); // [\s]+\|[\s]+
                    lines = lines.replace(/[\s]+\|[\s]+/g, '\r\n');
                    lines = lines.replace(/[\s]+[1Il][\s]+/g, '\r\n');
                    lines = lines.replace(/[\s]+[Il][\s]+/g, '\r\n');
                    lines = lines.replace(/[\s]?\+[0-9]{2}[\s]?/g, '\r\n$&');
                    lines = lines.replace(/[a-z]?-?[0-9]{4,5}\s+[a-z]+[-\s]?[a-z]{5,}/gi, '\r\n$&\r\n'); // split zip + cipty part
                    lines = lines.split(/\r?\n/);
                    for (let z = 0; z < lines.length; z++) {
                        if (lines[z] !== '') {
                            ocrLines.push(lines[z]);
                        }
                    }
                }
            }
        }

        const circularProgress = (
            <div
                className={s.photoProgress}
            >
                <CircularProgress
                    size={56}
                    className={s.progressBar}
                    thickness={2}
                />
            </div>
        );

        switch (newLead.section) {
            case 'form': {
                section = (
                    <NewLeadForm
                        ocr={ocrLines}
                        ocrPhotos={ocrToSection}
                        removeAllPhotos={this.removeAllPhotos}
                        setAddress={this.setAddress}
                        resetgoogleMapsSetting={this.resetgoogleMapsSetting}
                        googleMapsSetting={googleMapsSetting}
                    />
                );
                let nextPhotoBtn = '';
                if (photos.length < 2 && videoSources.length !== 0) {
                    cameraPopUp = (
                        <Dialog
                            open={openCamera}
                            onClose={this.handleCloseCamera}
                            classes={{
                                root: s.rootDialog,
                                paper: s.paper,
                            }}
                        >
                            <span
                                className={s.cameraClose}
                                onClick={this.handleCloseCamera}
                                role="presentation"
                            >
                                <i className="material-icons">close</i>
                            </span>
                            <DialogContent classes={{
                                root: s.rootDialogContent,
                            }}
                            >
                                <Camera
                                    takePhoto={this.takePhoto}
                                    setVideoSource={this.setVideoSource}
                                    videoSource={{
                                        videoSource,
                                        facingMode,
                                    }}
                                    videoSources={videoSources}
                                />
                            </DialogContent>
                        </Dialog>
                    );

                    nextPhotoBtn = (
                        <div
                            className={s.addPhoto}
                            onClick={this.handleClickOpenCamera}
                            role="presentation"
                        >
                            <i className="material-icons">
                                add_a_photo
                            </i>
                        </div>
                    );
                }

                businessCardImgs = photos.map((value, idx) => (
                    <div
                        key={value.id}
                        className={s.businesCardPhoto}
                    >
                        <div className={s.overPhoto}>
                            <i
                                className="material-icons"
                                onClick={() => {
                                    this.removePhoto(idx);
                                }}
                                role="presentation"
                            >
                                clear
                            </i>
                        </div>

                        {value.loading ? circularProgress : ''}
                        <img src={value.image} alt="" />
                    </div>
                ));

                businessCardContainer = (
                    <div>
                        <h3><Lang>locals.newlead.title.bussinescard</Lang></h3>
                        {businessCardImgs}
                        {nextPhotoBtn}
                    </div>
                );
                if (videoSources.length === 0) {
                    businessCardContainer = '';
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
                    info.push(E.Lang.translate('globals.googlemaps.noAddressFind'));
                }

                googleMapsContainer = '';

                if (googleMapsSetting.markers) {
                    googleMapsContainer = (
                        <div className={s.businessCard}>
                            <h3>Address on map</h3>
                            <div className={s.googleMaoContainer}>
                                <GoogleMaps
                                    googleMapsSetting={googleMapsSetting}
                                    draggableFunction={this.updateMarkerOnMap}
                                    clickFunction={this.removeMarker}
                                    clickMapFunction={this.addMarkerToMap}
                                />
                            </div>
                            <div className={s.googleMapsInfo}>
                                {info.map((infotxt) => <p key={infotxt}>{infotxt}</p>)}
                            </div>
                        </div>
                    );
                }


                break;
            }
            case 'message': {
                section = <NewLeadFormMessage />;
                businessCardContainer = '';
                googleMapsContainer = '';
                cameraPopUp = '';
                break;
            }
            default:
                return false;
        }

        return (
            <div className="newLeadForm">
                <div className="header">
                    <div className="contentContainerCenter">
                        <h1>
                            <Lang>locals.newlead.title.newlead</Lang>
                            <br />
                            <span><Lang>locals.newlead.titlesmall.addnewlead</Lang></span>
                        </h1>
                    </div>
                </div>
                <ShowInfoHeader />
                <div className="content">
                    <div className="contentContainerCenter">
                        <Grid container spacing={5}>
                            <Grid className="" item sm={4} xs={12}>
                                <div className={s.infoText}>
                                    <p><Lang>locals.newlead.msg.info</Lang></p>
                                </div>
                                {businessCardContainer}
                                {googleMapsContainer}
                            </Grid>
                            <Grid item sm={8} xs={12}>
                                {section}
                            </Grid>
                        </Grid>
                    </div>
                </div>
                {cameraPopUp}
            </div>
        );
    }
}

NewLead.propTypes = {
    photos: PropTypes.arrayOf(PropTypes.shape({
        image: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ocrInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.bool, PropTypes.shape({})]),
    })),
    newLead: PropTypes.shape({
        section: PropTypes.string,
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
    }),
    countriesList: PropTypes.shape({
        LeadCountry: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({})]),
    }),
    sendPhoto: PropTypes.func.isRequired,
    addPhoto: PropTypes.func.isRequired,
    removePhoto: PropTypes.func.isRequired,
    addressGeocodingOnce: PropTypes.func.isRequired,
};

NewLead.defaultProps = {
    photos: [],
    newLead: {},
    countriesList: {
        LeadCountry: {},
    },
};


const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    newLead: state.newLead,
    photos: state.ocr.photos,
    settings: state.settings,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    showProgressBar: showProgressBarAction,
    clearMessages: clearMessagesAction,
    sendPhoto: sendPhotoAction,
    addPhoto: addPhotoAction,
    removePhoto: removePhotoAction,
    addressGeocodingOnce: addressGeocodingOnceAction,
    addressGeocoding: addressGeocodingAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewLead);
