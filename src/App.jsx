import React, { useEffect, useState } from "react";
import { getBaseUrl } from "./utils/envUtils";

const App = () => {
  // aws check
  const [messages, setMessages] = useState("");
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch(`${getBaseUrl()}api/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }, []);
  return (
    <>
      {/* aws check */}
      {messages.data && <h1>{messages.data[0].title}</h1>}
      <h1 className="text-4xl font-bold">React Boilerplate</h1>
    </>
  );
};

export default App;
