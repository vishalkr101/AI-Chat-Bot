import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { sendChatRequest } from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant",
  content : string
}

const Chat = () => {
  const auth = useAuth();
  const nameArray = auth?.user?.name?.split(" ") ?? [];
  const firstName = nameArray.length > 0 ? nameArray[0] : "";
  const lastName = nameArray.length > 1 ? nameArray[1] : "";

  // const chatItems = [
  //   {
  //     role: "user",
  //     content: "Hello, who are you?",
  //   },
  //   {
  //     role: "assistant",
  //     content:
  //       "Hi! I'm ChatGPT, a large language model trained by OpenAI. How can I assist you today?",
  //   },
  //   {
  //     role: "user",
  //     content: "What can you do?",
  //   },
  //   {
  //     role: "assistant",
  //     content:
  //       "I can help with a variety of tasks such as answering questions, providing explanations, generating text, offering recommendations, and more. Just let me know what you need!",
  //   },
  //   {
  //     role: "user",
  //     content: "Can you write a short story?",
  //   },
  //   {
  //     role: "assistant",
  //     content:
  //       "Of course! Here's a short story:\n\nOnce upon a time, in a small village nestled in the mountains, there lived a young girl named Lily. Lily loved to explore the forest near her home, always on the lookout for hidden treasures. One day, she discovered a mysterious old map tucked inside a hollow tree. The map led to a hidden cave filled with sparkling gems and ancient artifacts. Lily decided to follow the map, embarking on an adventure that would change her life forever. Along the way, she faced many challenges but made new friends who helped her overcome them. In the end, Lily found the hidden cave and shared the treasure with her village, bringing prosperity and joy to everyone. And so, Lily's bravery and kindness became legendary, inspiring generations to come.",
  //   },
  //   {
  //     role: "user",
  //     content: "That was a lovely story! Can you help me with a math problem?",
  //   },
  //   {
  //     role: "assistant",
  //     content: "Of course! What math problem do you need help with?",
  //   },
  //   {
  //     role: "user",
  //     content: "What is the value of 7 multiplied by 8?",
  //   },
  //   {
  //     role: "assistant",
  //     content: "The value of 7 multiplied by 8 is 56.",
  //   },
  // ];

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([])

  const handleSubmit = async () => {
    console.log(inputRef.current?.value);
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    console.log(newMessage)
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    console.log(chatData)
    setChatMessages([...chatData.chats])
    //
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", sm: "none", xs: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {firstName[0]}
            {lastName[0]}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a chat bot
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask questions regarding anything. Please avoid sharing
            personal information.
          </Typography>

          <Button
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: 600,
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chatMessage, index) => (
            <ChatItem content={chatMessage.content} role={chatMessage.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            marginBottom: "20px",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              height: "auto",
              backgroundColor: "transparent",
              padding: "20px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: "white" }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
