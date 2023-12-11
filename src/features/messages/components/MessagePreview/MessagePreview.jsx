import React from 'react'
import Avatar from '@components/ui/Avatar/Avatar';
import CategoryTag from '../CategoryTag/CategoryTag';

const MessagePreview = ({ message }) => {

    const { title, text } = message
    return (
        <div className='w-[270px] h-[435px] border-solid border border-black border-opacity-[0.1] rounded-[30px] bg-white shadow-0 shadow-md shadow-2 shadow-opacity-10 mx-[20px] my-[35px] p-[15px]'>
            <img className='rounded-[10px] relative bottom-[50px] h-[195px]' src="https://i.ibb.co/0mfdBtk/42243380990100408272no.jpg" alt="demo-img" />
            <div className='h-[250px] relative bottom-[40px] flex flex-col'>
                <h1 className='text-[20px] font-semibold mb-[2px]'>{title}</h1>
                <p className='font-light mb-[20px] flex-1'>{text}</p>
                <section className='flex mb-[20px] items-center'>
                    <Avatar classes='ml-[17px]' />
                    <h6>מאת <span className='font-semibold text-[18px]'>אורן קליין</span></h6>
                </section>
                <section className='flex'>
                    <h6 className='ml-[15px]'>10.12.23</h6>
                    <h6 className='font-light'>10:30</h6>
                </section>
                <CategoryTag category={{ title: "חינוך", color: "#A3CA62" }} />
            </div>
        </div>
    )
}

export default MessagePreview;
