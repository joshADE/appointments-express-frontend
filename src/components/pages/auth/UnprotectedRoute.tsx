import { Redirect, Route, RouteProps } from 'react-router-dom';

export type UnprotectedRouteProps = {
  isAuthenticated: boolean;
  redirectPath: string;
} & RouteProps;

export default function UnprotectedRoute({isAuthenticated, redirectPath, ...routeProps}: UnprotectedRouteProps) {
  if(!isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: redirectPath }} />;
  }
};