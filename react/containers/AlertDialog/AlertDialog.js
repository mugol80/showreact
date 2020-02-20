/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import Button from '@material-ui/core/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { closeAlert as closeAlertAction } from '../../store/actions/alert';


class AlertDialog extends React.Component {
    render() {
        const {
            open,
            closeAlert,
            title,
            msg,
        } = this.props;
        return (
            <div>
                <Dialog
                    open={open}
                    fullWidth
                    onClose={closeAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {msg}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeAlert} className="button" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AlertDialog.propTypes = {
    title: PropTypes.string,
    msg: PropTypes.string,
    open: PropTypes.bool,
    closeAlert: PropTypes.func.isRequired,
};

AlertDialog.defaultProps = {
    title: '',
    msg: '',
    open: false,
};

const mapStateToProps = (state) => ({
    title: state.alert.title,
    msg: state.alert.msg,
    open: state.alert.open,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ closeAlert: closeAlertAction }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog);
