import React from 'react';
import { NavLink } from 'react-router-dom';
import { CircularProgress, Icon } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// CSS
import m from './MainPage.scss';
// LANG
import Lang from '../../hoc/Lang/Lang';

// eslint-disable-next-line react/prefer-stateless-function
class MainPage extends React.Component {
    render() {
        const {
            user,
            contents,
        } = this.props;
        let menuAllLeads = '';
        if (user.gn_sales_manager) {
            menuAllLeads = (
                <li className="">
                    <div className="middle">
                        <NavLink to="/allleads">
                            <span className="title"><Lang>locals.mainpage.boxlist.allleads</Lang></span>
                            <span className="info">
                                <Icon className="icon">supervised_user_circle</Icon>
                            </span>
                        </NavLink>
                    </div>
                </li>
            );
        }

        let menuLandingPages = '';
        if (contents.inProgress) {
            menuLandingPages = (
                <li className={m.loading}>
                    <div className="middle">
                        <div className="loadingContainer">
                            <CircularProgress size={56} thickness={2} />
                        </div>
                    </div>
                </li>
            );
        } else {
            for (let i = 0; i < contents.contentsList.length; i++) {
                if (contents.contentsList[i].type === 'landingpage') {
                    let url = contents.contentsList[i].source;
                    url = url.replace('%gnRId%', user.id);

                    menuLandingPages = (
                        <li className="">
                            <div className="middle">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="title">{contents.contentsList[i].name}</span>
                                    <span className="info">
                                        <Icon className="icon">stars</Icon>
                                    </span>
                                </a>
                            </div>
                        </li>
                    );
                }
            }
        }

        return (
            <div className="mainPage">
                <div className="header">
                    <div className="contentContainerCenter">
                        <h1>
                            <Lang>locals.mainpage.title.dashboard</Lang>
                            <br />
                            <span><Lang>locals.mainpage.titlesmall.what</Lang></span>
                        </h1>
                    </div>
                </div>
                <div className="content">
                    <div className="contentContainerCenter">
                        <ul className={`boxList ${m.todoList}`}>
                            {menuLandingPages}
                            <li className="add">
                                <div className="middle">
                                    <NavLink to="/newlead">
                                        <span className="title"><Lang>locals.mainpage.boxlist.addnewlead</Lang></span>
                                        <span className="info">
                                            <Icon className="icon">add_circle</Icon>
                                        </span>
                                    </NavLink>
                                </div>
                            </li>
                            <li className="">
                                <div className="middle">
                                    <NavLink to="/myleads">
                                        <span className="title"><Lang>locals.mainpage.boxlist.myleads</Lang></span>
                                        <span className="info">
                                            <Icon className="icon">reorder</Icon>
                                        </span>
                                    </NavLink>
                                </div>
                            </li>
                            {menuAllLeads}
                            <li className="">
                                <div className="middle">
                                    <NavLink to="/contents">
                                        <span className="title"><Lang>locals.mainpage.boxlist.contents</Lang></span>
                                        <span className="info">
                                            <Icon className="icon">view_list</Icon>
                                        </span>
                                    </NavLink>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

MainPage.propTypes = {
    contents: PropTypes.shape({
        contentsList: PropTypes.array,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        showContent: PropTypes.bool,
        inProgress: PropTypes.bool,
    }),
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.bool, PropTypes.shape({})]),
};

MainPage.defaultProps = {
    contents: {
        contentsList: [],
        content: '',
        showContent: false,
        inProgress: false,
    },
    user: {},
};


const mapStateToProps = (state) => ({
    user: state.users.user,
    contents: state.contents,
});

export default connect(mapStateToProps)(MainPage);
