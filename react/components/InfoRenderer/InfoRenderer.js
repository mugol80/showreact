import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
    withMobileDialog,
} from '@material-ui/core';

import ShowLeadLayout from './ShowLeadLayout';

// CSS
import s from './InfoRenderer.scss';

class InfoRenderer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
        return false;
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    render() {
        const {
            value,
            fieldsList,
            uuid,
            modelName,
        } = this.props;
        const {
            open,
        } = this.state;
        const fullScreen = false;

        return (
            <div>
                <Icon
                    onClick={this.handleClickOpen}
                    aria-label={E.Lang.translate('locals.content.moreinfo')}
                    className={s.moreinfo}
                >
                    info
                </Icon>
                <Dialog
                    maxWidth="md"
                    fullScreen={fullScreen}
                    open={open}
                    onClose={this.handleClose}
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
                        {value.name}

                        <IconButton className={s.IconButton} onClick={this.handleClose} aria-label="Close">
                            <Icon>close</Icon>
                        </IconButton>

                    </DialogTitle>
                    <DialogContent>
                        <ShowLeadLayout
                            fieldsList={fieldsList}
                            value={value}
                            showgoogleMaps
                            isOpen={open}
                            uuid={uuid}
                            modelName={modelName}
                        />


                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

InfoRenderer.propTypes = {
    fieldsList: PropTypes.shape({}).isRequired,
    modelName: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    value: PropTypes.shape({
        name: PropTypes.string,
    }),
};

InfoRenderer.defaultProps = {
    value: {
        name: '',
    },
};

export default (withMobileDialog()(InfoRenderer));
