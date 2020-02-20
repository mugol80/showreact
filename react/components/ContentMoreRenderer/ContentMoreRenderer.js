import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import {
    setContent as setContentAction,
    setShowContent as setShowContentAction,
} from '../../store/actions/contents';
// CSS
import s from './ContentMoreRenderer.scss';

class ContentMoreRenderer extends React.Component {
    showContent = () => {
        const {
            setShowContent,
            user,
            setContent,
            fullRow,
        } = this.props;
        if (fullRow.type === 'landingpage') {
            let url = fullRow.source;
            url = url.replace('%gnRId%', user.id);

            window.open(url, '_blank');
        } else {
            setContent(fullRow);
            setShowContent(true);
        }
    };

    render() {
        const { fullRow } = this.props;
        let icon = 'play_circle_filled';
        if (fullRow.type === 'landingpage') {
            icon = 'stars';
        }

        return (
            <span>
                <Icon
                    onClick={this.showContent}
                    aria-label={E.Lang.translate('locals.content.moreinfo')}
                    className={s.moreinfo}
                >
                    {icon}
                </Icon>
            </span>
        );
    }
}

ContentMoreRenderer.propTypes = {
    fullRow: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.shape({})]).isRequired,
    setContent: PropTypes.func.isRequired,
    setShowContent: PropTypes.func.isRequired,
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.shape({})]),
};

ContentMoreRenderer.defaultProps = {
    user: null,
};

const mapStateToProps = (state) => ({
    user: state.users.user,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setContent: setContentAction,
    setShowContent: setShowContentAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContentMoreRenderer);
