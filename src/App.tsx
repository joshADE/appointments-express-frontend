import React from 'react';
import Home from './components/pages/home/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/pages/auth/Register';
import ProtectedRoute from './components/pages/auth/ProtectedRoute';

import { useAppSelector } from './app/hooks'
import { selectIsAuthenticated } from './features/auth/authSlice'
import { useLoadUserQuery } from './app/services/appointments';
import Login from './components/pages/auth/Login';

const App: React.FC = () => {
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isFetching: isLoading } = useLoadUserQuery();


  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </Route>
          <Route path="/register">
            <Register isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </Route>
          <Route path="/login">
            <Login isAuthenticated={isAuthenticated} isLoading={isLoading} />
          </Route>
          <ProtectedRoute path="/dashboard" component={Dashboard} authenticationPath='/login' isAuthenticated={isAuthenticated} />
          {/* <Route path="/dashboard" component={Dashboard} /> */}
          <Route path="*" component={() => <>Page Not Found</>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
