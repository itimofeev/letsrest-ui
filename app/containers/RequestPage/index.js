/*
 *
 * RequestPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectRequestPage from './selectors';
import messages from './messages';

export class RequestPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="RequestPage"
          meta={[
            { name: 'description', content: 'Description of RequestPage' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        Hello, there!
      </div>
    );
  }
}

RequestPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  RequestPage: makeSelectRequestPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPage);
