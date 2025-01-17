import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useAuth } from "../../context/AuthContext";

export const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: string;
}) => {
    const auth = useAuth();
    const nameArray = auth?.user?.name?.split(" ") ?? [];
  const firstName = nameArray.length > 0 ? nameArray[0] : "";
  const lastName = nameArray.length > 1 ? nameArray[1] : "";
  return role === "assistant" ? (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#004d5612", my: 2, gap: 2 }}>
        <Avatar sx={{ ml: "0" }}>
            <img src="openai.png" alt="openai" width={"30px"} />             
        </Avatar>
        <Box>
            <Typography fontSize={"20px"}>
                {content}
            </Typography>
        </Box>
    </Box>
  ): (
    <Box sx={{ display: "flex", p: 2, bgcolor: "#004d56",  gap: 2 }}>
        <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {firstName[0]}
        {lastName[0]}           
        </Avatar>
        <Box>
            <Typography fontSize={"20px"}>
                {content}
            </Typography>
        </Box>
    </Box>
  )
};

export default ChatItem;
