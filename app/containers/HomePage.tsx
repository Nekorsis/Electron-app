import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as socketIOClient from 'socket.io-client';

interface IProps extends RouteComponentProps<any> {
}

interface IState {
  endpoint: string
}

export class HomePage extends React.Component<IProps, IState> {
  constructor() {
    super();
    
    this.state = {
      endpoint: "http://192.168.0.150:4001",
    }
  }

  send = () => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit('change color', 'red');
  }

  render() {
    const socket = socketIOClient(this.state.endpoint);
    console.log(socket)
    return (
      <div className="app-container">
        <div className="messages-container">messages</div>
        <div className="input-container">
          <input type="text" placeholder="message"/>
          <button onClick={this.send}>send that shit</button>
        </div>
      </div>
    );
  }
}

export default (HomePage as any as React.StatelessComponent<RouteComponentProps<any>>);
