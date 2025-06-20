import {
  pgTable,
  text,
  uuid,
  varchar,
  integer,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { JobListingTable } from "./jobListing";
import { UserTable } from "./user";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const applicationStage = [
  "denied",
  "applied",
  "interested",
  "interviewed",
  "hired",
] as const;
export type applicationStage = (typeof applicationStage)[number];
export const applicationStageEnum = pgEnum(
  "job_application_stage",
  applicationStage
);

export const JoblistingApplicationTable = pgTable(
  "job_listing_applications",
  {
    jobListingId: uuid()
      .references(() => JobListingTable.id, { onDelete: "cascade" })
      .notNull(),
    userId: varchar()
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),
    coverLetter: text(),
    rating: integer(),
    stage: applicationStageEnum().notNull().default("applied"),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.jobListingId, table.userId] })]
);

export const jobListingApplicationRelations = relations(
  JoblistingApplicationTable,
  ({ one }) => ({
    jobListing: one(JobListingTable, {
      fields: [JoblistingApplicationTable.jobListingId],
      references: [JobListingTable.id],
    }),
    user: one(UserTable, {
      fields: [JoblistingApplicationTable.userId],
      references: [UserTable.id],
    }),
  })
);
