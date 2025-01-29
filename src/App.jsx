import React from "react";
import "react-chatbot-kit/build/main.css";
import Chat from "./components/chat.tsx";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chatbot</h1>
      </header>
      {/* <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      /> */}
      <Chat /> 
    </div>
  );
};

export default App;
