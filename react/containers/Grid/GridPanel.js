/* eslint no-nested-ternary: [0] */
/* eslint react/sort-comp: [0] */

import { cloneDeep } from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Hidden,
    Icon,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import uuidv4 from 'uuid/v4';
import GridToolbar from './GridToolbar/GridToolbar';
import GridHeader from './GridHeader/GridHeader';
import s from './GridPanel.scss';
import DebouncedTextfield from '../../components/DebouncedTextfield/DebouncedTextfield';
import Aux from '../../hoc/Aux/Aux';
// ACTIONS
import {
    setContent as setContentAction,
    setShowContent as setShowContentAction,
} from '../../store/actions/contents';
import {
    gridCsvGenerate as gridCsvGenerateAction,
    gridEditData as gridEditDataAction,
    gridRequestData as gridRequestDataAction,
    gridRequestUpdate as gridRequestUpdateAction,
    gridUndoEdits as gridUndoEditsAction,
} from '../../store/actions/grid';


class GridPanel extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleSendUpdate = this.handleSendUpdate.bind(this);
        this.handleDataReset = this.handleDataReset.bind(this);
        this.updatableCells = [];
        this.updatableCellsIds = [];

        this.state = {
            sorting: {},
            selected: [],
            page: 0,
            rowsPerPage: 20,
            order: 'asc',
            orderBy: '',
            csvDialogOpen: false,
        };
    }

    componentDidMount() {
        const {
            propData,
            gridRequestData,
            modelName,
            urlConfig,
            uuid,
        } = this.props;
        if (!propData) { // Data needs to be fetched from server
            gridRequestData({
                modelName,
                urlConfig,
                uuid,
            });
        } else {
            // data from property is used
        }
    }

    showContent(content) {
        const {
            setShowContent,
            setContent,
        } = this.props;
        setContent(content);
        setShowContent(true);
    }

    handleRequestSort = (event, property, model, orderProp, orderBy) => {
        const {
            urlConfig,
            modelName,
            uuid,
            gridRequestData,
        } = this.props;
        const {
            filter,
            page,
            rowsPerPage,
        } = this.state;
        let order = 'desc';

        if (orderBy === property && orderProp === 'desc') {
            order = 'asc';
        }

        const sortField = `${model}.${property}`;

        // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
        // ES6 syntax to use variable as object key
        this.setState({
            sorting: { [sortField]: order },
            orderBy: property,
            order,
            page: 0,
        });

        gridRequestData({
            modelName,
            urlConfig,
            filter,
            sorting: { [sortField]: order }, // See above
            page,
            rowsPerPage,
            uuid,
        });
    };

    handleSelectAllClick = (event, checked) => {
        const {
            modelName,
            data,
        } = this.props;
        if (checked) {
            this.setState({ selected: data[modelName].map((n) => n.id) });
            return;
        }
        this.setState({ selected: [] });
    };

    handleSelectClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        const {
            urlConfig,
            modelName,
            uuid,
            gridRequestData,
        } = this.props;
        const {
            filter,
            sorting,
            rowsPerPage,
        } = this.state;
        this.setState({ page });
        gridRequestData({
            modelName,
            urlConfig,
            filter,
            sorting,
            page,
            rowsPerPage,
            uuid,
        });
    };

    handleFilter = (filter) => {
        const {
            urlConfig,
            modelName,
            uuid,
            gridRequestData,
        } = this.props;
        const {
            sorting,
            rowsPerPage,
        } = this.state;
        this.setState({
            filter,
            page: 0,
        });
        gridRequestData({
            modelName,
            urlConfig,
            filter,
            sorting,
            page: 0,
            rowsPerPage,
            uuid,
        });
    };

    handleTextSearch = (text) => {
        const {
            uuid,
            urlConfig,
            modelName,
            columnDefs,
            gridRequestData,
        } = this.props;
        const {
            sorting,
            rowsPerPage,
        } = this.state;
        let filter = '{"or":{';

        Object.entries(columnDefs).forEach((coldef) => {
            if (coldef.sortable) {
                filter += `"${coldef.model}.${coldef.field}":"${text}",`;
            }
        });

        filter = filter.slice(0, -1);
        filter += '}}';

        this.setState({
            filter,
            page: 0,
        });
        gridRequestData({
            modelName,
            urlConfig,
            filter,
            sorting,
            page: 0,
            rowsPerPage,
            uuid,
        });
    };


    handleChangeRowsPerPage = (event) => {
        const {
            urlConfig,
            modelName,
            uuid,
            gridRequestData,
        } = this.props;
        const {
            sorting,
            filter,
        } = this.state;
        this.setState({
            rowsPerPage: event.target.value,
            page: 0,
        });
        gridRequestData({
            modelName,
            urlConfig,
            filter,
            sorting,
            page: 0,
            rowsPerPage: event.target.value,
            uuid,
        });
    };

    handleRefresh = () => {
        const {
            gridUndoEdits,
            urlConfig,
            modelName,
            uuid,
            gridRequestData,
        } = this.props;
        const {
            sorting,
            filter,
            page,
            rowsPerPage,
        } = this.state;
        gridRequestData({
            modelName,
            urlConfig,
            filter,
            sorting,
            page,
            rowsPerPage,
            uuid,
        });
        this.setState({
            selected: [],
        });
        gridUndoEdits({ uuid });
        Object.entries(this.updatableCellsIds).forEach((id) => {
            if (this.updatableCells[id]) { this.updatableCells[id].resetToDefault(); }
        });
    };

    /* This function only handles the direct event of the user editing the data. Nothing is send to the server */
    handleDataUpdate = (event) => {
        const {
            gridEditData,
            modelName,
            uuid,
        } = this.props;
        gridEditData({
            uuid,
            modelName,
            event,
        });
    };

    /* This function actually sends the data to the server */
    handleSendUpdate = () => {
        const {
            updateData,
            gridRequestUpdate,
            modelName,
            updateUrlConfig,
            uuid,
        } = this.props;
        gridRequestUpdate({
            modelName,
            urlConfig: updateUrlConfig,
            uuid,
            data: { [modelName]: updateData },
        });
    };

    handleDataReset() {
        const {
            gridUndoEdits,
            uuid,
        } = this.props;
        gridUndoEdits({ uuid });
        Object.entries(this.updatableCellsIds).forEach((id) => {
            if (this.updatableCells[id]) { this.updatableCells[id].resetToDefault(); }
        });
    }

    handleCSVClick = () => {
        this.csvDialogHandleOpen();
    };

    csvDialogHandleOpen = () => {
        const {
            urlConfig,
            modelName,
            gridCsvGenerate,
            uuid,
        } = this.props;
        const {
            sorting,
            filter,
        } = this.state;

        this.setState({ csvDialogOpen: true });

        const urlCsvConfig = cloneDeep(urlConfig);
        urlCsvConfig.additionalParams.push({ key: 'export', value: 'csv' });

        gridCsvGenerate({
            modelName,
            urlConfig: urlCsvConfig,
            filter,
            sorting,
            uuid,
        });
    };

    csvDialogHandleClose = () => {
        this.setState({ csvDialogOpen: false });
    };

    isSelected = (id) => {
        const {
            selected,
        } = this.state;
        return selected.indexOf(id) !== -1;
    };

    render() {
        const {
            columnDefs,
            modelName,
            selectable,
            loading,
            updateData,
            heading,
            propData,
            cvsDownload,
            uuid,
            hideToolbar,
            data,
            toolbarActions,
            hidePagination,
            csvData,
            updating,
            rowContentClick,
        } = this.props;
        const {
            order,
            orderBy,
            selected,
            rowsPerPage,
            page,
            csvDialogOpen,
        } = this.state;
        let linearProgress = '';
        let downloadTitle = E.Lang.translate('globals.grid.download.processing');
        let downloadInfo = '';
        let downloadButton = '';

        if (csvData === false) {
            linearProgress = (
                <div
                    className={`progressBarcontainer ${s.progressBarcontainer}`}
                >
                    <LinearProgress className={s.progressBar} />
                </div>
            );
        } else {
            downloadTitle = E.Lang.translate('globals.grid.download.title');
            downloadButton = (
                <a
                    href={csvData.result.added.File[0].download}
                    className="button"
                    download={csvData.result.added.File[0].name}
                >
                    {E.Lang.translate('globals.grid.download.button')}
                </a>
            );
            downloadInfo = <p>{E.Lang.translate('globals.grid.download.success')}</p>;
        }


        const csvDialog = (
            <Dialog
                maxWidth="md"
                // fullScreen={fullScreen}
                open={csvDialogOpen}
                onClose={this.csvDialogHandleClose}
                // transition={Transition}
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
                    {downloadTitle}
                    <IconButton className={s.IconButton} onClick={this.csvDialogHandleClose} aria-label="Close">
                        <Icon>close</Icon>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className={s.box}>
                        {linearProgress}
                        {downloadInfo}
                        <p>{downloadButton}</p>
                    </div>
                </DialogContent>
            </Dialog>
        );

        const gridData = propData || (data || [])[modelName] || [];

        return (
            <Aux>
                <Paper className={s.root}>
                    <Aux>
                        { !hideToolbar
                        && (
                            <GridToolbar
                                classes={{
                                    root: s.pagination,
                                }}
                                heading={heading}
                                numSelected={selected.length}
                                onRefresh={this.handleRefresh}
                                onFilter={this.handleFilter}
                                onSendUpdate={this.handleSendUpdate}
                                numUpdated={updateData.length}
                                updating={updating}
                                onReset={this.handleDataReset}
                                uuid={uuid}
                                onTextSearch={this.handleTextSearch}
                                cvsDownload={cvsDownload}
                                onCSVClick={this.handleCSVClick}
                                toolbarActions={toolbarActions}
                            />
                        )}

                        <div className={s.tableWrapper}>
                            {!loading ? (
                                <Table className={s.table}>
                                    <GridHeader
                                        classes={{
                                            root: s.pagination,
                                            active: s.active,

                                        }}
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={this.handleSelectAllClick}
                                        onRequestSort={this.handleRequestSort}
                                        rowCount={gridData.length}
                                        columnDefs={columnDefs}
                                        selectable={selectable}

                                    />
                                    <TableBody>
                                        {gridData.map((row, idx) => {
                                            const isSelected = this.isSelected(row.id);
                                            return (
                                                <TableRow
                                                    onClick={() => { if (rowContentClick) { this.showContent(row); } return false; }}
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    tabIndex={-1}
                                                    key={row.id ? row.id : idx}
                                                    selected={isSelected}
                                                    className={row.active ? s.gridRow : `${s.gridRow} ${s.gridRowNoActive}`}
                                                >
                                                    { selectable
                                                    && (
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                className={s.gridCheckbox}
                                                                onChange={(event) => this.handleSelectClick(event, row.id)}
                                                            />
                                                        </TableCell>
                                                    )}

                                                    {
                                                        columnDefs.map((col) => {
                                                            const text = (row[col.field] || '').toString();
                                                            const link = col.link ? col.link.replace(/:id/, `${row.id}`) : null;
                                                            const hiddenProp = { [col.hidden]: true };
                                                            const fieldList = col.fieldList ? col.fieldList : [];
                                                            const fullRow = col.fullRow ? row : [];
                                                            const tdClassName = col.tdClassName ? col.tdClassName : '';

                                                            const cell = (
                                                                <TableCell
                                                                    align={col.align && col.align !== '' ? col.align : 'inherit'}
                                                                    className={`${s.gridCell} ${tdClassName}`}
                                                                    padding="none"
                                                                >
                                                                    {
                                                                        col.cellComponent ? (

                                                                            <col.cellComponent
                                                                                fieldsList={fieldList}
                                                                                fullRow={fullRow}
                                                                                idx={idx}
                                                                                uuid={uuid}
                                                                                modelName={modelName}
                                                                                value={row[col.field]
                                                                                || (col.field instanceof Array
                                                                                    ? [...col.field.map((v) => row[v])] : row)}
                                                                            />

                                                                        ) : (
                                                                            col.edittype ? (
                                                                                <Aux>
                                                                                    <DebouncedTextfield
                                                                                        margin="none"
                                                                                        dataid={row.id}
                                                                                        datacol={col.field}
                                                                                        changed={this.handleDataUpdate}
                                                                                        value={text}
                                                                                        ref={(editcell) => {
                                                                                            const cellId = uuidv4();
                                                                                            this.updatableCells[cellId] = editcell;
                                                                                            this.updatableCellsIds.push(cellId);
                                                                                        }}
                                                                                        markchanges
                                                                                    />
                                                                                </Aux>
                                                                            ) : (
                                                                                <Aux>
                                                                                    {link ? (
                                                                                        <Link href={link} to={link}>{text}</Link>
                                                                                    ) : (
                                                                                        <Aux>{text}</Aux>
                                                                                    )}
                                                                                </Aux>
                                                                            )
                                                                        )
                                                                    }
                                                                </TableCell>
                                                            );


                                                            return (
                                                                <Aux key={col.field + row.id + col.title}>
                                                                    { col.hidden ? (
                                                                        <Hidden {...hiddenProp}>
                                                                            {cell}
                                                                        </Hidden>
                                                                    ) : (
                                                                        cell
                                                                    )}
                                                                </Aux>
                                                            );
                                                        })
                                                    }
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        { !hidePagination
                                        && (
                                            <TableRow>
                                                <TablePagination
                                                    colSpan={9}
                                                    count={propData ? propData.lenght : data.total ? data.total : 0}
                                                    rowsPerPage={rowsPerPage}
                                                    rowsPerPageOptions={[10, 20, 50, 100, 500]}
                                                    labelRowsPerPage={E.Lang.translate('globals.grid.pagination.rowsperpage.title')}
                                                    labelDisplayedRows={
                                                        ({ from, to, count }) => {
                                                            E.Lang.translate('globals.grid.pagination.displayedrows.title', from, to, count);
                                                        }
                                                    }
                                                    page={page}
                                                    onChangePage={this.handleChangePage}
                                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                    // actions={GridPagination}
                                                    classes={{
                                                        root: s.pagination,
                                                        toolbar: s.toolbar,
                                                        actions: s.actions,
                                                        caption: s.caption,
                                                        spacer: s.spacer,
                                                        input: s.input,
                                                        selectRoot: s.selectRoot,
                                                        select: s.select,
                                                        selectIcon: s.selectIcon,
                                                    }}
                                                />
                                            </TableRow>
                                        )}
                                    </TableFooter>
                                </Table>
                            ) : (
                                <div className={`${s.overlay} loading`}>
                                    <div
                                        className={`progressBarcontainer ${s.progressBarcontainer}`}
                                    >
                                        <LinearProgress
                                            className={s.progressBar}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Aux>
                </Paper>
                {csvDialog }
            </Aux>
        );
    }
}

GridPanel.propTypes = {
    columnDefs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    urlConfig: PropTypes.shape({
        url: PropTypes.string,
        addParams: PropTypes.array,
    }),
    updateUrlConfig: PropTypes.shape({
        url: PropTypes.string,
        addParams: PropTypes.array,
    }),
    heading: PropTypes.string.isRequired,
    modelName: PropTypes.string.isRequired,
    data: PropTypes.shape({
        jsonData: PropTypes.shape({
            total: PropTypes.number.isRequired,
        }),
        Lead: PropTypes.arrayOf(PropTypes.shape({})),
        total: PropTypes.number,
    }),
    uuid: PropTypes.string.isRequired,
    cvsDownload: PropTypes.bool,
    cvsLinkDownload: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string,
    ]),
    cvsLinkGenerate: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string,
    ]),
    propData: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.array,
    ]),
    csvData: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.shape({}),
    ]),
    hidePagination: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    selectable: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    rowContentClick: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.element,
        PropTypes.func,
    ]),
    loading: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    hideToolbar: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    toolbarActions: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.element,
    ]),
    updating: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    updateData: PropTypes.arrayOf(PropTypes.shape({})),
    gridRequestData: PropTypes.func.isRequired,
    gridRequestUpdate: PropTypes.func.isRequired,
    gridEditData: PropTypes.func.isRequired,
    gridUndoEdits: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
    setShowContent: PropTypes.func.isRequired,
    gridCsvGenerate: PropTypes.func.isRequired,
};

GridPanel.defaultProps = {
    cvsDownload: false,
    cvsLinkDownload: '',
    cvsLinkGenerate: '',
    data: {},
    propData: false,
    hidePagination: false,
    selectable: false,
    rowContentClick: false,
    loading: false,
    hideToolbar: false,
    urlConfig: {},
    toolbarActions: false,
    updateUrlConfig: {},
    updateData: [],
    csvData: false,
    updating: false,
};

const mapStateToProps = (state, props) => ({
    data: (state.grid[props.uuid] || { jsonData: { total: 0 } }).jsonData,
    loading: (state.grid[props.uuid] || {}).loading,
    updating: (state.grid[props.uuid] || {}).updating,
    updateData: ((state.grid[props.uuid] || {}).updateData) || [],
    csvData: state.grid.csvData,
});

const mapDispatchToProps = {
    gridRequestData: gridRequestDataAction,
    gridRequestUpdate: gridRequestUpdateAction,
    gridEditData: gridEditDataAction,
    gridUndoEdits: gridUndoEditsAction,
    setContent: setContentAction,
    setShowContent: setShowContentAction,
    gridCsvGenerate: gridCsvGenerateAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(GridPanel);
