import React from "react";

import Sidebar from "@features/sidebar/components/Sidebar";

const Messages = () => {
  return (
    <div>
      {/* sidebar & content split side by side */}
      <div className="flex">
        <Sidebar />
        {/* //TODO: Change to message cards components */}
        <h1 className="uppercase">Message Cards goes here Placeholder</h1>
      </div>
    </div>
  );
};

export default Messages;
