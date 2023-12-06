"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import userOperations from "@/graphql/operations/user";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  SearchUserInput,
  SearchedUser,
  SearchsUsersData,
  createConversationData,
  createConversationInput,
} from "@/lib/typesdefs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import conversationOperations from "@/graphql/operations/conversation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Modal() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const [participants, setparticipants] = useState<SearchedUser[]>([]);
  const [open, setOpen] = useState(false);
  const { data: sessionData } = useSession();

  const sessionId = sessionData?.user.id as string;

  const close = () => {
    setOpen(false);
  };

  const [createConversationMutation, { loading: mutating, data: mutateData }] =
    useMutation<createConversationData, createConversationInput>(
      conversationOperations.Mutations.createConversation
    );
  const router = useRouter();

  const handleConversation = async () => {
    const participantIds = [...participants.map(({ id }) => id), sessionId];

    try {
      const { data } = await createConversationMutation({
        variables: { participantIds },
      });

      const conversationId = data?.createConversation.conversationId;
      router.push(`/chats/${conversationId}`);
    } catch (error) {
      console.log(error);
    }

    close();
    setparticipants([]);
  };

  const addParticipants = (user: SearchedUser) => {
    if (participants.includes(user)) {
      return participants;
    }
    setparticipants((prev) => [...prev, user]);
  };

  const removeParticipant = (id: string) => {
    setparticipants((prev) => prev.filter((user) => user.id !== id));
  };

  const [searchUsers, { loading, data }] = useLazyQuery<
    SearchsUsersData,
    SearchUserInput
  >(userOperations.Queries.searchUsers);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { username } = data;
    searchUsers({ variables: { username } });
    form.reset();
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          className="w-full"
        >
          Search or Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search User</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={loading}
                variant={"secondary"}
                className="w-full"
                type="submit"
              >
                {loading === true ? "Searching user..." : "Search"}
              </Button>
            </form>
          </Form>
        </div>
        {data?.searchUsers && (
          <SearchedUser
            users={data?.searchUsers}
            addParticipants={addParticipants}
          />
        )}
        {participants.length !== 0 && (
          <div className="border-border border-t w-full">
            <Selected
              users={participants}
              removeParticipant={removeParticipant}
            />
            <Button onClick={handleConversation} className="w-full">
              Create Conversation
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface UsersProps {
  users: SearchedUser[];
  addParticipants: (user: SearchedUser) => void;
}

function SearchedUser({ users, addParticipants }: UsersProps) {
  return (
    <>
      <div className="">
        {users.map((user) => (
          <div
            key={user.id}
            className="w-full flex justify-between items-center my-2"
          >
            <div className="items-center space-x-2 flex">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <p>{user.username}</p>
            </div>
            <div className="">
              <Button
                onClick={() => addParticipants(user)}
                variant={"outline"}
                size={"sm"}
              >
                Select
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

interface SelectedProp {
  users: SearchedUser[];
  removeParticipant: (id: string) => void;
}

function Selected({ users, removeParticipant }: SelectedProp) {
  return (
    <>
      <div className="">
        {users.map(({ id, username }) => (
          <div
            key={id}
            className="w-full flex justify-between items-center my-2"
          >
            <div className="items-center space-x-2 flex">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <p>{username}</p>
            </div>
            <div className="">
              <Button
                onClick={() => removeParticipant(id)}
                variant={"outline"}
                size={"sm"}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
