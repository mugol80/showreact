import React from 'react';
import {
    GoogleMap,
    Marker,
} from '@react-google-maps/api';
import { LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
// CSS
import s from './GoogleMaps.scss';


// INFO
// https://react-google-maps-api-docs.netlify.com/
// https://medium.com/@schlunzk/integrating-google-maps-api-in-react-redux-part-1-6b036014f4a6


class GoogleMaps extends React.Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.state = {
            shouldZoomUpdate: true,
            initialCenter: { lat: 53.108946, lng: 8.878090 },
            googleMapsSetting: {
                zoom: 14,
            },
        };
    }

    componentDidMount() {
        const { googleMapsSetting } = this.props;

        this.setState({
            googleMapsSetting,
        }, () => {
            this.setBoundsToMap();
        });
    }

    shouldComponentUpdate(nextProps) {
        const { googleMapsSetting } = this.state;
        return JSON.stringify(googleMapsSetting) !== JSON.stringify(nextProps.googleMapsSetting);
    }

    componentDidUpdate(prevProps) {
        const { googleMapsSetting } = this.props;

        if (JSON.stringify(googleMapsSetting) !== JSON.stringify(prevProps.googleMapsSetting)) {
            // setState is ok if wrapped in condition
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                googleMapsSetting,
            }, () => {
                this.setBoundsToMap();
            });
        }
    }

    onMarkerClick = (e, key) => {
        const {
            googleMapsSetting,
        } = this.state;
        const { clickFunction } = this.props;

        if (clickFunction) {
            e.data = googleMapsSetting.markers[key].data ? googleMapsSetting.markers[key].data : false;
            clickFunction(e, key);
        } else {
            return true;
        }

        return false;
    };

    onMarkerDragEnd = (e, key) => {
        const { draggableFunction } = this.props;
        if (draggableFunction) {
            draggableFunction(e, key, this.map.getZoom());
        }
    };

    onMapClick = (e) => {
        const { clickMapFunction } = this.props;

        if (clickMapFunction) {
            clickMapFunction(e);
        }
        return false;
    };

    onLoad = (map) => {
        this.map = map;
    };

    onZoomChanged = () => {
        const { onZoomChanged } = this.props;
        if (onZoomChanged && typeof onZoomChanged === 'function') {
            onZoomChanged(this.map.getZoom());
        }
    };

    setZoomAfterUpdate = () => {
        if (!this.map || typeof this.map.setZoom !== 'function') {
            return; // map not yet initialized
        }

        const {
            googleMapsSetting,
        } = this.state;

        // use default zoom if we have 2 or more markers
        if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers')
            && googleMapsSetting.markers.length >= 2
        ) {
            return;
        }

        // take zoom from state
        if (
            Object.prototype.hasOwnProperty.call(googleMapsSetting, 'zoom')
        ) {
            this.map.setZoom(googleMapsSetting.zoom);
        }
    };

    setBoundsToMap = () => {
        const {
            initialCenter,
            googleMapsSetting,
        } = this.state;

        const bounds = new window.google.maps.LatLngBounds();

        if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'markers')
            && googleMapsSetting.markers.length > 0) {
            for (let i = 0; i < googleMapsSetting.markers.length; i++) {
                bounds.extend(googleMapsSetting.markers[i].location);
            }
        } else {
            bounds.extend(initialCenter);
        }

        this.setState({
            shouldZoomUpdate: true,
        }, () => {
            this.map.fitBounds(bounds);
        });
    };

    onBoundsChanged = () => {
        const { shouldZoomUpdate } = this.state;
        const { onBoundsChanged } = this.props;
        if (onBoundsChanged) {
            onBoundsChanged(this.map);
        }

        this.setState({
            initialCenter: this.map.getCenter(),
            shouldZoomUpdate: false,
        }, () => {
            if (shouldZoomUpdate) {
                this.setZoomAfterUpdate();
            }
        });
    };

    render() {
        const {
            googleMapsSetting,
            draggableFunction,
            clickMapFunction,
        } = this.props;
        const {
            initialCenter,
            googleMapsSetting: googleMapsSettingState,
        } = this.state;

        const markers = [];
        const mapProps = {
            zoom: googleMapsSettingState.zoom,
            mapContainerClassName: s.map,
            center: initialCenter,
        };

        if (clickMapFunction
            && Object.prototype.hasOwnProperty.call(googleMapsSettingState, 'markers')
            && googleMapsSettingState.markers.length === 0) {
            mapProps.onClick = this.onMapClick;
        }

        if (Object.prototype.hasOwnProperty.call(googleMapsSettingState, 'markers')
            && googleMapsSettingState.markers.length > 0) {
            for (let i = 0; i < googleMapsSettingState.markers.length; i++) {
                const key = i;
                const marker = (
                    <Marker
                        key={key}
                        onClick={(e) => this.onMarkerClick(e, key)}
                        draggable={!!draggableFunction}
                        onDragEnd={(e) => { this.onMarkerDragEnd(e, key); }}
                        position={googleMapsSettingState.markers[i].location}
                    />
                );

                markers.push(marker);
            }
        }

        let linearProgress = '';
        if (Object.prototype.hasOwnProperty.call(googleMapsSetting, 'showLoading')
            && googleMapsSetting.showLoading === true) {
            linearProgress = (
                <div
                    className={`progressBarcontainer ${s.progressBarcontainer}`}
                >
                    <LinearProgress className={s.progressBar} />
                </div>
            );
        }

        return (
            <div className={s.googleMapsContainer}>
                {linearProgress}
                <GoogleMap
                    {...mapProps}
                    onLoad={(map) => {
                        this.onLoad(map);
                    }}
                    onZoomChanged={this.onZoomChanged}
                    onBoundsChanged={this.onBoundsChanged}
                >
                    {markers.map((marker) => marker)}
                </GoogleMap>
            </div>
        );
    }
}

GoogleMaps.propTypes = {
    googleMapsSetting: PropTypes.shape({
        showLoading: PropTypes.bool,
        zoom: PropTypes.number,
    }),
    isSetTimeout: PropTypes.bool,
    clickFunction: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
    clickMapFunction: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
    draggableFunction: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
    onReadyFunction: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
    onZoomChanged: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
    onBoundsChanged: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
    ]),
};

GoogleMaps.defaultProps = {
    googleMapsSetting: {},
    isSetTimeout: false,
    clickFunction: false,
    clickMapFunction: false,
    draggableFunction: false,
    onReadyFunction: false,
    onZoomChanged: false,
    onBoundsChanged: false,
};

export default (GoogleMaps);
