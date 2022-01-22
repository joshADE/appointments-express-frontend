import React from 'react';
import Home from './components/pages/home/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/pages/auth/Register';
import ProtectedRoute from './components/pages/auth/ProtectedRoute';
import './App.css';
import { useAppSelector } from './app/hooks'
import { selectIsAuthenticated } from './features/auth/authSlice'
import { useLoadUserQuery } from './app/services/appointments';
import Login from './components/pages/auth/Login';
import UnprotectedRoute from './components/pages/auth/UnprotectedRoute';
import CreateAppointment from './components/pages/createappointment/CreateAppointment';
import CustomerDashboard from './components/CustomerDashboard';
import AuthLoadingScreen from './components/pages/auth/AuthLoadingScreen';

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
          {isLoading && <Route path="/" component={AuthLoadingScreen} />}
          <UnprotectedRoute path="/register" isAuthenticated={isAuthenticated} redirectPath="/dashboard">
            <Register isLoading={isLoading} />
          </UnprotectedRoute>
          <UnprotectedRoute path="/login" isAuthenticated={isAuthenticated} redirectPath="/dashboard">
            <Login isLoading={isLoading} />
          </UnprotectedRoute>
          <ProtectedRoute path="/dashboard" component={Dashboard} authenticationPath='/login' isAuthenticated={isAuthenticated} />
          <Route path="/store/:id/createappointment" component={CreateAppointment} />
          <Route path="/customer/:customerId/appointments" component={CustomerDashboard} />
          <Route path="*" component={() => <>Page Not Found</>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
