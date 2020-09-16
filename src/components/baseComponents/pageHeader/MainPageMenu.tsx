import React, { Component } from "react";
import { User } from "model/user";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'


import { ReduxCombinedState } from 'redux/reducers';
import notificationActions from 'redux/actions/notifications';
import { Notification } from 'model/notifications';

import LogoutDialog from "../logoutDialog/LogoutDialog";
import NotificationPanel from "components/baseComponents/notificationPanel/NotificationPanel";
import MenuDropdown from './MenuDropdown';
import BellButton from './bellButton/BellButton';
import MoreButton from './MoreButton';

import { PageEnum } from './PageHeadWithMenu';

interface MainPageMenuProps {
  history: any;
  user: User;
  notificationExpanded: boolean;

  notifications: Notification[] | null;
  toggleNotification(): void;
  getNotifications(): void;
}

interface HeaderMenuState {
  dropdownShown: boolean;
  logoutOpen: boolean;
  width: string;
}

class PageHeadWithMenu extends Component<MainPageMenuProps, HeaderMenuState> {
  pageHeader: React.RefObject<any>;

  constructor(props: MainPageMenuProps) {
    super(props);

    this.state = {
      dropdownShown: false,
      logoutOpen: false,
      width: '16vw'
    };

    this.pageHeader = React.createRef();
  }

  showDropdown() {
    this.setState({ ...this.state, dropdownShown: true });
  }

  hideDropdown() {
    this.setState({ ...this.state, dropdownShown: false });
  }

  handleLogoutOpen() {
    this.setState({ ...this.state, logoutOpen: true });
  }

  handleLogoutClose() {
    this.setState({ ...this.state, logoutOpen: false });
  }

  render() {
    let notificationCount = 0;
    if (!this.props.notifications) {
      this.props.getNotifications();
    } else {
      notificationCount = this.props.notifications.length;
    }

    let className = "main-page-menu";
    if (this.props.notificationExpanded) {
      className += " notification-expanded"
    } else if (this.state.dropdownShown) {
      className += " menu-expanded";
    }

    return (
      <div className={className} ref={this.pageHeader}>
        <BellButton notificationCount={notificationCount} onClick={this.props.toggleNotification} />
        <MoreButton onClick={() => this.showDropdown()} />
        <MenuDropdown
          dropdownShown={this.state.dropdownShown}
          hideDropdown={() => this.hideDropdown()}
          user={this.props.user}
          page={PageEnum.MainPage}
          history={this.props.history}
          onLogout={() => this.handleLogoutOpen()}
        />
        <NotificationPanel
          history={this.props.history}
          shown={this.props.notificationExpanded}
          handleClose={this.props.toggleNotification}
          anchorElement={() => ReactDOM.findDOMNode(this.pageHeader.current)}
        />
        <LogoutDialog
          isOpen={this.state.logoutOpen}
          close={() => this.handleLogoutClose()}
          history={this.props.history}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
    notifications: state.notifications.notifications
  });
  
  const mapDispatch = (dispatch: any) => ({
    getNotifications: () => dispatch(notificationActions.getNotifications())
  });

  
const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
export default connector(PageHeadWithMenu);