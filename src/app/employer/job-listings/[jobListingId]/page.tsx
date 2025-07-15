import { ActionButton } from "@/components/ActionButton";
import { AsyncIf } from "@/components/AsyncIf";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { db } from "@/drizzle/database";
import {
  JoblistingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema";
import ApplicationTable, {
  SkeletonApplications,
} from "@/features/jobListingApplication/components/ApplicationTable";
import { getJoblistingApplicationJobListingTag } from "@/features/jobListingApplication/db/cache/jobListingApplications";
import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/features/jobListings/actions/action";
import JoblistingBadges from "@/features/jobListings/component/JoblistingBadges";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "@/features/jobListings/lib/planFeatureHelpers";
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResume";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermission";
import { and, eq } from "drizzle-orm";
import {
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  LucideTrash2,
  StarIcon,
  StarOffIcon,
} from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { ReactNode, Suspense } from "react";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

export default function page(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage({ params }: Props) {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return null;

  const { jobListingId } = await params;
  const jobListing = await getJobListing(jobListingId, orgId);
  if (!jobListing) return notFound();

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JoblistingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <AsyncIf
            condition={() => hasOrgUserPermissions("org:job_listings:update")}
          >
            <Button asChild variant="outline">
              <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                <EditIcon className="size-4" /> Edit
              </Link>
            </Button>
          </AsyncIf>
          <StatusUpdateButton status={jobListing.status} id={jobListing.id} />
          {jobListing.status === "published" && (
            <FeaturedToggleButton
              isFeatured={jobListing.isFeatured}
              id={jobListing.id}
            />
          )}
          <AsyncIf
            condition={() => hasOrgUserPermissions("org:job_listings:delete")}
          >
            <ActionButton
              variant="destructive"
              action={deleteJobListing.bind(null, jobListing.id)}
              requireAreYouSure
            >
              <LucideTrash2 className="size-4" /> Delete
            </ActionButton>
          </AsyncIf>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="description"
      />

      <Separator />
      <div className="space-y-6 ">
        <h2 className="text-xl font-semibold">Applications</h2>
        <Suspense fallback={<SkeletonApplications />}>
          <Applications jobListingId={jobListingId} />
        </Suspense>
      </div>
    </div>
  );
}

function StatusUpdateButton({
  status,
  id,
}: {
  status: JobListingStatus;
  id: string;
}) {
  const button = (
    <ActionButton
      action={toggleJobListingStatus.bind(null, id)}
      variant={"outline"}
      requireAreYouSure={getNextJobListingStatus(status) === "published"}
      areYouSureDescription="This will show the job Listing to all User"
    >
      {statusToggleButtonText(status)}
    </ActionButton>
  );
  return (
    <AsyncIf
      condition={() => hasOrgUserPermissions("org:job_listings:change_status")}
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxPublishedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={statusToggleButtonText(status)}
              popoverText="You must Upgrade your plan to publish more job listings"
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
}

function FeaturedToggleButton({
  isFeatured,
  id,
}: {
  isFeatured: boolean;
  id: string;
}) {
  const button = (
    <ActionButton
      action={toggleJobListingFeatured.bind(null, id)}
      variant={"outline"}
    >
      {featuredToggleButtonText(isFeatured)}
    </ActionButton>
  );

  return (
    <AsyncIf
      condition={() => hasOrgUserPermissions("org:job_listings:change_status")}
    >
      {isFeatured ? (
        button
      ) : (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxFeaturedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={featuredToggleButtonText(isFeatured)}
              popoverText="You must Upgrade your plan to feature more job listings"
            />
          }
        >
          {button}
        </AsyncIf>
      )}
    </AsyncIf>
  );
}

function UpgradePopover({
  buttonText,
  popoverText,
}: {
  buttonText: ReactNode;
  popoverText: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>{buttonText}</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {popoverText}
        <Button asChild>
          <Link href={"/employer/pricing"}>Upgrade Plan</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function statusToggleButtonText(status: JobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      );
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
}

function featuredToggleButtonText(isFeatured: boolean) {
  if (isFeatured)
    return (
      <>
        <StarOffIcon className="size-4" />
        UnFeatured
      </>
    );

  return (
    <>
      <StarIcon className="size-4" />
      Feature
    </>
  );
}

async function Applications({ jobListingId }: { jobListingId: string }) {
  const applications = await getJobListingApplications(jobListingId);

  return (
    <ApplicationTable
      applications={applications.map((a) => ({
        ...a,
        user: {
          ...a.user,
          resume: a.user.resume
            ? {
                ...a.user.resume,
                aiSummary: a.user.resume.aiSummary ? (
                  <MarkdownRenderer source={a.user.resume.aiSummary} />
                ) : null,
              }
            : null,
        },
        coverLetter: a.coverLetter ? (
          <MarkdownRenderer source={a.coverLetter} />
        ) : null,
      }))}
      canUpdateRating={await hasOrgUserPermissions(
        "org:job_listing_applications:change_rating"
      )}
      canUpdateStage={await hasOrgUserPermissions(
        "org:job_listing_applications:change_stage"
      )}
    />
  );
}

async function getJobListingApplications(jobListingId: string) {
  "use cache";
  cacheTag(getJoblistingApplicationJobListingTag(jobListingId));

  const data = await db.query.JoblistingApplicationTable.findMany({
    where: eq(JoblistingApplicationTable.jobListingId, jobListingId),
    columns: {
      coverLetter: true,
      createdAt: true,
      stage: true,
      rating: true,
      jobListingId: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
        with: {
          resume: {
            columns: {
              resumeFileUrl: true,
              aiSummary: true,
            },
          },
        },
      },
    },
  });

  data.forEach(({ user }) => {
    cacheTag(getUserIdTag(user.id));
    cacheTag(getUserResumeIdTag(user.id));
  });

  return data;
}

async function getJobListing(jobListingId: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(jobListingId));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, jobListingId),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}
