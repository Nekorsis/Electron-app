import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps {
}

interface IState {
}

export class LoginPage extends React.Component<IProps, IState> {
  render() {
    return (
      <div>Login page</div>
    )
  }
};

export default (LoginPage as any as React.StatelessComponent<RouteComponentProps<any>>);