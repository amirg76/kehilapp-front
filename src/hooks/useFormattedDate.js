import { useState, useEffect } from 'react';

// Formats an ISO date into { date, time } in Israel time.
//
// Bug fixed: this used to early-return `if (!originalDate) return` BEFORE calling
// useState/useEffect. That breaks the Rules of Hooks — when originalDate flips
// between falsy and truthy across renders, the number of hooks changes and React
// crashes ("rendered fewer hooks than expected"). The hooks now always run; the
// falsy guard moved inside the effect. When there is no date the hook returns the
// empty initial value instead of undefined — safer for callers either way.
const useFormattedDate = (originalDate) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (!originalDate) return;

    const dateObject = new Date(originalDate);
    const options = {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    const dateString = dateObject.toLocaleString('en-IL', options);
    const [date, time] = dateString.split(', ');
    setFormattedDate({ date, time });
  }, [originalDate]);

  return formattedDate;
};

export default useFormattedDate;
