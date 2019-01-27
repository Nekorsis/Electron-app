import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as socketIOClient from 'socket.io-client';
import * as uuidv1 from 'uuid/v1';
import * as moment from 'moment';

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
        {id: 113, msg: 'test message for copypaste 1', usderId: 2, userName: 'not-me', timeSend: 1},
        {id: 114, msg: 'test message for copypaste 2', usderId: 2, userName: 'not-me', timeSend: 1},
        {id: 115, msg: 'test message for copypaste 3', usderId: 2, userName: 'not-me', timeSend: 1},
        {id: 116, msg: 'test message for copypaste 4', usderId: 2, userName: 'not-me', timeSend: 1},
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
    const messageToSend = { id: uuidv1(), msg: message, userName: 'user1', userId: 1, timeSend: new Date().getTime() };
    const socket = socketIOClient(endpoint);
    socket.emit('send_msg', messageToSend);
    this.setState({message: ''});
  }

  handleInput = (e: any) => {
    const code = e.keyCode || e.which;
    if(code === 13) {
      this.sendMsg();
      return;
    } 
    if (e.target.value.includes('\u200B')) {
      console.log('show selected msg');
      return;
    }
    this.setState({message: e.target.value});
  }

  onCustomCopyEvent = (e: any, msg: any) => {
    // This is necessary to prevent the current document selection from
    // being written to the clipboard.
    // msg should not be type any
    e.preventDefault();
    const selection = window.getSelection().toString();
    // \u200B is a zero-width space needed to see if clipboard text is a chat message
    // need to come up with a better way to do this, or more complicated
    e.clipboardData.setData('text/plain', `\u200B ${moment(msg.timeSend).format('HH : mm')}: ${msg.userName}: ${selection}`);
  }


  render() {
    const { message, messagesList } = this.state;
    return (
      <div className="app-container">
        <div className="messages-container">
          {messagesList && messagesList.map(k => (
            <div key={`${k.msg}_${k.id}`} style={{marginTop: '10px'}}>
              <span className="chat-msg" onCopy={(e) => { this.onCustomCopyEvent(e, k) }}>{k.msg}</span>
              <span className="chat-msg-date">{`${moment(k.timeSend).format('HH : mm')}`}</span>
            </div>
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
