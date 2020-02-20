import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// ACTIONS
import {
    setOnLineStatus as setOnLineStatusAction,
} from '../../store/actions/appStatus';
// CSS
import s from './IfOffLineMsg.scss';

class IfOffLineMsg extends React.Component {
    componentDidMount() {
        const { setOnLineStatus } = this.props;

        window.addEventListener('offline', () => {
            setOnLineStatus({ isOnLine: false });
        });

        window.addEventListener('online', () => {
            setOnLineStatus({ isOnLine: true });
        });
    }

    render() {
        const { appStatus } = this.props;
        return (
            <div className={s.container}>
                {(!appStatus.isOnLine) && (
                    <i
                        className="material-icons"
                        title="You are offline"
                    >
                        wifi_off
                    </i>
                )}
            </div>
        );
    }
}

IfOffLineMsg.propTypes = {
    appStatus: PropTypes.shape({
        isOnLine: PropTypes.bool,
    }),
    setOnLineStatus: PropTypes.func.isRequired,
};

IfOffLineMsg.defaultProps = {
    appStatus: {
        isOnLine: false,
    },
};

const mapStateToProps = (state) => ({
    appStatus: state.appStatus,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setOnLineStatus: setOnLineStatusAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IfOffLineMsg);
