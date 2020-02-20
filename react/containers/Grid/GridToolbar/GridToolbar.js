import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Aux from '../../../hoc/Aux/Aux';

const toolbarStyles = (theme) => ({
    root: {
        paddingRight: theme.spacing(1),
    },
    highlight:
        {
            color: theme.palette.secondary.dark,
            backgroundColor: theme.palette.secondary.main,
        },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '1 1 100%',
    },
    progress: {
        flex: '1 1 100%',
    },
});

class GridToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSaveClick = (event) => {
        const { onSendUpdate } = this.props;
        onSendUpdate(event);
    };

    handleResetClick = () => {
        const {
            onReset,
            uuid,
        } = this.props;
        onReset({
            uuid,
        });
    };

    render() {
        const {
            numSelected,
            classes,
            onRefresh,
            numUpdated,
            onCSVClick,
            cvsDownload,
            toolbarActions,
        } = this.props;

        let csvButton = '';
        if (cvsDownload) {
            csvButton = (
                <div className={classes.actions}>
                    <Tooltip title={E.Lang.translate('globals.grid.toolbar.download.csv.tooltip')}>
                        <IconButton onClick={onCSVClick}>
                            <i className="material-icons">
                                assignment_returned
                            </i>
                        </IconButton>
                    </Tooltip>
                </div>
            );
        }

        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: (numSelected > 0 || numUpdated > 0),
                })}
            >
                <div className={classes.title} />
                <div className={classes.spacer} />
                {
                    numUpdated > 0
                    && (
                        <Aux>
                            <div className={classes.title}>
                                <Typography>
                                    {numUpdated}
                                     change
                                    {numUpdated > 1 ? 's' : ''}
                                    pending
                                </Typography>
                            </div>
                            <div className={classes.actions}>
                                <Tooltip
                                    title={E.Lang.translate('globals.grid.toolbar.download.save.tooltip')}
                                    onClick={this.handleSaveClick}
                                >
                                    <IconButton>
                                        <SaveIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className={classes.actions}>
                                <Tooltip
                                    title={E.Lang.translate('globals.grid.toolbar.download.reset.tooltip')}
                                    onClick={this.handleResetClick}
                                >
                                    <IconButton>
                                        <UndoIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Aux>
                    )
                }
                { csvButton }
                { toolbarActions || ''}


                <div className={classes.actions}>
                    <Tooltip title={E.Lang.translate('globals.grid.toolbar.download.refresh.tooltip')}>
                        <IconButton onClick={onRefresh}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </div>

                <div className={classes.actions}>
                    {numSelected > 0 && ( // If the grid is selectable and sth is selected
                        <Tooltip title={E.Lang.translate('globals.grid.toolbar.download.resend.tooltip')}>
                            <IconButton aria-label={E.Lang.translate('globals.grid.toolbar.download.resend.title')}>
                                <SendIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>

            </Toolbar>
        );
    }
}

GridToolbar.propTypes = {
    classes: PropTypes.shape({
        actions: PropTypes.string,
        root: PropTypes.string,
        highlight: PropTypes.string,
        title: PropTypes.string,
        spacer: PropTypes.string,
    }).isRequired,
    numSelected: PropTypes.number.isRequired,
    cvsDownload: PropTypes.bool,
    toolbarActions: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.element,
    ]),
    onSendUpdate: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.func,
    ]),
    onReset: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.func,
    ]),
    uuid: PropTypes.string.isRequired,
    onRefresh: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.func,
    ]),
    numUpdated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.func,
    ]),
    onCSVClick: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.func,
    ]),
};

GridToolbar.defaultProps = {
    cvsDownload: false,
    toolbarActions: false,
    onSendUpdate: false,
    onReset: false,
    onRefresh: false,
    numUpdated: false,
    onCSVClick: false,
};

export default withStyles(toolbarStyles)(GridToolbar);
