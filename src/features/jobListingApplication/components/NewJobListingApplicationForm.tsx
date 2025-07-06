"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { MarkDownEditor } from "@/components/markdown/MarkdownEditor";
import { Button } from "@/components/ui/button";
import LoadingSwap from "@/components/LoadingSwap";
import { toast } from "sonner";
import { createJobListingApplication } from "../actions/action";
import { NewJobListingApplicationFormSchema } from "../actions/schemas";

export default function NewJobListingApplicationForm({
  jobListingId,
}: {
  jobListingId: string;
}) {
  const form = useForm({
    resolver: zodResolver(NewJobListingApplicationFormSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  async function onSubmit(
    data: z.infer<typeof NewJobListingApplicationFormSchema>
  ) {
    const results = await createJobListingApplication(jobListingId, data);

    if (results.error) {
      toast.error(results.message);
      return;
    }

    toast.success(results.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <MarkDownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
