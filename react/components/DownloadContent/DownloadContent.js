/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Icon } from '@material-ui/core';
import PropTypes from 'prop-types';

export default class DownloadContent extends React.Component {
    render() {
        const { fullRow } = this.props;
        let download = '';

        if (fullRow.type === 'pdf') {
            download = (
                <a
                    href={fullRow.source}
                    onClick={(e) => e.stopPropagation()}
                    download={fullRow.name}
                >
                    <Icon>file_download</Icon>
                </a>
            );
        }
        return (
            <span>
                {download}
            </span>
        );
    }
}

DownloadContent.propTypes = {
    fullRow: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.shape({})]).isRequired,
};
