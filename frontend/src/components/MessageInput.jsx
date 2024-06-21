import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/conversationsAtom";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);
      setConversations((prevConvo) => {
        const updatedConversation = prevConvo.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
      setMessageText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input w={"full"} placeholder={"Input Message..."} onChange={(e) => setMessageText(e.target.value)} value={messageText} />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <Icon as={IoSendSharp} color="green.500" /> {/* // import icon so it allow to use chakra ui styling */}
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
