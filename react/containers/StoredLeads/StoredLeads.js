import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// MATERIAL-UI
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Drawer,
    Icon,
    IconButton,
    Toolbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';

// ACTIONS
import {
    getStoredLeadsList as getStoredLeadsListAction,
    setShowListWindowOpen as setShowListWindowOpenAction,
} from '../../store/actions/storedLeads';
// CSS
import s from './StoredLeads.scss';

class StoredLeads extends React.Component {
    componentDidMount() {
        const { getStoredLeadsList } = this.props;
        console.log('--StoredLeads--componentDidMount--')
        getStoredLeadsList();
    }

    handleListDialogOpen = (e) => {
        e.stopPropagation();
        const {
            setShowListWindowOpen,
        } = this.props;
        setShowListWindowOpen({ showListWindowOpen: true });
        return false;
    };

    handleListDialogClose = (e) => {
        e.stopPropagation();
        const {
            setShowListWindowOpen,
        } = this.props;
        setShowListWindowOpen({ showListWindowOpen: false });
        return false;
    };

    render() {
        const {
            storedLeadsList,
            showListWindowOpen,
        } = this.props;
        console.log('-------------');
        console.log(storedLeadsList.length);
        console.log('-------------');
        const listDialog = (
            <Dialog
                fullScreen
                open={showListWindowOpen}
                onClose={this.handleListDialogClose}
                classes={{
                    root: s.rootDialog,
                    paper: s.paper,
                }}
            >
                <DialogTitle
                    classes={{
                        root: s.rootDialogTitle,
                    }}
                >
                    Some title here
                    <IconButton
                        className={s.iconButton}
                        onClick={this.handleListDialogClose}
                        aria-label="Close"
                    >
                        <Icon>close</Icon>
                    </IconButton>
                </DialogTitle>
                <div className={s.leadsListContainer}>

                bal la

                </div>
            </Dialog>
        );

        return (
            <div className={s.container}>
                {(storedLeadsList.length > 0 || 1===1) && (
                    <div
                        role="presentation"
                        onClick={this.handleListDialogOpen}
                        className={s.infoBox}
                    >
                        <i
                            className={`${s.icon} material-icons`}
                        >
                            cloud_upload
                        </i>
                        <div className={s.leadsNumberBox}>
                            <span className={s.leadsNumber}>
                                {storedLeadsList.length}
                            </span>
                        </div>
                        {listDialog}
                    </div>
                )}
            </div>
        );
    }
}

StoredLeads.propTypes = {
    storedLeadsList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
    showListWindowOpen: PropTypes.bool,
    getStoredLeadsList: PropTypes.func.isRequired,
    setShowListWindowOpen: PropTypes.func.isRequired,
};

StoredLeads.defaultProps = {
    storedLeadsList: [],
    showListWindowOpen: false,
};

const mapStateToProps = (state) => ({
    storedLeadsList: state.storedLeads.storedLeadsList,
    showListWindowOpen: state.storedLeads.showListWindowOpen,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getStoredLeadsList: getStoredLeadsListAction,
    setShowListWindowOpen: setShowListWindowOpenAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StoredLeads);
