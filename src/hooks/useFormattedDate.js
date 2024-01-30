import { useState, useEffect } from 'react';

const useFormattedDate = (originalDate) => {

    if(!originalDate) return

    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const formatDateTime = () => {
            const dateObject = new Date(originalDate);
            const options = { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            const dateString = dateObject.toLocaleString('en-IL', options);
            const dateArray = dateString.split(', ')
            const formattedDate = { date: dateArray[0], time: dateArray[1] }
            setFormattedDate(formattedDate);
        };

        formatDateTime();

    }, [originalDate]);

    return formattedDate;
};

export default useFormattedDate;