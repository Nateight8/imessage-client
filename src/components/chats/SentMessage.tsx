import { CheckIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Timestamp from "./Timestamp";

interface Props {}

function SentMessage({}: Props) {
  return (
    <div className="flex justify-end">
      <div className="relative w-fit max-w-[80%] md:max-w-[60%]">
        <div className="items-center flex justify-end space-y-1 md:hidden pb-1">
          <Avatar className="w-7 h-7">
            <AvatarImage />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute hidden md:block top-1/2 -translate-y-1/2 -left-20 space-x-1">
          {/* <Timestamp /> */}
        </div>
        <div className="flex space-x-1  ">
          <div className="p-2 select-none border text-sm text-muted-foreground  border-border/10 rounded-l-xl rounded-br-xl w-full  bg-blue-900">
            <p>Hello James,adipisicing elit.</p>
            <div className="flex justify-end mt-2 md:hidden">
              {/* <Timestamp /> */}
            </div>
          </div>

          <Avatar className="w-7 h-7 hidden md:block">
            <AvatarImage />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default SentMessage;
