import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import { Spin } from 'antd';

// import { getAccessToken } from '../services/TokenServices';
// import { isEmpty } from '../utils/index';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (true ? (
        <Suspense fallback={<Spin />}>
          <Component {...props} />
        </Suspense>
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      ))
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]).isRequired,
  location: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
};

PrivateRoute.defaultProps = {
  location: null,
};

export default PrivateRoute;
