"use client";
import SentMessage from "@/components/chats/SentMessage";
import { TextField } from "@/components/chats/TextField";
import Footer from "@/components/chats/footer";
import Message from "@/components/chats/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import messageOperations from "@/graphql/operations/message";
import { authOptions } from "@/lib/authOptions";
import { MessageData, MessageVariables } from "@/lib/typesdefs";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import React, { useEffect } from "react";
import {
  MessageSentPayload,
  ParticipantPopulated,
} from "../../../../../imessage/apollo-server/src/schema/types.utils";
import { useSession } from "next-auth/react";
import conversationOperations from "@/graphql/operations/conversation";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

interface Props {
  params: {
    chat: string;
  };
}

function Page({ params }: Props) {
  const { chat: conversationId } = params;

  // session
  const session = useSession();
  const userId = session.data?.user.id;

  const { data, loading, subscribeToMore } = useQuery<
    MessageData,
    MessageVariables
  >(messageOperations.Queries.messages, {
    variables: { conversationId },
  });

  const [markAsRead, { data: markedAs }] = useMutation<
    { markConversation: boolean },
    { userId: string; conversationId: string }
  >(conversationOperations.Mutations.markAsRead);

  const onViewConversation = async () => {
    try {
      await markAsRead({
        variables: { conversationId, userId: userId! },
        optimisticResponse: {
          markConversation: true,
        },

        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participant: ParticipantPopulated[];
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  id
                  username
                }
                hasSeenLatestMmessage
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participant];

          const participantsIndex = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (participantsIndex === -1) return;

          const participant = participants[participantsIndex];

          participants[participantsIndex] = {
            ...participant,
            hasSeenLatestMessage: true,
          };

          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  id
                  username
                }
                hasSeenLatestMmessage
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const userId = session.data?.user.id;
  useEffect(() => {
    const onSubscribe = subscribeToMore({
      document: messageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSentPayload) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages: [...prev.messages, newMessage],
        });
      },
    });

    return () => onSubscribe();
  }, [conversationId]);

  const sessionId = session.data?.user.id;

  const dynamicH = "calc(100vh - 9rem)";

  return (
    <>
      <ScrollArea style={{ height: dynamicH }} className="w-full">
        <div className="flex justify-end h-full flex-col py-16 w-full px-4 space-y-6">
          {loading && (
            <div className="h-full flex items-center justify-center">
              <p>Loading conversations...</p>
            </div>
          )}

          {data?.messages && (
            <>
              {data.messages.map((message) => (
                <Message
                  message={message}
                  key={message.id}
                  isUser={sessionId === message.sender.id}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
      <div className="">
        <div className="h-16 px-4 flex items-center">
          <TextField conversationId={conversationId} />
        </div>
      </div>
    </>
  );
}

export default Page;
