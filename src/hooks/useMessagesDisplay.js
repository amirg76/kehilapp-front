import { useMemo } from "react";
import { getCategoryImage } from "@utils/categoryImage";
import { normalizeUrgency } from "@utils/urgency";

const useMessagesDisplay = (messages, categories, users) => {
  const displayInfo = useMemo(() => {
    // Messages render even with no user data: sender name is optional enrichment,
    // and the public (logged-out) view never loads the auth-only user directory.
    if (!messages.length || !categories.length) {
      return [];
    }

    return messages.map((message) => {
      const rawCategory = categories.find(
        (category) => category._id === message.categoryId
      );
      // Attach a resolved local cover image so a message with no attachment
      // falls back to its category's picture instead of a broken external URL.
      const category = rawCategory
        ? { ...rawCategory, coverImgUrl: getCategoryImage(rawCategory.title) }
        : rawCategory;
      const user = users.find((user) => user._id === message.senderId);
      return {
        _id: message._id,
        title: message.title,
        text: message.text,
        createdAt: message.createdAt,
        category,
        // Normalize here, once, rather than in every consumer: the card and the
        // list ordering must agree on what a message's urgency is, and messages
        // written before the field existed arrive without it at all.
        urgency: normalizeUrgency(message.urgency),

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
