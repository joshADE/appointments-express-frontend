import React, { useEffect } from 'react';
import Home from './components/pages/home/Home';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/pages/auth/Register';
import ProtectedRoute from './components/pages/auth/ProtectedRoute';

import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchAllUser ,loadUser, selectUserState } from './features/user/userSlice'
import Login from './components/pages/auth/Login';

const App: React.FC = () => {
  
  const { isAuthenticated, isLoading } = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      loadUser(() => {
        // only after failure to load the user (authenticate) do we fetch all users which will be used later, when the user decides to register 
        dispatch(fetchAllUser());
      })
    );
  }, [dispatch])

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
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
