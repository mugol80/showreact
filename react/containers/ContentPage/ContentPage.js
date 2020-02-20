import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// ACTIONS
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
import { showProgressBar as showProgressBarAction } from '../../store/actions/dashboard';
import {
    setContent as setContentAction,
    setShowContent as setShowContentAction,
} from '../../store/actions/contents';
// COMPONENTS/CONTAINERS
import GridPanel from '../Grid/GridPanel';
import ContentMoreRenderer from '../../components/ContentMoreRenderer/ContentMoreRenderer';
import DownloadContent from '../../components/DownloadContent/DownloadContent';
import ContentBox from '../../components/ContentBox/ContentBox';
// CSS
import s from './ContentPage.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class ContentPage extends React.Component {
    // Resizing: http://code.hootsuite.com/resizing-react-components/
    // http://www.react.express/refs_and_the_dom

    constructor(props) {
        super(props);

        this.columnDefs = [
            {
                title: '',
                field: '',
                model: 'Content',
                cellComponent: ContentMoreRenderer,
                sortable: false,
                fullRow: true,
                contentClick: true,
                tdClassName: 'td-info',
            },
            {
                title: E.Lang.translate('locals.leadpage.tablecolumn.contentname'),
                field: 'name',
                model: 'Content',
                sortable: false,
                contentClick: true,
            },
            {
                title: E.Lang.translate('locals.leadpage.tablecolumn.contenttype'),
                field: 'type',
                model: 'Content',
                sortable: false,
                contentClick: true,
            },

            {
                title: E.Lang.translate('locals.leadpage.tablecolumn.download'),
                field: 'source',
                model: 'Content',
                cellComponent: DownloadContent,
                sortable: false,
                fullRow: true,
                align: 'right',
            },
        ];

        this.handleWindowResize = _.debounce(this.handleWindowResize.bind(this), 100);
        this.state = {
            open: false,
            containerWidthMore: 0,
        };
    }

    componentDidMount() {
        const {
            setShowContent,
            clearMessages,
            setContent,
        } = this.props;
        clearMessages();
        this.handleWindowResize();
        window.addEventListener('resize', this.handleWindowResize);
        setContent('');
        setShowContent(false);
    }

    componentWillUnmount() {
        const {
            setShowContent,
            setContent,
        } = this.props;
        window.removeEventListener('resize', this.handleWindowResize);
        setContent('');
        setShowContent(false);
    }

    handleClose = () => {
        const { setShowContent } = this.props;
        setShowContent(false);
    };

    handleWindowResize() {
        const {
            open,
            containerWidthMore,
        } = this.state;
        if (!this.containerTargetMore || containerWidthMore === this.containerTargetMore.offsetWidth
        ) {
            return;
        }

        if (open) {
            this.setState({
                containerWidthMore: this.containerTargetMore.offsetWidth,
            });
        }
    }


    render() {
        const {
            content,
            showContent,
            setContent,
        } = this.props;
        const {
            containerWidthMore,
            open,
        } = this.state;
        let dialog = '';
        let inBoxMore = '';
        if (content !== '') {
            inBoxMore = <ContentBox content={content} showPager width={containerWidthMore} />;

            dialog = (
                <Dialog
                    fullScreen
                    open={showContent}
                    onExited={() => { setContent(''); }}
                    onClose={this.handleClose}
                    classes={{
                        root: s.rootDialog,
                        paper: s.paper,
                    }}
                >
                    <DialogTitle
                        id="responsive-dialog-title"
                        classes={{
                            root: s.rootDialogTitle,
                        }}
                    >
                        {content.name}
                        <IconButton className={s.IconButton} onClick={this.handleClose} aria-label="Close">
                            <Icon>close</Icon>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div
                            className={s.toCenter}
                            ref={(node) => {
                                // this callback executes before componentDidMount
                                if (node !== null) {
                                    this.containerTargetMore = node;
                                    if (open) {
                                        this.handleWindowResize();
                                    }
                                }
                            }}
                        >
                            {inBoxMore}
                        </div>
                    </DialogContent>

                </Dialog>
            );
        }

        return (
            <div className="accountForm">
                <div className="header">
                    <div className="contentContainerCenter">
                        <h1>
                            <Lang>locals.content.title.contents</Lang>
                            <br />
                            <span><Lang>locals.content.titlesmall</Lang></span>
                        </h1>
                    </div>
                </div>
                <div className="content">
                    <div className="contentContainerCenter">
                        <GridPanel
                            className={s.myContentsPage}
                            modelName="Content" /* For identifing the data in the store & state and finding in json */
                            uuid="CONTENTSGRID"
                            urlConfig={{
                                /* Several informations for building the request-url */
                                url: 'contents/index',
                                additionalParams: [
                                    {
                                        key: 'format',
                                        value: 'json',
                                    },
                                ],
                            }}
                            columnDefs={this.columnDefs} /* Defines all informations about the tables columns */
                            heading="Contents" /* Heading text above table */
                            rowContentClick
                            deletable
                        />
                    </div>
                    {dialog}
                </div>
            </div>
        );
    }
}

ContentPage.propTypes = {
    contents: PropTypes.shape({
        contentsList: PropTypes.array,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        showContent: PropTypes.bool,
        inProgress: PropTypes.bool,
    }),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.shape({})]),
    clearMessages: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
    setShowContent: PropTypes.func.isRequired,
    showContent: PropTypes.bool,
};

ContentPage.defaultProps = {
    contents: {
        contentsList: [],
        content: '',
        showContent: false,
        inProgress: false,
    },
    content: '',
    showContent: false,
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    contentsList: state.contents.contentsList,
    content: state.contents.content,
    showContent: state.contents.showContent,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    showProgressBar: showProgressBarAction,
    clearMessages: clearMessagesAction,
    setContent: setContentAction,
    setShowContent: setShowContentAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
