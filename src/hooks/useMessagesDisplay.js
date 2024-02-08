import { useMemo } from "react";

const useMessagesDisplay = (messages, categories, users) => {
  const displayInfo = useMemo(() => {
    if (!messages.length || !categories.length || !users.length) {
      return [];
    }

    return messages.map((message) => {
      const category = categories.find(
        (category) => category._id === message.categoryId
      );
      const user = users.find((user) => user._id === message.senderId);
      return {
        _id: message._id,
        title: message.title,
        text: message.text,
        createdAt: message.createdAt,
        category,

        attachmentName: message.attachmentName,
        attachmentType: message.attachmentType,
        attachmentUrl: message.attachmentUrl,
        sender: {
          _id: user?._id,
          firstName: user?.firstName,
          lastName: user?.lastName,
        },
      };
    });
  }, [messages, categories, users]);

  return displayInfo;
};

export default useMessagesDisplay;
