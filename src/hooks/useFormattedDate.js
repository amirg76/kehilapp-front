import { useState, useEffect } from 'react';

export const useFormattedDate = (originalDate) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const dateObject = new Date(originalDate);

        const day = dateObject.getUTCDate();
        const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed, so add 1
        const year = dateObject.getUTCFullYear();
        const hours = dateObject.getUTCHours();
        const minutes = dateObject.getUTCMinutes();

        const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        setFormattedDate({ date: formattedDate, time: formattedTime });
    }, [originalDate]);

    return formattedDate;
};
