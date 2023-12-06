"use client";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import userOperations from "@/graphql/operations/user";
import {
  MessageData,
  MessageInput,
  UsernameData,
  UsernameVariables,
} from "@/lib/typesdefs";
import { redirect } from "next/navigation";
import messageOperations from "@/graphql/operations/message";
import { useSession } from "next-auth/react";
import getId from "@/lib/cuid";

const FormSchema = z.object({
  message: z.string().min(1, {
    message: "Message cant be empty field.",
  }),
});

interface Props {
  conversationId: string;
}

export function TextField({ conversationId }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: sessionData } = useSession();

  // sessionData?.user.id

  const [sendMessage, { loading, data, error }] = useMutation<
    { sendMessage: boolean },
    MessageInput
  >(messageOperations.Mutations.sendMessage);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    const { message } = formData;

    try {
      const session = sessionData?.user!;
      //cuid
      const id = getId();

      const newMsg: MessageInput = {
        body: message,
        id,
        conversationId,
        senderId: session.id,
      };

      const { data } = await sendMessage({
        variables: { ...newMsg },
        // optimisticResponse: { sendMessage: true },
        // update: (cache) => {
        //   const snapshot = cache.readQuery<MessageData>({
        //     query: messageOperations.Queries.messages,
        //     variables: { conversationId },
        //   }) as MessageData;

        //   cache.writeQuery<MessageData, { conversationId: string }>({
        //     query: messageOperations.Queries.messages,
        //     variables: { conversationId },
        //     data: {
        //       ...snapshot,
        //       messages: [
        //         {
        //           id,
        //           body: message,
        //           conversationId,
        //           senderId: session.id,
        //           createdAt: new Date(Date.now()),
        //           updatedAt: new Date(Date.now()),
        //           sender: {
        //             id: session.id,
        //             username: session.username!,
        //           },
        //         },
        //         ...snapshot.messages,
        //       ],
        //     },
        //   });
        // },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex space-x-3"
      >
        <div className="flex-1">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Leave a message..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* <Button disabled={loading} variant={"secondary"} type="submit">
          {loading === true ? "Sending..." : "Send"}
        </Button> */}
      </form>
    </Form>
  );
}
