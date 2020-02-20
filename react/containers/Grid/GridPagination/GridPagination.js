import React from 'react';
import PropTypes from 'prop-types';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const GridPaginationStyles = (theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
});


class GridPagination extends React.Component {
    handleFirstPageButtonClick = (event) => {
        const { onChangePage } = this.props;
        onChangePage(event, 0);
    };

    handleBackButtonClick = (event) => {
        const {
            onChangePage,
            page,
        } = this.props;
        onChangePage(event, page - 1);
    };

    handleNextButtonClick = (event) => {
        const {
            onChangePage,
            page,
        } = this.props;
        onChangePage(event, page + 1);
    };

    handleLastPageButtonClick = (event) => {
        const {
            onChangePage,
            rowsPerPage,
            count,
        } = this.props;
        onChangePage(
            event,
            Math.max(0, Math.ceil(count / rowsPerPage) - 1),
        );
    };

    render() {
        const {
            classes, count, page, rowsPerPage,
        } = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label={E.Lang.translate('globals.grid.pagination.firstpage.title')}
                >
                    <FirstPageIcon />
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label={E.Lang.translate('globals.grid.pagination.prevpage.title')}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label={E.Lang.translate('globals.grid.pagination.nextpage.title')}
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label={E.Lang.translate('globals.grid.pagination.lastpage.title')}
                >
                    <LastPageIcon />
                </IconButton>
            </div>
        );
    }
}

GridPagination.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string,
    }).isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default withStyles(GridPaginationStyles, { withTheme: true })(GridPagination);
