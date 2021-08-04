import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import './Message.css'

let socket;

export default function Chatbox() {

  const [name, setName] = useState('');
  const [url, setURL] = useState('');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'ws://localhost:3002';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const url = urlParams.get('url');

    // using dedicated chat socket temporarily - need to replace with room socket
    socket = io(ENDPOINT);

    setName(name);
    setURL(url);

    socket.emit("createRoom", { name, url }, ({ error }) => {

    })

    return() => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [ENDPOINT, window.location.search])

  useEffect(() => {
    console.log(`client side: ${socket.id}`)
    socket.on('message', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  } 

  console.log(message, messages)

  return (
  <div className="outerContainer">
    <div className="insideContainer">
      <MessageList 
        messages={messages}
        name={name}
      />
      <MessageInput 
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}/>
    </div>
  </div>
  )
}
