import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button, Icon } from '@material-ui/core';
import { bindActionCreators } from 'redux';
// ACTIONS
import { sectionNewLead as sectionNewLeadAction } from '../../store/actions/newLead';
import { clearMessages as clearMessagesAction } from '../../store/actions/backMessages';
// CSS
import './NewLeadForm.scss';

import Lang from '../../hoc/Lang/Lang';

class NewLeadFormMessage extends React.Component {
    componentWillUnmount() {
        const {
            clearMessages,
            sectionNewLead,
        } = this.props;

        clearMessages();
        sectionNewLead({ section: 'form' });
    }

    changeSection(section) {
        const {
            clearMessages,
            sectionNewLead,
        } = this.props;

        clearMessages();
        sectionNewLead({ section });
    }

    render() {
        const { backMessages } = this.props;
        let dataBackValues = [];
        if (backMessages) {
            dataBackValues = backMessages;
        }

        return (
            <div>
                <h2 className="title"><Lang>locals.newleadform.title</Lang></h2>
                <div className="statementsContainer">
                    {dataBackValues.map((val) => (
                        <p key={val.type} className={`statement ${val.type}`}>
                            <Icon>{val.icon}</Icon>
                            {val.message}
                        </p>
                    ))}
                </div>
                <div className="buttonPlace alignLeft">
                    <Button
                        className="button"
                        onClick={() => this.changeSection('form')}
                    >
                        <Lang>locals.newleadform.button.addnewlead</Lang>
                    </Button>
                    <NavLink to="/" exact className="buttonWhite">
                        <Lang>locals.newleadform.button.back</Lang>
                    </NavLink>
                </div>
            </div>
        );
    }
}

NewLeadFormMessage.propTypes = {
    backMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.array]),
    clearMessages: PropTypes.func.isRequired,
    sectionNewLead: PropTypes.func.isRequired,
};

NewLeadFormMessage.defaultProps = {
    backMessages: null,
};


const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    sectionNewLead: sectionNewLeadAction,
    clearMessages: clearMessagesAction,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(NewLeadFormMessage);
