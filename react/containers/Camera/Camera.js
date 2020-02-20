/* eslint react/sort-comp: [2] */

import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// CSS
import s from './Camera.scss';

import {
    brightness,
    contrastImage,
    grayscale,
} from '../../helpers/imageFilters';

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();

        this.state = {
            image: '',
            takePhotoInProgrss: false,
            videoSource: '',
            videoSources: [],
            srcObject: '',
            facingMode: 'user',
            videoWidthMore: '580',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
    }

    componentDidMount() {
        this.setStateFromProps();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);

        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
            this.video.current.srcObject = null;
        }
    }

    setStateFromProps() {
        const {
            videoSource,
            videoSources,
        } = this.props;
        const {
            videoSources: videoSourcesState,
            videoSource: videoSourceState,
        } = this.state;
        if (Object.prototype.hasOwnProperty.call(this.props, 'videoSource')) {
            if (videoSource.videoSource !== '') {
                this.state.videoSource = videoSource.videoSource;
            }
            if (videoSource.facingMode !== '') {
                this.state.facingMode = videoSource.facingMode;
            }
        }

        if (Object.prototype.hasOwnProperty.call(this.props, 'videoSources')) {
            this.state.videoSources = videoSources;
        }


        if (videoSourcesState.length > 0 && videoSourceState !== '') {
            this.start();
        } else {
            this.videoSource();
        }
    }

    videoSource() {
        navigator.mediaDevices.enumerateDevices().then(this.gotDevices).catch(this.handleError);
    }

    start() {
        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
        }

        const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        const { videoSource } = this.state;
        let constraints = {};
        const { facingMode } = this.state;
        if (iOS) {
            constraints = {
                audio: false,
                video: {
                    deviceId: videoSource,
                    width: 1280,
                    facingMode,
                },
            };
        } else {
            constraints = {
                audio: false,
                video: {
                    deviceId: videoSource ? { exact: videoSource } : undefined,
                    frameRate: { ideal: 60, min: 10 },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode,
                },
            };
        }

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            // WORKAROUND
            // In Safari navigator.mediaDevices.enumerateDevices() return default array with the empty device (empty id etc.)
            // until we allowed the camera to work. If we try to stream it, after we allowed it, it gives an error.
            // So we ask one again about devices after error.
            if (videoSource === '') {
                this.videoSource();
                return;
            }

            this.gotStream(stream);
        }).catch(this.handleError);
    }

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
            }, () => {
                this.start();
            });
        } else if (videoSources.length > 0) {
            this.start();
        }
    };

    gotStream(stream) {
        window.stream = stream; // make stream available to console
        this.video.current.srcObject = stream;

        return navigator.mediaDevices.enumerateDevices();
    }

    handleInputChange(event) {
        const { facingMode: facingModeState } = this.state;
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        if (this.state[name] === value) {
            return false;
        }

        let facingMode = 'user';
        if (facingModeState === 'user') {
            facingMode = 'environment';
        }

        this.setState({
            [name]: value,
            facingMode,
        }, () => {
            const { setVideoSource } = this.props;
            setVideoSource({ [name]: value, facingMode });
            this.start();
        });
        return false;
    }

    switchCamera() {
        const {
            videoSource,
            facingMode: facingModeState,
            videoSources,
        } = this.state;
        let actualVideoSourceIndex = 0;
        videoSources.filter((el, idx) => {
            if (el.deviceId === videoSource) {
                actualVideoSourceIndex = idx;
                return true;
            }
            return false;
        });
        let nextVideoSourceIndex = actualVideoSourceIndex + 1;
        if (nextVideoSourceIndex >= videoSources.length) {
            nextVideoSourceIndex = 0;
        }

        let facingMode = 'user';
        if (facingModeState === 'user') {
            facingMode = 'environment';
        }

        const nextVideoSourceIdx = videoSources[nextVideoSourceIndex].deviceId;

        this.setState({
            videoSource: nextVideoSourceIdx,
            facingMode,
        }, () => {
            const { setVideoSource } = this.props;
            setVideoSource({ videoSource: nextVideoSourceIdx, facingMode });
            this.start();
        });
    }


    handleError = (error) => {
        /* eslint-disable no-console */
        console.log('navigator.getUserMedia error:');
        console.log(`${error.name}: ${error.message}`);
        /* eslint-enable no-console */
    };

    handleWindowResize() {
        const {
            open,
            containerWidthMore,
        } = this.state;
        if (!this.containerTargetMore || containerWidthMore === this.containerTargetMore.offsetWidth
        ) {
            return false;
        }

        if (open) {
            this.setState({
                videoWidthMore: this.containerTargetMore.offsetWidth,
            });
        }
        return false;
    }

    capture = () => {
        this.setState({
            takePhotoInProgrss: true,
        });
        return this.getScreenshot();
    };

    getScreenshot() {
        const returnImgs = this.getCanvas();
        returnImgs.show = returnImgs.show && returnImgs.show.toDataURL('image/png', 1);
        returnImgs.send = returnImgs.send && returnImgs.send.toDataURL('image/png', 1);
        return returnImgs;
    }

    getCanvas() {
        const returnImgs = {
            show: false,
            send: false,
        };
        const canvas = document.createElement('canvas');
        const canvasToSend = document.createElement('canvas');
        canvas.width = this.video.current.videoWidth;
        canvas.height = this.video.current.videoHeight;
        canvasToSend.width = this.video.current.videoWidth;
        canvasToSend.height = this.video.current.videoHeight;
        const ctx = canvas.getContext('2d');
        const ctxToSend = canvasToSend.getContext('2d');
        ctx.drawImage(this.video.current, 0, 0, canvas.width, canvas.height);
        ctxToSend.drawImage(this.video.current, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let imageDataToSend = ctxToSend.getImageData(0, 0, canvasToSend.width, canvasToSend.height);

        imageData = brightness(imageData, 10);
        imageDataToSend = grayscale(imageDataToSend);
        imageDataToSend = contrastImage(imageDataToSend, 20);
        ctx.putImageData(imageData, 0, 0);
        ctxToSend.putImageData(imageDataToSend, 0, 0);
        returnImgs.show = canvas;
        returnImgs.send = canvasToSend;
        return returnImgs;
    }

    render() {
        const { takePhoto } = this.props;
        const {
            videoSource,
            takePhotoInProgrss,
            videoSources,
            open,
        } = this.state;
        let video = '';
        const circularProgress = (
            <div className={s.photoProgress}><CircularProgress size={56} className={s.progressBar} thickness={2} /></div>
        );

        if (videoSource !== '') {
            video = (
                <div
                    className={s.videoContener}
                >
                    {takePhotoInProgrss ? circularProgress : (
                        <div
                            className={s.overVideo}
                            onClick={() => { takePhoto(this.capture()); }}
                            role="presentation"
                        >
                            <i className="material-icons">center_focus_strong</i>
                        </div>
                    )}
                    <video id="video" width="100%" ref={this.video} playsInline autoPlay>
                        <track kind="captions" />
                    </video>
                </div>
            );
        }

        let select = '';
        if (videoSources.length > 1) {
            select = (
                <span
                    className={s.cameraSwitch}
                    onClick={this.switchCamera}
                    role="presentation"
                >
                    <i role="presentation" className="material-icons" onClick={this.handleCloseCamera}>loop</i>
                </span>
            );
        }

        return (
            <div className={s.cameraContener}>
                {select}
                <div
                    className={s.videoContener}
                    ref={(node) => {
                        // this callback executes before componentDidMount
                        if (node !== null) {
                            this.containerTargetMore = node;
                            if (open) {
                                this.handleWindowResize();
                            }
                        }
                    }}
                >
                    {video}
                </div>
            </div>
        );
    }
}

Camera.propTypes = {
    setVideoSource: PropTypes.func.isRequired,
    videoSources: PropTypes.oneOfType([PropTypes.bool, PropTypes.array, PropTypes.shape({})]).isRequired,
    takePhoto: PropTypes.func.isRequired,
    videoSource: PropTypes.shape({
        videoSource: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array, PropTypes.shape({})]),
        facingMode: PropTypes.string,
    }).isRequired,
};

Camera.defaultProps = {

};

export default connect()(Camera);
