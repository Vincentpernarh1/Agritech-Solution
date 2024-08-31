import React, { useState } from 'react';
import './Message.css'; // Import the CSS file for styles
import { FaPaperPlane } from 'react-icons/fa'; // Send icon

function Message() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'liu juan',
      company: 'Hebei Zhongbo Ruike Instrument Manufacturing Co., Ltd.',
      messages: [
        { id: 1, text: 'The total price is 397.04, which is the service charge of the Alibaba platform and cannot be modified. I wrote less about the value of FedEx', sender: 'other' },
        { id: 2, text: 'thats not what i ment', sender: 'me' }
      ]
    },
    { id: 2, name: 'Rachel Guo', company: 'Wenzhou Better Import And Export Co.', messages: [] },
    { id: 3, name: 'Van Yang', company: 'SHENZHEN FREE SEA LOGISTICS LTD', messages: [] },
    { id: 4, name: 'Bella Chu', company: 'Jinan Kason Testing Equipment Co.', messages: [] },
    { id: 5, name: 'Angelia Li', company: 'SHIPPING SERVICE INC', messages: [] },
    // Add more contacts here
  ]);
  const [currentContactId, setCurrentContactId] = useState(contacts[0].id);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedContacts = contacts.map(contact => {
        if (contact.id === currentContactId) {
          return {
            ...contact,
            messages: [...contact.messages, { id: Date.now(), text: newMessage, sender: 'me' }]
          };
        }
        return contact;
      });
      setContacts(updatedContacts);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setNewMessage(newMessage + '\n');
    }
  };

  const currentContact = contacts.find(contact => contact.id === currentContactId);

  return (
    <div className="message-container">
      <div className="sidebar">
        <div className="sidebar-item">Home</div>
        <div className="sidebar-item active">Messages</div>
        <div className="sidebar-item">Buying Leads</div>
        <div className="sidebar-item">Orders</div>
        <div className="sidebar-item">Transactions</div>
        <div className="sidebar-item">Contacts</div>
        <div className="sidebar-item">My Lists</div>
        <div className="sidebar-item">Trade Services</div>
      </div>
      <div className="content-area">
        <div className="contact-list">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${contact.id === currentContactId ? 'selected' : ''}`}
              onClick={() => setCurrentContactId(contact.id)}
            >
              <div className="contact-name">{contact.name}</div>
              <div className="contact-company">{contact.company}</div>
            </div>
          ))}
        </div>
        <div className="message-area">
          <div className="message-header">
            <div className="contact-info">
              <span className="contact-name">{currentContact.name}</span>
              <span className="contact-company">{currentContact.company}</span>
            </div>
            <button className="add-contact-button">Add contact</button>
          </div>
          <div className="message-list">
            {currentContact.messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="message-input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type / to bring up AI Summarization"
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-button">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
