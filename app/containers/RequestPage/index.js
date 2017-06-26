/*
 *
 * RequestPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Logger from 'js-logger';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { push } from 'react-router-redux';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionAutorenew from 'material-ui/svg-icons/action/autorenew';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectRequestPage, {
  makeSelectRequest,
  selectErrorExecRequest,
  selectLoadingExecRequest,
  selectRequestList, selectUser,
} from './selectors';
import messages from './messages';
import RequestContainer from './RequestContainer';
import Form from './Form';
import MethodField from './MethodField';
import URLField from './URLField';
import SendButton from './SendButton';
import {
  sendExecRequest,
  sendExecRequestSuccess,
  requestMethodChange,
  requestUrlChange,
  sendGetRequestList,
  cancelExecRequest,
  loadAuthToken,
  sendGetRequest,
  sendCopyRequest, openNewRequest,
} from './actions';


export class RequestPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.initAuthToken();
  }

  componentDidMount() {
    Logger.debug("Lets's rest :)");
    this.props.sendRequestList();
    const requestId = window.location.pathname.split('/').slice(-1).pop();
    if (requestId && requestId !== 'request') {
      this.props.sendGetRequest(requestId);
    }
  }

  render() {
    const request = this.props.request;
    const data = request.get('data');
    const status = request.get('status');
    const loading = this.props.loadingExecRequest;
    const ownRequest = !this.props.user || !this.props.request.get('id') || this.props.user.get('id') === this.props.request.get('user_id');
    const editDisabled = loading || !ownRequest;

    let submitButtonRender = (<SendButton
      label={<FormattedMessage {...messages.send} />}
      primary
      onClick={this.props.onSubmitForm}
    />);
    if (loading) {
      submitButtonRender = (<SendButton
        label={<FormattedMessage {...messages.cancel} />}
        primary
        onClick={this.props.cancelExecRequest}
      />);
    }
    if (!ownRequest) {
      submitButtonRender = (<SendButton
        label={<FormattedMessage {...messages.copyRequest} />}
        primary
        onClick={this.props.sendCopyRequest}
      />);
    }

    let responseRender = null;
    if (status && status.get('status') === 'done') {
      responseRender = (
        <div>
          Response Status: {request.getIn(['response', 'status_code'])}
        </div>
      );
    }

    let errorRender = null;
    if (this.props.errorExecRequest) {
      errorRender = (
        <div>
          Error: {this.props.errorExecRequest}
        </div>
      );
    }

    return (
      <div>
        <AppBar
          title="Title"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <Drawer open>
          <AppBar
            title="Title"
            // iconElementLeft={<IconButton><NavigationClose /></IconButton>}
            iconElementRight={<IconButton><ActionAutorenew /></IconButton>}
            onRightIconButtonTouchTap={this.props.sendRequestList}
            zDepth={0}
          />

          {this.props.requestList.map((h, i) =>
            <MenuItem key={i} onClick={() => this.props.sendExecRequestSuccess(h)}>{h.get('name')}</MenuItem>,
          )}
        </Drawer>
        <Helmet
          title="RequestPage"
          meta={[
            { name: 'description', content: 'Description of RequestPage' },
          ]}
        />

        <Form onSubmit={this.props.onSubmitForm}>
          <SendButton
            label={<FormattedMessage {...messages.newRequest} />}
            onClick={this.props.openNewRequest}
          />

          <RequestContainer>
            <MethodField
              floatingLabelText="Method"
              value={data.get('method')}
              disabled={editDisabled}
              onChange={this.props.onChangeMethod}
            >
              <MenuItem value={'GET'} primaryText="GET" />
              <MenuItem value={'POST'} primaryText="POST" />
              <MenuItem value={'PUT'} primaryText="PUT" />
              <MenuItem value={'DELETE'} primaryText="DELETE" />
            </MethodField>

            <URLField
              hintText="URL"
              floatingLabelText="URL"
              disabled={editDisabled}
              onChange={this.props.onChangeUrl}
              value={data.get('url')}
            />

            {submitButtonRender}
          </RequestContainer>

          {errorRender}
          {responseRender}
        </Form>
      </div>
    );
  }
}

RequestPage.propTypes = {
  onChangeMethod: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  cancelExecRequest: PropTypes.func.isRequired,
  sendRequestList: PropTypes.func.isRequired,
  sendGetRequest: PropTypes.func.isRequired,
  initAuthToken: PropTypes.func.isRequired,
  sendCopyRequest: PropTypes.func.isRequired,
  openNewRequest: PropTypes.func.isRequired,
  sendExecRequestSuccess: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  requestList: PropTypes.object.isRequired,
  errorExecRequest: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
  user: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  loadingExecRequest: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  RequestPage: makeSelectRequestPage(),
  request: makeSelectRequest(),
  errorExecRequest: selectErrorExecRequest(),
  loadingExecRequest: selectLoadingExecRequest(),
  requestList: selectRequestList(),
  user: selectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeMethod: (event, index, method) => dispatch(requestMethodChange(method)),
    onChangeUrl: (evt) => dispatch(requestUrlChange(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(sendExecRequest());
    },
    sendRequestList: (requestId) => dispatch(sendGetRequestList(requestId)),
    cancelExecRequest: () => dispatch(cancelExecRequest()),
    initAuthToken: () => dispatch(loadAuthToken()),
    sendExecRequestSuccess: (req) => {
      dispatch(sendExecRequestSuccess(req));
      dispatch(push(`/request/${req.get('id')}`));
    },
    sendGetRequest: (req) => dispatch(sendGetRequest(req)),
    sendCopyRequest: () => dispatch(sendCopyRequest()),
    openNewRequest: () => {
      dispatch(openNewRequest());
      dispatch(push('/request'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
