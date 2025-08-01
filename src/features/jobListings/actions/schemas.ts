import {
  experienceLevel,
  jobListingType,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import z from "zod";

export const jobListingSchema = z
  .object({
    title: z.string().min(1, "Title Required"),
    description: z.string().min(1, "Description Required"),
    experienceLevel: z.enum(experienceLevel),
    locationRequirement: z.enum(locationRequirements),
    type: z.enum(jobListingType),
    wage: z.number().int().positive().min(1).nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),
    stateAbbreviation: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val))
      .nullable(),
    city: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val))
      .nullable(),
  })
  .refine(
    (listing) => {
      return listing.locationRequirement === "remote" || listing.city != null;
    },
    {
      message: "Required for non-remote listings",
      path: ["city"],
    }
  )
  .refine(
    (listing) => {
      return (
        listing.locationRequirement === "remote" ||
        listing.stateAbbreviation != null
      );
    },
    {
      message: "Required for non-remote listings",
      path: ["stateAbbreviation"],
    }
  );

export const jobListingSearchSchema = z.object({
  query: z.string().min(1, "Required"),
});
