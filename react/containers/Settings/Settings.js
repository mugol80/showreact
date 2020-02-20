import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Icon,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
} from '@material-ui/core';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
// ACTIONS
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
import {
    saveFair as saveFairAction,
    setInProgress as setInProgressAction,
    setSettingValue as setSettingValueAction,
} from '../../store/actions/settings';
// CSS
import s from './Settings.scss';
import Lang from '../../hoc/Lang/Lang';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChangeSetting = this.handleInputChangeSetting.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            settings,
            saveFair,
            setInProgress,
        } = this.props;

        if (
            settings.campaign_id !== prevProps.settings.campaign_id // user selected a compaign
            || settings.campaignList.length !== prevProps.settings.campaignList.length // compaign list from server updated
        ) {
            const campaignAvailable = settings.campaignList && settings.campaignList.find(
                (x) => x.id === settings.campaign_id,
            );
            setInProgress({ id: 'saveFair', action: 'add' });
            saveFair({
                gn_sales_default_campaign: campaignAvailable ? settings.campaign_id : false,
            });
        }
    }

    settingWindowClose() {
        const {
            setSettingValue,
            clearMessages,
        } = this.props;

        clearMessages();
        setSettingValue({ name: 'showSettingWindow', value: false });
    }

    handleInputChange(e) {
        const { target } = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleInputChangeSetting(e) {
        const { setSettingValue } = this.props;
        const { target } = e;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        if (name === 'source_id') {
            if (!target.checked) {
                setSettingValue({ name: 'campaign_id', value: false });
            }
        }
        if (value === '') { value = false; }
        setSettingValue({ name, value });
    }

    render() {
        const {
            settings,
            backMessages,
        } = this.props;
        let linearProgress = '';
        let dataBackValues = [];

        if (settings.inProgress.length > 0) {
            linearProgress = (
                <div className={`progressBarcontainer ${s.progressBarcontainer}`}>
                    <LinearProgress className={s.progressBar} />
                </div>
            );
        }

        if (backMessages) {
            dataBackValues = backMessages;
        }

        return (
            <div>
                <Dialog
                    open={settings.showSettingWindow}
                    onClose={() => {
                        this.settingWindowClose();
                    }}
                    disableBackdropClick
                    disableEscapeKeyDown={false}
                    classes={{ paper: s.paper }}
                >
                    <DialogTitle
                        classes={{
                            root: s.rootDialogTitle,
                        }}
                    >
                        <Lang>locals.settings.settingsWindowTitle</Lang>
                        <IconButton
                            className={s.IconButton}
                            onClick={() => {
                                this.settingWindowClose();
                            }}
                            aria-label="Close"
                        >
                            <Icon>close</Icon>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent
                        classes={{
                            root: s.rootDialogContent,
                        }}
                    >
                        {linearProgress}
                        <div className="statementsContainer">
                            {dataBackValues.map((val) => (
                                <p key={`${val.type}`} className={`statement ${val.type}`}>
                                    <Icon>error</Icon>
                                    {' '}
                                    {Parser(val.message)}
                                </p>
                            ))}
                        </div>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    checked={settings.source_id !== false}
                                    onChange={(e) => { this.handleInputChangeSetting(e); }}
                                    disabled={settings.sourceFixed || settings.campaignList.length === 0}
                                    value="23"
                                    inputProps={{
                                        id: 'source_id',
                                        name: 'source_id',
                                    }}
                                />
                            )}
                            classes={{
                                label: 'formControlLabel',
                            }}
                            label={<Lang>locals.settings.fairsSourceLabel</Lang>}
                        />

                        <FormControl fullWidth>
                            <InputLabel
                                htmlFor="campaign_id"
                            >
                                <Lang>locals.settings.fairListLabel</Lang>
                            </InputLabel>
                            <Select
                                disabled={!!(settings.campaignFixed || !settings.source_id)}
                                value={settings.campaign_id ? settings.campaign_id : ''}
                                onChange={(e) => { this.handleInputChangeSetting(e); }}
                                inputProps={{
                                    id: 'campaign_id',
                                    name: 'campaign_id',
                                }}
                            >
                                {settings.source_id
                                && settings.campaignList.map((name) => <MenuItem key={name.id} value={name.id}>{name.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

Settings.propTypes = {
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
    clearMessages: PropTypes.func.isRequired,
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array, PropTypes.shape({})]),
    setInProgress: PropTypes.func.isRequired,
    saveFair: PropTypes.func.isRequired,
};

Settings.defaultProps = {
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
    backMessages: null,
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    settings: state.settings,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    clearMessages: clearMessagesAction,
    setSettingValue: setSettingValueAction,
    setInProgress: setInProgressAction,
    saveFair: saveFairAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
