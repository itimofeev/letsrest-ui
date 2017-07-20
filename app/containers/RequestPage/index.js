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
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import prettyByte from 'pretty-byte';
import prettyMs from 'pretty-ms';
import { push } from 'react-router-redux';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionAutorenew from 'material-ui/svg-icons/action/autorenew';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectRequestPage, {
  makeSelectRequest,
  selectErrorExecRequest,
  selectLoadingExecRequest,
  selectRequestList,
  selectUser,
} from './selectors';
import messages from './messages';
import RequestContainer from './RequestContainer';
import Form from './Form';
import MethodField from './MethodField';
import URLField from './URLField';
import SendButton from './SendButton';
import {
  addHeader,
  cancelExecRequest,
  deleteHeader,
  loadAuthToken,
  openNewRequest,
  requestBodyChange,
  requestMethodChange,
  requestUrlChange,
  sendCopyRequest,
  sendExecRequest,
  sendExecRequestSuccess,
  sendGetRequest,
  sendGetRequestList,
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
      const response = request.get('response');
      responseRender = (
        <div>
          Response Status: {response.get('status_code')},
          size: {prettyByte(response.get('body_len'))},
          duration: {prettyMs(response.get('duration') / 1000000)}
          <ul>
            {request.getIn(['response', 'headers']).map((h, i) =>
              <li key={i}><b>{h.get('name')}</b>: {h.get('value')}</li>,
            )}
          </ul>
          <div>
            Body: {response.get('body')}
          </div>
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
          Headers:
          <ul>
            {data.get('headers').map((h, i) =>
              <div key={i}>
                <TextField
                  hintText="Name"
                  floatingLabelText="Name"
                  value={h.get('name')}
                />
                <TextField
                  hintText="Value"
                  floatingLabelText="Value"
                  value={h.get('value')}
                />
                <IconButton onClick={() => this.props.deleteHeader(i)}><RemoveIcon /></IconButton>
              </div>,
            )}
          </ul>
          <TextField
            hintText="Body"
            floatingLabelText="Body"
            onChange={this.props.onChangeBody}
            multiLine
            rows={2}
            fullWidth
          />

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
  onChangeBody: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  cancelExecRequest: PropTypes.func.isRequired,
  sendRequestList: PropTypes.func.isRequired,
  sendGetRequest: PropTypes.func.isRequired,
  initAuthToken: PropTypes.func.isRequired,
  sendCopyRequest: PropTypes.func.isRequired,
  openNewRequest: PropTypes.func.isRequired,
  addHeader: PropTypes.func.isRequired,
  deleteHeader: PropTypes.func.isRequired,
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
    onChangeBody: (evt) => dispatch(requestBodyChange(evt.target.value)),
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
    addHeader: () => dispatch(addHeader()),
    deleteHeader: (i) => dispatch(deleteHeader(i)),
    openNewRequest: () => {
      dispatch(openNewRequest());
      dispatch(push('/request'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
