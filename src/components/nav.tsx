import { ConversationsData } from "@/lib/typesdefs";
import Modal from "./modal";
import { ConversationPopulated } from "../../../imessage/apollo-server/src/schema/types.utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import HeaderLayout from "./chats/HeaderLayout";
import Timestamp from "./chats/Timestamp";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { ScrollArea } from "./ui/scroll-area";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

interface Props {
  data: ConversationPopulated[];
}
const height = "calc(100vh - 9rem)";

function Nav({ data }: Props) {
  return (
    <>
      <div className="p-4  z-50">
        <Modal />
      </div>
      <ScrollArea style={{ height }} className="w-full relative">
        <div className="h-full flex flex-col">
          <div className=" flex-1 flex flex-col space-y-px h-[75vh] w-80 relative z-0">
            {data.map((conversation) => (
              <User key={conversation.id} conversation={conversation} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button className="w-full" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </>
  );
}

export default Nav;

interface UserProps {
  conversation: ConversationPopulated;
}

function User({ conversation }: UserProps) {
  const pathName = usePathname();
  const url = `/chats/${conversation.id}`;
  const { participants, updatedAt } = conversation;
  const { data: sessionData } = useSession();
  const sessionId = sessionData?.user.id;

  const users = participants
    .map((p) => p.user)
    .filter((user) => user.id !== sessionId);

  return (
    <>
      <Link
        href={url}
        className={`p-4 hover:bg-muted/10 w-full group  relative ${
          pathName === url ? "bg-muted/10" : ""
        }`}
      >
        <div className="w-full flex items-center space-x-4">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-sm capitalize ">
                {users.map((user) => user.username)}
              </h1>
              <div className="group-hover:opacity-0 duration-500 transition-all">
                <Timestamp time={updatedAt} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {conversation.latestMessage?.body}
            </p>
          </div>
        </div>
        <div
          className={`opacity-0 rounded-full  group-hover:opacity-100 duration-500 transition-all absolute right-4 top-1/2 -translate-y-1/2 z-50`}
        >
          <Button size={"sm"} variant={"ghost"} className="hover:bg-muted/10">
            <DotsVerticalIcon />
          </Button>
        </div>
      </Link>
    </>
  );
}
