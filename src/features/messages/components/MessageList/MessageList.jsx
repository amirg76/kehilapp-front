import React from 'react'
import MessagePreview from '../MessagePreview/MessagePreview'
import demoMessages from '../../../../demo-data/demoData.json'

const MessageList = ({ messages }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?
  return (
    <div className='mx-5'>
      <h1 className='text-3xl mb-5 font-semibold opacity-75'>הודעות הקיבוץ</h1>
      <div className='flex flex-wrap justify-center'>
        {demoMessages.map((message, idx) => <MessagePreview key={idx} message={message} />)}
      </div>
    </div>
  )

}

export default MessageList;