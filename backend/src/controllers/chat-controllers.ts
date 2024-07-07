import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    console.log(message,"backend")
    const user = await User.findById(res.locals.jwtData.id);
    console.log(user,"user")
    if (!user) {
      res
        .status(401)
        .json({ message: "User not registered or token malfunctioned" });
    }

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    console.log("mapping done")
    chats.push({ content: message, role: "user" });
    console.log(chats,"chats")

    user.chats.push({ content: message, role: "user" });
    console.log(user,"user");

    //sending chats to openAI API
    const config = configureOpenAI();
    const openai = new OpenAIApi(config);
    
    let chatResponse;
    try {
      chatResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chats,
      });
      console.log(chatResponse.data.choices[0].message, "openAIResponse");
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError.response?.data || apiError.message);
      return res.status(500).json({ message: "OpenAI API Error", error: apiError.response?.data || apiError.message });
    }

    user.chats.push(chatResponse.data.choices[0].message);

    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};
