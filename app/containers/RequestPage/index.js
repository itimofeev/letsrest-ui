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
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import prettyByte from 'pretty-byte';
import prettyMs from 'pretty-ms';
import { push } from 'react-router-redux';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionAutorenew from 'material-ui/svg-icons/action/autorenew';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectRequestPage, {
  makeSelectRequest,
  selectErrorExecRequest,
  selectErrorSend,
  selectLoadingExecRequest,
  selectNewRequestDialogName,
  selectNewRequestDialogOpen,
  selectRequestList,
  selectUser,
} from './selectors';
import messages from './messages';
import RequestContainer from './RequestContainer';
import PaddedContainer from './PaddedContainer';
import MethodField from './MethodField';
import URLField from './URLField';
import SendButton from './SendButton';
import {
  addHeader,
  cancelExecRequest,
  closeNewRequestDialog,
  deleteHeader,
  headerNameChange,
  headerValueChange,
  loadAuthToken,
  openNewRequestDialog,
  requestBodyChange,
  requestMethodChange,
  requestUrlChange,
  sendCopyRequest,
  sendCreateRequest,
  sendDeleteRequest,
  sendEditRequest,
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

    const renderRequestForm = request.get('id') !== '';

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

    let formRender = null;
    if (renderRequestForm) {
      formRender = (
        <form onSubmit={this.props.onSubmitForm}>
          <SendButton
            label="DELETE"
            onTouchTap={() => this.props.sendDeleteRequest(request.get('id'))}
            disabled={editDisabled || !request.get('id')}
          />
          <SendButton
            label="EDIT"
            onTouchTap={() => this.props.openNewRequestDialog(request.get('name'))}
            disabled={editDisabled || !request.get('id')}
          />

          <RequestContainer>
            <MethodField
              floatingLabelText="Method"
              value={data.get('method')}
              disabled={editDisabled}
              onChange={(event, index, method) => this.props.onChangeMethod(method)}
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
              onChange={(evt) => this.props.onChangeUrl(evt.target.value)}
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
                  onChange={(evt) => this.props.onHeaderNameChange(i, evt.target.value)}
                />
                <TextField
                  hintText="Value"
                  floatingLabelText="Value"
                  value={h.get('value')}
                  onChange={(evt) => this.props.onHeaderValueChange(i, evt.target.value)}
                />
                <IconButton onClick={() => this.props.deleteHeader(i)}><RemoveIcon /></IconButton>
              </div>,
            )}
          </ul>
          <IconButton onClick={this.props.addHeader}><AddIcon /></IconButton>
          <TextField
            hintText="Body"
            floatingLabelText="Body"
            onChange={(evt) => this.props.onChangeBody(evt.target.value)} d
            multiLine
            rows={2}
            fullWidth
          />

          {responseRender}
        </form>
      );
    }

    const newRequestDialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.props.closeNewRequestDialog}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={() => this.props.onSubmitDialog(this.newRequestName.getValue(), this.props.newRequestDialogName === '')}
      />,
    ];

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

        <PaddedContainer>
          <SendButton
            label={<FormattedMessage {...messages.newRequest} />}
            onTouchTap={() => this.props.openNewRequestDialog()}
          />

          {formRender}

        </PaddedContainer>

        <Dialog
          title="Create new request"
          modal
          actions={newRequestDialogActions}
          open={this.props.newRequestDialogOpen}
        >
          Set name for new request:
          <TextField
            hintText="Name"
            floatingLabelText="Name"
            defaultValue={this.props.newRequestDialogName}
            // eslint-disable-next-line no-return-assign
            ref={(input) => this.newRequestName = input}
          />
        </Dialog>

        <Snackbar
          open={this.props.errorSend !== false}
          message={this.props.errorSend}
        />
      </div>
    );
  }
}

RequestPage.propTypes = {
  onChangeMethod: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onChangeBody: PropTypes.func.isRequired,
  onHeaderNameChange: PropTypes.func.isRequired,
  onHeaderValueChange: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  cancelExecRequest: PropTypes.func.isRequired,
  sendRequestList: PropTypes.func.isRequired,
  sendDeleteRequest: PropTypes.func.isRequired,
  sendGetRequest: PropTypes.func.isRequired,
  initAuthToken: PropTypes.func.isRequired,
  sendCopyRequest: PropTypes.func.isRequired,
  openNewRequestDialog: PropTypes.func.isRequired,
  closeNewRequestDialog: PropTypes.func.isRequired,
  newRequestDialogOpen: PropTypes.bool.isRequired,
  addHeader: PropTypes.func.isRequired,
  deleteHeader: PropTypes.func.isRequired,
  onSubmitDialog: PropTypes.func.isRequired,
  newRequestDialogName: PropTypes.string.isRequired,
  sendExecRequestSuccess: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
  requestList: PropTypes.object.isRequired,
  errorSend: React.PropTypes.oneOfType([
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
  loadingExecRequest: selectLoadingExecRequest(),
  requestList: selectRequestList(),
  user: selectUser(),
  errorSend: selectErrorSend(),
  newRequestDialogOpen: selectNewRequestDialogOpen(),
  newRequestDialogName: selectNewRequestDialogName(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeMethod: (value) => dispatch(requestMethodChange(value)),
    onChangeUrl: (value) => dispatch(requestUrlChange(value)),
    onChangeBody: (value) => dispatch(requestBodyChange(value)),
    onHeaderNameChange: (i, value) => dispatch(headerNameChange(i, value)),
    onHeaderValueChange: (i, value) => dispatch(headerValueChange(i, value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(sendExecRequest());
    },
    sendRequestList: (requestId) => dispatch(sendGetRequestList(requestId)),
    sendDeleteRequest: (requestId) => dispatch(sendDeleteRequest(requestId)),
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
    openNewRequestDialog: (name) => dispatch(openNewRequestDialog(name)),
    closeNewRequestDialog: () => dispatch(closeNewRequestDialog()),
    onSubmitDialog: (name, create) => {
      if (create) {
        dispatch(sendCreateRequest(name));
      } else {
        dispatch(sendEditRequest(name));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
