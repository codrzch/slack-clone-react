import React, {Component} from 'react';
import SidebarPane from './SidebarPane';
import ChatPane from './ChatPane';
import EmptyChatPane from './EmptyChatPane';
import { channels, people, createFakeActivity } from './static-data';


function nextId(messages) {
  return messages.length ? messages[messages.length - 1].id + 1 : 0
}

function createMessage(text, messageId) {
  return {
    id: messageId,
    userName: 'Myself',
    text: text,
    timestamp: new Date()
  };
}

export default class Root extends Component {
  state = {
    channels,
    people,
    messagesByChannelId: createFakeActivity(channels, 15),
    messagesByPersonId: createFakeActivity(people, 5),
    selectedChannelId: null,
    selectedPersonId: null
  };

  handleChannelSelected = (channelId) => {
    this.setState({
      selectedChannelId: channelId,
      selectedPersonId: null
    });
  }

  handlePersonSelected = (personId) => {
    this.setState({
      selectedPersonId: personId,
      selectedChannelId: null
    });
  }

  handleSentMessage = (text) => {
    const {selectedChannelId, selectedPersonId} = this.state;

    if(selectedChannelId) {
      // SET STATE TO...
      this.setState({
        // EXISTING STATE...
        ...this.state,
        // W/ messagesByChannelId SET TO:
        messagesByChannelId: {
          // ALL THE EXISTING MESSAGES FOR ALL CHANNELS...
          ...this.state.messagesByChannelId,
          // W/ MESSAGES FOR SELECTED CHANNEL REPLACED BY:
          [selectedChannelId]: [
            // ALL THE EXISTING MESSAGES...
            ...this.state.messagesByChannelId[selectedChannelId],
            // PLUS THIS ONE
            createMessage(text, nextId(this.state.messagesByChannelId[selectedChannelId]))
          ]
        }
      });
    }

    if(selectedPersonId) {
      // SAME AS ABOVE
      this.setState({
        ...this.state,
        messagesByPersonId: {
          ...this.state.messagesByPersonId,
          [selectedPersonId]: [
            ...this.state.messagesByPersonId[selectedPersonId],
            createMessage(text, nextId(this.state.messagesByPersonId[selectedPersonId]))
          ]
        }
      });
    }
  }

  render() {
    const {channels, people, selectedChannelId, selectedPersonId} = this.state;

    let messages = [];
    let isSomethingSelected = false;
    if(selectedChannelId) {
      messages = this.state.messagesByChannelId[selectedChannelId];
      isSomethingSelected = true;
    }
    if(selectedPersonId) {
      messages = this.state.messagesByPersonId[selectedPersonId];
      isSomethingSelected = true;
    }

    return (
      <div className='container'>
        <SidebarPane
          channels={channels}
          people={people}
          onChannelSelected={this.handleChannelSelected}
          onPersonSelected={this.handlePersonSelected}
          selectedChannelId={selectedChannelId}
          selectedPersonId={selectedPersonId} />
        {isSomethingSelected ?
          <ChatPane
            messages={messages}
            onSendMessage={this.handleSentMessage} />
          : <EmptyChatPane />
        }
      </div>
    );
  }
}
