/*
 *
 * RequestPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import MenuItem from 'material-ui/MenuItem';
import update from 'react-addons-update';
// import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import makeSelectRequestPage from './selectors';
// import messages from './messages';
import RequestContainer from './RequestContainer';
import Form from './Form';
import MethodField from './MethodField';
import URLField from './URLField';
import SendButton from './SendButton';
import { execRequest } from './actions';


export class RequestPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);

    this.state = {
      data: {
        method: 'GET',
        url: '',
      },
    };
  }

  handleSubmit = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.execRequest(this.state);
  };

  handleMethodChange = (event, index, method) => this.setState((prevState) => update(prevState, { data: { method: { $set: method } } }));
  handleUrlChange = (event) => {
    event.persist();
    this.setState((prevState) => update(prevState, { data: { url: { $set: event.target.value } } }));
  };

  render() {
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
              value={this.state.data.method}
              onChange={this.handleMethodChange}
            >
              <MenuItem value={'GET'} primaryText="GET" />
              <MenuItem value={'POST'} primaryText="POST" />
              <MenuItem value={'PUT'} primaryText="PUT" />
              <MenuItem value={'DELETE'} primaryText="DELETE" />
            </MethodField>

            <URLField
              hintText="URL"
              floatingLabelText="URL"
              onChange={this.handleUrlChange}
              value={this.state.data.url}
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
  execRequest: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  RequestPage: makeSelectRequestPage(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    execRequest,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
