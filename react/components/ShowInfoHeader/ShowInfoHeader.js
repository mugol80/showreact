import React from 'react';
import { Icon } from '@material-ui/core';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
// CSS
import s from './ShowInfoHeader.scss';
// ACTION
import { setSettingValue as setSettingValueAction } from '../../store/actions/settings';
// LANG
import Lang from '../../hoc/Lang/Lang';

class ShowInfoHeader extends React.Component {
    settingWindow(e) {
        e.preventDefault();
        const { setSettingValue } = this.props;
        setSettingValue({
            name: 'showSettingWindow',
            value: true,
        });
        return false;
    }

    render() {
        const { settings } = this.props;
        let campaignInfo = '';

        if (settings.campaign_id && settings.campaignList.length > 0) {
            let campaignName = settings.campaignList.find((el) => el.id === settings.campaign_id);
            if (campaignName) {
                if (settings.campaignFixed) {
                    campaignName = (
                        <span
                            className={s.campaigninfo_name}
                        >
                            <Icon
                                className={s.campaigninfo_name__icon}
                            >
                                lock
                            </Icon>
                            {campaignName.name}
                        </span>
                    );
                } else {
                    campaignName = (
                        <button
                            type="button"
                            href="#"
                            onClick={(e) => this.settingWindow(e)}
                            className={`${s.campaigninfo_name} ${s.campaigninfo_name__link}`}
                        >
                            <Icon className={s.campaigninfo_name__icon}>lock_open</Icon>
                            {campaignName.name}
                        </button>
                    );
                }

                campaignInfo = (
                    <div className={s.campaigninfo}>
                        <Lang>globals.showinfoheader.campaignInfoTitle</Lang>
                        {campaignName}
                    </div>
                );
            }
        }

        return (
            <div className={s.showinfo}>
                <div className="contentContainerCenter">
                    {campaignInfo}
                </div>
            </div>
        );
    }
}


ShowInfoHeader.propTypes = {
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
    setSettingValue: PropTypes.func.isRequired,
};

ShowInfoHeader.defaultProps = {
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
};


const mapStateToProps = (state) => ({
    settings: state.settings,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setSettingValue: setSettingValueAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ShowInfoHeader);
