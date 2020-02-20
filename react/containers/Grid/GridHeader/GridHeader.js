import React from 'react';
import PropTypes from 'prop-types';
import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import Aux from '../../../hoc/Aux/Aux';
import s from '../GridPanel.scss';

export default class GridHeader extends React.Component {
    createSortHandler = (property, model, order, orderBy) => (event) => {
        const { onRequestSort } = this.props;
        onRequestSort(event, property, model, order, orderBy);
    };

    render() {
        const {
            onSelectAllClick,
            order,
            orderBy,
            numSelected,
            rowCount,
            columnDefs,
            selectable,
        } = this.props;
        return (
            <TableHead>
                <TableRow>
                    {selectable
                    && (
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={numSelected === rowCount}
                                onChange={onSelectAllClick}
                            />
                        </TableCell>
                    )}
                    {columnDefs.map((column) => {
                        const cell = (
                            <TableCell
                                key={column.field + column.title}
                                align={column.align && column.align !== '' ? column.align : 'inherit'}
                                padding="none"
                                sortDirection={orderBy === column.field ? order : false}
                            >
                                <Tooltip
                                    title={column.sortable ? 'Sort' : 'Not Sortable'}
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.field && column.field !== ''}
                                        direction={order}
                                        onClick={column.sortable ? this.createSortHandler(column.field, column.model, order, orderBy) : null}
                                        classes={{
                                            root: s.tableSortLabelRoot,
                                            active: s.tableSortLabelActive,
                                            icon: column.sortable ? s.tableSortLabelIcon : s.tableSortLabelIcon_hidden,
                                        }}
                                    >
                                        {column.title}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                        const hiddenProp = { [column.hidden]: true };
                        return (
                            <Aux key={column.field + column.title}>
                                {column.hidden ? (
                                    <Hidden {...hiddenProp} key={column.field + column.title}>
                                        {cell}
                                    </Hidden>
                                ) : (
                                    cell
                                )}
                            </Aux>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

GridHeader.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    columnDefs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array])).isRequired,
    selectable: PropTypes.bool,
};

GridHeader.defaultProps = {
    selectable: false,
};
