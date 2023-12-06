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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import userOperations from "@/graphql/operations/user";
import { UsernameData, UsernameVariables } from "@/lib/typesdefs";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function AddUsername() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const [createUsername, { loading, data, error }] = useMutation<
    UsernameData,
    UsernameVariables
  >(userOperations.Mutations.createUsername);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    const { username } = formData;

    try {
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log(error);
    }

    form.reset();
    redirect("/chats");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter a Username" {...field} />
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
          {loading === true ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
