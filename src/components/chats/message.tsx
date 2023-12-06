import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckIcon } from "@radix-ui/react-icons";
import Timestamp from "./Timestamp";
import { MessagePopulated } from "../../../../imessage/apollo-server/src/schema/types.utils";

type Props = {
  message: MessagePopulated;
  isUser: boolean;
};

function Message({ message, isUser }: Props) {
  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start "}`}>
      <div className="relative w-fit max-w-[80%] md:max-w-[60%] space-y-1 ">
        <div className="items-center flex space-x-1 md:hidden">
          <Avatar className="w-7 h-7">
            <AvatarImage />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        </div>

        <div className={`flex space-x-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <Avatar
            className={`w-7 h-7 hidden md:block ${isUser ? "ml-1" : "mr-1"}`}
          >
            <AvatarImage />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div
            className={`p-2 select-none border text-sm text-muted-foreground  border-border/10  w-full ${
              isUser
                ? "bg-blue-900 rounded-l-xl rounded-br-xl"
                : "bg-muted/20 rounded-r-xl rounded-bl-xl"
            }`}
          >
            <p>{message.body}</p>
            <div className="flex justify-end mt-2 md:hidden">
              <Timestamp time={message.createdAt} messageSeen={true} />
            </div>
          </div>
        </div>
        <div
          className={`hidden md:block absolute top-1/2 -translate-y-1/2  space-x-1 ${
            isUser ? "-left-20" : "-right-20"
          }`}
        >
          <Timestamp time={message.createdAt} messageSeen={true} />
        </div>
      </div>
    </div>
  );
}

export default Message;
