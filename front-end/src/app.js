import React, { Suspense, lazy } from 'react';
import {
  Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Spin } from 'antd';

import history from './utils/history';
import PrivateRoute from './components/privateRoute';
import './public/app.css';
import HomePage from './components/HomePage/Homepage';

const DashboardPage = lazy(() => import('./components/DashboardPage/DashboardPage'));

const App = () => (
  <Suspense fallback={<Spin />}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <PrivateRoute exact path="/dashboard" component={DashboardPage} />
      </Switch>
    </Router>
  </Suspense>
);

export default App;
