import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HeaderLayout from "./HeaderLayout";

type Props = {};

function ChatHeader({}: Props) {
  return (
    <HeaderLayout>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <div className="">
          <h3 className="text-sm">Sam Lambert</h3>
          <p className="text-muted-foreground text-xs">
            last seen <span className="text-foreground">7 min ago</span>
          </p>
        </div>
      </div>
    </HeaderLayout>
  );
}

export default ChatHeader;
