import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';
import { TextField } from '@material-ui/core';

export default class DebouncedTextfield extends React.Component {
    constructor(props) {
        super(props);

        const { onChange } = this.props;

        this.state = {
            value: props.value,
        };

        // debounce the passed in dispatch method
        this.onChange = debounce(250, onChange);
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;

        if (value !== prevProps.value) {
            // setState is ok if wrapped in condition
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ value });
        }
    }

    handleChange = (e) => {
        e.persist();
        const { value } = this.state;
        this.setState({ value: e.target.value }, () => {
            // Only trigger onChange if the value was changed.
            // This prevents unindented calls of onChange and therefore leads to unexpected behavior in parent components
            // (e.g. in NewLeads form its opening a autocomplete again or refreshes the map)
            if (e.target.value !== value) {
                this.onChange(e);
            }
        });
    };

    resetToDefault = () => {
        const { value } = this.props;

        this.setState({ value });
    };

    render() {
        const { value } = this.state;

        return (
            <TextField
                {...this.props}
                onChange={this.handleChange}
                onBlur={this.handleChange}
                value={value}
            />
        );
    }
}

DebouncedTextfield.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};
