
import React from 'react';
import ChatMessage, { Message } from '../ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {messages.map(message => (
        <ChatMessage 
          key={message.id} 
          message={message}
        />
      ))}
    </div>
  );
};

export default ChatMessages;
