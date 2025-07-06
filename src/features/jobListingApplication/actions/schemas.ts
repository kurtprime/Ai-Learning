import z from "zod";

export const NewJobListingApplicationFormSchema = z.object({
  coverLetter: z
    .string()
    .transform((val) => (val.trim() === "" ? null : val))
    .nullable(),
});
