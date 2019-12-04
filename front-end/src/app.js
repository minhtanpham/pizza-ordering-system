import React, { Suspense, lazy } from 'react';
import './i18n';
import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';
import history from './utils/history';

// Page Wrapper
import PrivateRoute from './components/privateRoute';
import './public/app.css';

const App = () => (
  <Suspense fallback={<LoadingSpinner type="center" />}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={LoginPage} />
      </Switch>
    </Router>
  </Suspense>
);

export default App;
