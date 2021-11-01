import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';
import $ from 'jquery';



//TODO: ADD AUDIO for end control touch
//constants and variables
const SOUND = [{src:'https://res.cloudinary.com/dzr5gin3o/video/upload/v1635294894/FCC_Asset/bell-ringing-05_kgskmb.mp3',alt:'bell ringing'},{src:'https://res.cloudinary.com/dzr5gin3o/video/upload/v1635294894/FCC_Asset/small-bell-ring-01a_iwwqmc.mp3',alt:'small bell'}];
const CLOCKSTATE = {
  inputbreak: 5,
  inputsession: 25,
  inputplay: false,
  inputseconds: '00',
  inputminutes: '25',
  inputcaption: 'Session',
}

const BREAK = 'BREAK';
const SESSION = 'SESSION';
const PLAY = 'PLAY';
const MINUTES = 'MINUTE';
const SECONDS = 'SECONDS';
const CAPTION = 'CAPTION';

const BRKINCREMENT = 'break-increment';
const BRKDECREMENT = 'break-decrement';
const SSNINCREMENT = 'session-increment';
const SSNDECREMENT = 'session-decrement';
const PLAYSTOP = 'start_stop';
const RESET = 'reset';

const LIMIT = 60;

//Redux
//Action
const actionBreak = (inputBreak) => {
  return {
    type: BREAK,
    inputbreak: inputBreak,
  }
}
const actionSession = (inputSession) => {
  return {
    type: SESSION,
    inputsession: inputSession,
  }
}
const actionPlay = (inputPlay) => {
  return {
    type: PLAY,
    inputplay: inputPlay,
  }
}
const actionMinutes = (inputMinutes) => {
  return {
    type: MINUTES,
    inputminutes: inputMinutes,
  }
}
const actionSeconds = (inputSeconds) => {
  return {
    type: SECONDS,
    inputseconds: inputSeconds,
  }
}
const actionCaption = (inputCaption) => {
  return {
    type: CAPTION,
    inputcaption: inputCaption,
  }
}

//Reducer
const clockReducer = (state = CLOCKSTATE,action) => {
  const newState = Object.assign({},state);
  switch (action.type) {
    case BREAK :
      newState.inputbreak = action.inputbreak;
      return newState;
    case SESSION :
      newState.inputsession = action.inputsession;
      return newState;
    case PLAY :
      newState.inputplay = action.inputplay;
      return newState;
    case MINUTES :
      newState.inputminutes = action.inputminutes;
      return newState;
    case SECONDS :
      newState.inputseconds = action.inputseconds;
      return newState;
    case CAPTION :
      newState.inputcaption = action.inputcaption;
      return newState;
    default :
      return state;
  }

}

//React Redux

const rootReducer = combineReducers({
  system: clockReducer,
});

//Store
const store = createStore(rootReducer,applyMiddleware(thunk));


