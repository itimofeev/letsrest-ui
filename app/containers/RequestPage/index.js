/*
 *
 * RequestPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import MenuItem from 'material-ui/MenuItem';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectRequestPage, { makeSelectRequest } from './selectors';
// import messages from './messages';
import RequestContainer from './RequestContainer';
import Form from './Form';
import MethodField from './MethodField';
import URLField from './URLField';
import SendButton from './SendButton';
import { sendExecRequest, requestMethodChange, requestUrlChange } from './actions';


export class RequestPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        method: 'GET',
        url: '',
      },
    };
  }

  handleSubmit = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.sendExecRequest(this.state);
  };

  render() {
    const request = this.props.request;
    const data = request.get('data');
    return (
      <div>
        <Helmet
          title="RequestPage"
          meta={[
            { name: 'description', content: 'Description of RequestPage' },
          ]}
        />

        <Form onSubmit={this.handleSubmit}>
          <RequestContainer>
            <MethodField
              floatingLabelText="Method"
              value={data.get('method')}
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
              onChange={this.props.onChangeUrl}
              value={data.get('url')}
            />

            <SendButton
              label="Send"
              primary
              onClick={this.handleSubmit}
            />
          </RequestContainer>
        </Form>
      </div>
    );
  }
}

RequestPage.propTypes = {
  sendExecRequest: PropTypes.func.isRequired,
  onChangeMethod: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  RequestPage: makeSelectRequestPage(),
  request: makeSelectRequest(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeMethod: (event, index, method) => dispatch(requestMethodChange(method)),
    onChangeUrl: (evt) => dispatch(requestUrlChange(evt.target.value)),
    sendExecRequest,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
