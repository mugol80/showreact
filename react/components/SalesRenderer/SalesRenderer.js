/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';

export default class SalesRenderer extends React.Component {
    render() {
        const { value } = this.props;
        return (
            <span>
                {value[1]}
            </span>
        );
    }
}

SalesRenderer.propTypes = {
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.shape({})]).isRequired,
};
