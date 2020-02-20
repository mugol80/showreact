import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
// ACTIONS
import { showProgressBar as showProgressBarAction } from '../../store/actions/dashboard';
import { getLeadsFieldsNewLead as getLeadsFieldsNewLeadAction } from '../../store/actions/newLead';
// COMPONENTS/CONTAINERS
import GridPanel from '../Grid/GridPanel';
import StateRenderer from '../../components/StateRenderer/StateRenderer';
import SalesRenderer from '../../components/SalesRenderer/SalesRenderer';
import InfoRenderer from '../../components/InfoRenderer/InfoRenderer';
import LeadOnMap from '../LeadOnMap/LeadOnMap';
// CSS
import s from './AllLeadsPage.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

class AllLeadsPage extends React.Component {
    constructor(props) {
        super(props);
        this.columnDefs = [];
    }

    componentDidMount() {
        const { getLeadsFieldsNewLead } = this.props;
        getLeadsFieldsNewLead();
    }

    columnDef() {
        const { leadsFields } = this.props;
        return [
            {
                title: <Lang>locals.leadpage.tablecolumn.company</Lang>,
                field: 'name',
                model: 'Lead',
                sortable: true,
            }, {
                title: <Lang>locals.leadpage.tablecolumn.name</Lang>,
                field: 'contact_name',
                model: 'Lead',
                sortable: true,
                hidden: 'smDown',
            },
            {
                title: <Lang>locals.leadpage.tablecolumn.stage</Lang>,
                field: 'stage_id',
                model: 'Lead',
                sortable: true,
                cellComponent: StateRenderer,
                padding: 'none',
            },
            {
                title: <Lang>locals.leadpage.tablecolumn.salesman</Lang>,
                field: 'user_id',
                model: 'Lead',
                sortable: false,
                hidden: 'xsDown',
                cellComponent: SalesRenderer,
            },
            {
                title: <Lang>locals.leadpage.tablecolumn.createdate</Lang>,
                field: 'create_date',
                model: 'Lead',
                sortable: true,
                hidden: 'xsDown',
            },
            {
                title: <Lang>locals.leadpage.tablecolumn.email</Lang>,
                field: 'email_from',
                model: 'Lead',
                sortable: true,
                hidden: 'smDown',
            },
            {
                title: <Lang>locals.leadpage.tablecolumn.phone</Lang>,
                field: 'phone',
                model: 'Lead',
                sortable: false,
                hidden: 'mdDown',
            },
            {
                title: <Lang>locals.leadpage.tablecolumn.recommended</Lang>,
                field: 'gn_provision_recommended',
                model: 'Lead',
                sortable: false,
                hidden: 'mdDown',
                cellComponent: SalesRenderer,
            },
            {
                title: '',
                field: '',
                model: 'Lead',
                sortable: false,
                cellComponent: InfoRenderer,
                fieldList: leadsFields.LeadField,
                padding: 'none',
            },
        ];
    }

    render() {
        const { leadsFields } = this.props;
        if (typeof leadsFields.LeadField !== 'undefined') {
            this.columnDefs = this.columnDef();
        }

        return (
            <div className="accountForm">
                <div className="header">
                    <div className="contentContainerCenter">
                        <h1>
                            <Lang>locals.leadpage.title.allleads</Lang>
                            <br />
                            <span><Lang>locals.leadpage.titlesmall.allleadslist</Lang></span>
                        </h1>
                    </div>
                </div>
                <div className="content">
                    <div className="contentContainerCenter">
                        <GridPanel
                            className={s.myLeadPage}
                            modelName="Lead" /* For identifing the data in the store & state and finding in json */
                            uuid="LEADGRID"
                            cvsDownload
                            cvsLinkGenerate="/leads/index?format=json&managed=1&export=csv"
                            urlConfig={{
                                /* Several informations for building the request-url */
                                url: 'leads/index',
                                additionalParams: [
                                    {
                                        key: 'format',
                                        value: 'json',
                                    },
                                    {
                                        key: 'managed',
                                        value: 1,
                                    },
                                ],
                            }}
                            columnDefs={this.columnDefs} /* Defines all informations about the tables columns */
                            heading="Leads" /* Heading text above table */
                            deletable
                            toolbarActions={(
                                <LeadOnMap
                                    modelName="Lead"
                                    uuid="LEADGRID"
                                    mapTitle={E.Lang.translate('locals.leadpage.title.allleads')}
                                    urlConfig={{
                                        /* Several informations for building the request-url */
                                        url: 'leads/index',
                                        additionalParams: [
                                            {
                                                key: 'format',
                                                value: 'json',
                                            },
                                            {
                                                key: 'managed',
                                                value: 1,
                                            },
                                        ],
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

AllLeadsPage.propTypes = {
    getLeadsFieldsNewLead: PropTypes.func.isRequired,
    leadsFields: PropTypes.shape({
        LeadField: PropTypes.shape({
            gn_company_type: PropTypes.shape({ selection: PropTypes.array }),
            gn_mod_campaign: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_franchise: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_timetracking: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_stock: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_presentation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_newsletter: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_homepage: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_marketing: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_menu: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_reservation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_calculation: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_purchase: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_order: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_cashbook: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_loyalty: PropTypes.shape({ string: PropTypes.string }),
            gn_mod_pos: PropTypes.shape({ string: PropTypes.string }),
        }),
    }),
};

AllLeadsPage.defaultProps = {
    leadsFields: {
        LeadField: {},
    },
};

const mapStateToProps = (state) => ({
    backMessages: state.backMessages.messages,
    leadsFields: state.newLead.fields,
});


const mapDispatchToProps = (dispatch) => bindActionCreators({
    showProgressBar: showProgressBarAction,
    getLeadsFieldsNewLead: getLeadsFieldsNewLeadAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AllLeadsPage);
