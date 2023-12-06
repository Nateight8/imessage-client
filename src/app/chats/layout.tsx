// import type { Metadata } from "next";
"use client";
import Nav from "@/components/nav";
import conversationOperations from "@/graphql/operations/conversation";
import { ConversationsData } from "@/lib/typesdefs";

import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { PropsWithChildren, useEffect, useState } from "react";

import { ConversationPopulated } from "../../../../imessage/apollo-server/src/schema/types.utils";
import { useMutation, useSubscription } from "@apollo/client";
import ChatHeader from "@/components/chats/chatHeader";
import Footer from "@/components/chats/footer";
import { useSession } from "next-auth/react";

export default function RootLayout({ children }: PropsWithChildren) {
  const { data: conversationsData, subscribeToMore } =
    useQuery<ConversationsData>(conversationOperations.Queries.conversations);

  useEffect(() => {
    const onSubscribe = subscribeToMore({
      document: conversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        // console.log("prev:", prev.conversations);

        const latestConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [...prev.conversations, latestConversation],
        });
      },
    });

    return () => onSubscribe();
  }, []);

  // console.log(conversationsData?.conversations[1]);

  return (
    <div className="flex w-full">
      <aside className="border-r border-border hidden lg:block">
        <Nav data={conversationsData?.conversations || []} />
      </aside>
      <main className="flex-1">
        <div className="">
          <ChatHeader />
        </div>

        {children}
      </main>
    </div>
  );
}
