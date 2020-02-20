import React from 'react';
import ReactPlayer from 'react-player';
import {
    Document,
    Page,
    pdfjs,
} from 'react-pdf';
import {
    Button,
    FormControl,
    MenuItem,
    Select,
} from '@material-ui/core';
import PropTypes from 'prop-types';
// CSS
import s from './ContentBox.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

// use pdf sources from an external CDN
const pdfjsWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const pdfjsCMapSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

export default class ContentBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numPages: 0,
            currentPage: 1,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    changeCurrentPage = (count) => {
        const { currentPage } = this.state;
        this.setState({
            currentPage: currentPage + count,
        });
    };

    handleInputChange(e) {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        this.setState({
            [name]: value,
        });
    }

    pageButtonRender() {
        const {
            showPager,
        } = this.props;
        const {
            numPages,
            currentPage,
        } = this.state;
        const buttons = [];
        buttons.next = '';
        buttons.prev = '';
        buttons.goToPage = '';

        if (!showPager) {
            return buttons;
        }

        if (currentPage > 1) {
            buttons.prev = (
                <Button
                    className={`${s.button} buttonWhite`}
                    onClick={() => this.changeCurrentPage(-1)}
                >
                    <Lang>locals.content.prev</Lang>
                </Button>
            );
        } else {
            buttons.prev = (
                <Button
                    className={`${s.button} buttonWhite`}
                    disabled
                >
                    <Lang>locals.content.prev</Lang>
                </Button>
            );
        }
        if (currentPage < numPages) {
            buttons.next = (
                <Button
                    className={`${s.button} buttonWhite`}
                    onClick={() => this.changeCurrentPage(1)}
                >
                    <Lang>locals.content.next</Lang>
                </Button>
            );
        } else {
            buttons.next = (
                <Button
                    className={`${s.button} buttonWhite`}
                    disabled
                >
                    <Lang>locals.content.next</Lang>
                </Button>
            );
        }

        // Jump to page
        const menuItems = [];
        if (numPages > 0) {
            for (let i = 1; i <= numPages; i++) {
                menuItems[i] = i;
            }
        }

        buttons.goToPage = (
            <FormControl className={s.pageControl}>
                <Select
                    value={currentPage}
                    onChange={this.handleInputChange}
                    inputProps={{
                        id: 'currentPage',
                        name: 'currentPage',
                    }}
                >
                    {menuItems.map((i) => (
                        <MenuItem key={i} value={i}>
                            <em>{i}</em>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );

        return buttons;
    }

    renderContent = (item) => {
        let internalUri = null;
        let internalFilename = [];
        if (item.type === 'video') {
            if (typeof window.GS.downloadFile === 'function' && item.source.indexOf('://') === -1) {
                internalFilename = item.source.split('/');
                internalFilename = internalFilename[internalFilename.length - 1];

                internalUri = window.GS.getInternalFileUri(internalFilename, !!(window.cordova && window.cordova.platformId === 'ios'));

                window.GS.fileExists(internalFilename, (success) => {
                    if (!success) {
                        window.GS.downloadFile(window.baseUrl + item.source, internalFilename);
                    }
                });
            }

            if (internalUri && window.cordova && window.cordova.platformId === 'ios') {
                return (
                    <button
                        type="button"
                        className="button"
                        onClick={() => {
                            window.open(internalUri, '_blank');
                        }}
                    >
                        OPEN
                    </button>
                );
            }
            return (
                <div className={s.playerWrapper}>
                    <ReactPlayer
                        url={internalUri || item.source}
                        className={s.reactPlayer}
                        controls
                    />
                </div>
            );
        }

        if (item.type === 'pdf') {
            const {
                content,
                width,
                page: pageProps,
            } = this.props;
            const {
                currentPage,
            } = this.state;
            const page = this.pageButtonRender();
            if (typeof window.GS.downloadFile === 'function' && item.source.indexOf('://') === -1) {
                internalFilename = content.source.split('/');
                internalFilename = internalFilename[internalFilename.length - 1];

                if (!window.GS.pdfFiles) window.GS.pdfFiles = {};
                internalUri = window.GS.pdfFiles[internalFilename];

                window.GS.fileExists(internalFilename, (success, fileEntry) => {
                    if (!success) {
                        window.GS.downloadFile(window.baseUrl + content.source, internalFilename); // TODO: force render again
                    } else if (!window.GS.pdfFiles[internalFilename]) {
                        // if pdf is found, reference to it as File instance as react-pdf only accepts Blob but no cdvfile path
                        // TODO: move this to a different location, not the render function
                        fileEntry.file((file) => {
                            window.GS.pdfFiles[internalFilename] = file; // TODO: force render again
                        });
                    }
                });
            }

            return (
                <Document
                    loading={E.Lang.translate('locals.content.loadpdf')}
                    onLoadSuccess={
                        (pdfResponse) => {
                            if (!pageProps) {
                                this.setState({ numPages: pdfResponse.numPages });
                            }
                        }
                    }
                    file={internalUri || item.source}
                >
                    <Page
                        className={s.pageContainer}
                        pageNumber={currentPage}
                        key={currentPage}
                        width={width}
                        options={{
                            cMapUrl: pdfjsCMapSrc,
                            cMapPacked: true,
                        }}
                    />
                    <div className={s.pageBox}>
                        {page.prev}
                        {page.next}
                        <div className={s.goToPage}>{page.goToPage}</div>
                    </div>
                </Document>
            );
        }
        return false;
    };

    render() {
        const { content } = this.props;
        const showBox = this.renderContent(content);

        return (
            <div className={content.type === 'pdf' ? s.center : s.full}>
                {showBox}
            </div>
        );
    }
}

ContentBox.propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.shape({})]).isRequired,
    page: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]).isRequired,
    showPager: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
};

ContentBox.defaultProps = {
    page: false,
    showPager: false,
};
