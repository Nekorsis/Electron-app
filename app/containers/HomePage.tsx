import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as socketIOClient from 'socket.io-client';

interface IProps  {
}

interface IState {
  endpoint: string,
  message: string,
  messagesList: Array<any>,
}

export class HomePage extends React.Component<IProps, IState> {
  constructor() {
    super();
    
    this.state = {
      endpoint: "http://192.168.0.150:4001",
      message: '',
      messagesList: [
        {id: 113, msg: 'test message for copypaste 1', usderId: 2, userName: 'not-me'},
        {id: 114, msg: 'test message for copypaste 2', usderId: 2, userName: 'not-me'},
        {id: 115, msg: 'test message for copypaste 3', usderId: 2, userName: 'not-me'},
        {id: 116, msg: 'test message for copypaste 4', usderId: 2, userName: 'not-me'},
      ],
    }
  }

  componentDidMount() {
    const { endpoint } = this.state;
    // move this somewhere
    const socket = socketIOClient(endpoint);
    socket.on('sendback_msg', (msg: any) => {
      this.setState((prevState) => ({messagesList: [...prevState.messagesList, msg]}))
      console.log('sendback: ', msg);
    });
  }


  sendMsg = () => {
    const { endpoint, message } = this.state;
    if (!message || message.length <= 0) {
      return;
    }

    const socket = socketIOClient(endpoint);
    socket.emit('send_msg', message);
    this.setState({message: ''});
  }

  handleInput = (e: any) => {
    const code = e.keyCode || e.which;
    if(code === 13) {
      this.sendMsg();
      return;
    } 
    this.setState({message: e.target.value});
  }

  onCustomCopyEvent = (e: any, msg: any) => {
    // This is necessary to prevent the current document selection from
    // being written to the clipboard.
    // msg should not be type any
    e.preventDefault();
    e.clipboardData.setData('text/plain', `${msg.msg} i want to die`);
  }

  render() {
    const { message, messagesList } = this.state;
    return (
      <div className="app-container">
        <div className="messages-container">
          {messagesList && messagesList.map(k => (
            <p key={`${k.msg}_${k.id}`} className="chat-msg" onCopy={(e) => { this.onCustomCopyEvent(e, k) }}>{k.msg}</p>
          ))}
        </div>
        <div className="input-container">
          <input type="text" placeholder="message" onChange={this.handleInput} onKeyPress={this.handleInput} value={message} />
          <button onClick={this.sendMsg} type="submit">send that shit</button>
        </div>
      </div>
    );
  }
}

export default (HomePage as any as React.StatelessComponent<RouteComponentProps<any>>);