//React
class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mute: false,
      beep: SOUND[0],
    }
  }
  mutesound = (event) => {
    this.setState({mute:!this.state.mute});
    $('#beep')[0].volume = this.state.mute?0:1;
  }
  componentDidMount() {
    $('#display_sound').click(this.mutesound);
  }
  render() {
    return (
      <div id="display">
        <div id="display_header">
          <div id='display_sound'>{this.state.mute?<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-volume-mute-fill" viewBox="0 0 16 16">
  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
</svg>:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-volume-down-fill" viewBox="0 0 16 16">
  <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zm3.025 4a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z"/>
</svg>}</div>
          <div id="timer-label" className="text-center">{this.props.state.system.inputcaption}</div>
        </div>
        <div className="display_caption"><h1 id="time-left">{`${this.props.state.system.inputminutes}:${this.props.state.system.inputseconds}`}</h1>
          <audio id="beep" crossOrigin="anonymous" className="clip" src={this.state.beep.src}/>
        </div>

        <div className="display_bs">
          <div className="display_break"><div id="break-label" className="text-center">Break Length</div><div id="break-length" className="display_bs_input">{this.props.state.system.inputbreak}</div></div>
          <div className="display_session"><div id="session-label" className="text-center">Session Length</div><div id="session-length" className="display_bs_input">{this.props.state.system.inputsession}</div></div>
        </div>
      </div>
    )
  }
}
class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeoutx : null,
      timeinterval : null,
      event : null,
      timer : null,
    }
  }
  //timer part 2
  startTimer = (running = false) => {
    running = this.props.state.system.inputplay;
    if (!running)return;
    //subtract 1 from input minutes
    let inputseconds = this.props.state.system.inputseconds -1;
    let inputminutes = this.props.state.system.inputminutes - 1;
    //seconds is less than 0 and minutes is still deducted
    //update props minutes and set seconds to 60
    if(inputseconds === 0 & inputminutes < 0)$('#beep')[0].play();
    if (inputseconds < 0 ) {
      if (inputminutes < 0) {
        //play beep
        //00 seconds and 00 minutes
        const caption = this.props.state.system.inputcaption;
        const timelength = caption==='Session'?this.props.state.system.inputbreak:this.props.state.system.inputsession;
        this.props.dispatchMinutes('0'.repeat(2-`${timelength}`.length) + `${timelength}`);
        this.props.dispatchSeconds('00');
        this.props.dispatchCaption(caption==='Session'?'Break':'Session');
        return;
      }
      else {
        inputminutes = '0'.repeat(2-`${inputminutes}`.length)+`${inputminutes}`;
        this.props.dispatchMinutes(inputminutes);
        this.props.dispatchSeconds('59');
        return;
      }
    }
    //normal flow
    inputseconds = '0'.repeat(2-`${inputseconds}`.length)+`${inputseconds}`;
    this.props.dispatchSeconds(inputseconds);
  }
  //timer part 1
  setTimeInterval = () => {
    //if (this.props.state.system.play)return;
    if (this.state.timer==null) this.setState({timer:setInterval(this.startTimer,1000),})
    else {
      clearInterval(this.state.timer);
      this.setState({timer:null,})
    }
  }
  destroyTimeInterval = () => {
    if (this.state.timer==null)return;
    clearInterval(this.state.timer);
    this.setState({timer:null,});
  }
  //click hold TimeInterval
  stateInterval = () => {
    this.setState({
      timeinterval: setInterval(this.clickEvent,350),
    });
  }
  //click hold Timeout
  mousedown = (event) => {
    this.setState({event:event});
    this.setState({
      timeoutx: setTimeout(this.stateInterval,1300),
    })
  }

  mouseup = () => {
    clearTimeout(this.state.timeoutx);
    clearInterval(this.state.timeinterval);
    this.setState({
      timeoutx: null,
      timeinterval: null,
    })
  }
  reset = () => {
    this.mouseup();
    this.setState({
      event : null,
    });
    this.props.dispatchPlay(false);
    this.props.dispatchSession(25);
    this.props.dispatchBreak(5);
    this.props.dispatchMinutes('25');
    this.props.dispatchSeconds(`00`);
    this.props.dispatchCaption('Session');
    $('#beep')[0].pause();
    $('#beep')[0].currentTime=0;
  }
  clickEvent = (event) => {
    if (event==null & this.state.timeinterval!=null) event = this.state.event;

    const play = this.props.state.system.inputplay;
    let temp = null;
    switch (event.target.id) {
      case BRKINCREMENT:
       temp = (this.props.state.system.inputbreak + 1 );
       if (temp > 60) temp = 60;
       if (temp > 0 && temp <= LIMIT && !play && this.state.timer==null)  this.props.dispatchBreak(temp);
        break;
      case BRKDECREMENT:
        temp = (this.props.state.system.inputbreak - 1 );
        if (temp < 0) temp = 0;
        if (temp > 0 && temp <= LIMIT && !play && this.state.timer==null) this.props.dispatchBreak(temp);
        break;
      case SSNINCREMENT:
        temp = (this.props.state.system.inputsession + 1 );
        if (temp > 60) temp = 60;
        if (temp > 0 && temp <= LIMIT && !play && this.state.timer==null) {
          this.props.dispatchSession(temp);
          temp='0'.repeat(2-`${temp}`.length)+temp;
          this.props.dispatchMinutes(temp);
        }
        break;
      case SSNDECREMENT:
        temp = (this.props.state.system.inputsession - 1 );
        if (temp < 0) temp = 0;
        if (temp > 0 && temp <= LIMIT && !play && this.state.timer==null)  {
          this.props.dispatchSession(temp);
          temp='0'.repeat(2-`${temp}`.length)+temp;
          this.props.dispatchMinutes(temp);
        }
        break;
      case PLAYSTOP:
        this.props.dispatchPlay(!play);
        this.setTimeInterval();
        break;
      case RESET:
        this.reset();
        this.destroyTimeInterval();
        break;
      default:
        break;
    }
  }

  componentDidMount() {

    //mousedown & mouseup
    $('#break-increment').mousedown(this.mousedown);
    $('#break-increment').mouseup(this.mouseup);
    $('#break-decrement').mousedown(this.mousedown);
    $('#break-decrement').mouseup(this.mouseup);
    $('#session-increment').mousedown(this.mousedown);
    $('#session-increment').mouseup(this.mouseup);
    $('#session-decrement').mousedown(this.mousedown);
    $('#session-decrement').mouseup(this.mouseup);


    $('#break-increment').click(this.clickEvent);
    $('#break-decrement').click(this.clickEvent);
    $('#session-increment').click(this.clickEvent);
    $('#session-decrement').click(this.clickEvent);

    $('#start_stop').click(this.clickEvent);
    $('#reset').click(this.clickEvent);

  }


  // const index = Math.floor((performance.now() - timestarted) / interval % customers.length);
  //svg from bootstrap icon

  render() {
    return (
      <div id="controls">
        <div id="breakcontainer" className="controlsdiv">
          <div className="control_caption"><p>Break</p></div>
          <div id="break-increment" className="button_text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
            </svg></div>
          <div id="break-decrement" className="button_text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
            </svg></div>
        </div>
        <div id="sessioncontainer" className="controlsdiv">
          <div className="control_caption"><p>Session</p></div>
          <div  id="session-increment" className="button_text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
            </svg></div>
          <div id="session-decrement" className="button_text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
            </svg></div>
        </div>
        <div id="playcontainer" className="controlsdiv">
          <div className="control_caption"><p>PlayStop</p></div>
          <div id="start_stop" className="button_text">{!this.props.state.system.inputplay?<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg>:<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
</svg>}</div>
          <div id="reset" className="button_text"><svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="36px" viewBox="0 0 24 24" width="36px" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z M20,13c0-4.42-3.58-8-8-8c-0.06,0-0.12,0.01-0.18,0.01l1.09-1.09L11.5,2.5L8,6l3.5,3.5l1.41-1.41 l-1.08-1.08C11.89,7.01,11.95,7,12,7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02C16.95,20.44,20,17.08,20,13z"/></g></g></svg></div>

        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {state:state}
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchBreak: (inputBreak)=>{dispatch(actionBreak(inputBreak))},
    dispatchSession: (inputSession)=>{dispatch(actionSession(inputSession))},
    dispatchPlay: (inputPlay)=>{dispatch(actionPlay(inputPlay))},
    dispatchMinutes: (inputMinutes)=>{dispatch(actionMinutes(inputMinutes))},
    dispatchSeconds: (inputSeconds)=>{dispatch(actionSeconds(inputSeconds))},
    dispatchCaption: (inputCaption)=>{dispatch(actionCaption(inputCaption))},
  }
}

const ConnControls = connect(mapStateToProps, mapDispatchToProps)(Controls);
const ConnDisplay = connect(mapStateToProps, mapDispatchToProps)(Display);
class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div id="container">
          <div id="timer" className="">
            <ConnDisplay/>
            <ConnControls/>
          </div>
          <div id="developedby">25 + 5 Clock by Brill Jasper Amisola Rayel</div>
        </div>
      </Provider>
    );
  }
};


ReactDOM.render(<AppWrapper/>,document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
