import React from 'react'
import MessagePreview from '../MessagePreview/MessagePreview'
import demoMessages from '../../../../demo-data/demoData.json'

const MessageList = ({ messages }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?
  return (
    <div className='flex flex-wrap justify-center'>
      {/* {JSON.stringify(demoData)} */}
      {demoMessages.map((message, idx) => <MessagePreview key={idx} message={message} />)}
    </div>
  )

}

export default MessageList;