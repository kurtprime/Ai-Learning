"use client";

import { DataTable } from "@/components/dataTable/DataTable";
import { DataTableSortableColumnHeader } from "@/components/dataTable/DataTableSortableColumnHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  applicationStage,
  ApplicationStage,
  JoblistingApplicationTable,
  UserResumeTable,
  UserTable,
} from "@/drizzle/schema";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ReactNode, useOptimistic, useState, useTransition } from "react";
import { sortApplicationsByStage } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { formatJobListingApplicationStage } from "../lib/formatter";
import {
  updateJobListingApplicationRating,
  updateJobListingApplicationStage,
} from "../actions/action";
import { cn } from "@/lib/utils";
import { StageIcon } from "./StageIcon";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import RatingIcons from "./RatingIcons";
import { RATING_OPTIONS } from "../data/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { DataTableFacetedFilter } from "@/components/dataTable/DataTableFacetedFilter";

type Application = Pick<
  typeof JoblistingApplicationTable.$inferSelect,
  "createdAt" | "stage" | "rating" | "jobListingId"
> & {
  coverLetter?: ReactNode | null;
  user: Pick<typeof UserTable.$inferSelect, "id" | "name" | "imageUrl"> & {
    resume:
      | (Pick<typeof UserResumeTable.$inferSelect, "resumeFileUrl"> & {
          aiSummary: ReactNode | null;
        })
      | null;
  };
};

function getColums(
  canUpdateRating: boolean,
  canUpdateStage: boolean
): ColumnDef<Application>[] {
  return [
    {
      accessorFn: (row) => row.user.name,
      header: "Name",
      cell: ({ row }) => {
        const user = row.original.user;

        const nameInitials = row.original.user.name
          .split(" ")
          .slice(0, 2)
          .map((name) => name.charAt(0).toLocaleUpperCase())
          .join();

        return (
          <div className="flex items-center gap-2">
            <Avatar className="rounded-full size-6">
              <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
              <AvatarFallback className="uppercase bg-primary text-primary-foreground text-xs">
                {nameInitials}
              </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "stage",
      header: ({ column }) => (
        <DataTableSortableColumnHeader title="Stage" column={column} />
      ),
      sortingFn: ({ original: a }, { original: b }) =>
        sortApplicationsByStage(a.stage, b.stage),
      filterFn: ({ original }, _, value) => value.includes(original.stage),
      cell: ({ row }) => (
        <StageCell
          canUpdate={canUpdateStage}
          stage={row.original.stage}
          jobListingId={row.original.jobListingId}
          userId={row.original.user.id}
        />
      ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableSortableColumnHeader title="Rating" column={column} />
      ),
      filterFn: ({ original }, _, value) => {
        return value.includes(original.rating);
      },
      cell: ({ row }) => (
        <RatingCell
          canUpdate={canUpdateRating}
          rating={row.original.rating}
          jobListingId={row.original.jobListingId}
          userId={row.original.user.id}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataTableSortableColumnHeader title="Applied On" column={column} />
      ),
      cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const jobListing = row.original;
        const resume = jobListing.user.resume;

        return (
          <ActionCell
            coverLetterMarkdown={jobListing.coverLetter}
            resumeMarkdown={resume?.aiSummary}
            resumeUrl={resume?.resumeFileUrl}
            userName={jobListing.user.name}
          />
        );
      },
    },
  ];
}

export function SkeletonApplications() {
  return (
    <ApplicationTable
      applications={[]}
      canUpdateRating={false}
      canUpdateStage={false}
      disableToolbar
      noResultsMessage={<LoadingSpinner className="size-12" />}
    />
  );
}

export default function ApplicationTable({
  applications,
  canUpdateRating,
  canUpdateStage,
  noResultsMessage = "No applications",
  disableToolbar = false,
}: {
  applications: Application[];
  canUpdateRating: boolean;
  canUpdateStage: boolean;
  noResultsMessage?: ReactNode;
  disableToolbar?: boolean;
}) {
  return (
    <DataTable
      data={applications}
      columns={getColums(canUpdateRating, canUpdateStage)}
      noResultsMessage={noResultsMessage}
      ToolbarComponent={disableToolbar ? DisabledToolbar : Toolbar}
      initialFilters={[
        {
          id: "stage",
          value: applicationStage.filter((stage) => stage !== "denied"),
        },
      ]}
    />
  );
}

function Toolbar<T>({
  table,
  disabled,
}: {
  table: Table<T>;
  disabled?: boolean;
}) {
  const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount();

  return (
    <div className="flex items-center gap-2 ">
      {table.getColumn("stage") && (
        <DataTableFacetedFilter
          disabled={disabled}
          column={table.getColumn("stage")}
          title="Stage"
          options={applicationStage
            .toSorted(sortApplicationsByStage)
            .map((stage) => ({
              label: <StageDetails stage={stage} />,
              value: stage,
              key: stage,
            }))}
        />
      )}
      {table.getColumn("rating") && (
        <DataTableFacetedFilter
          disabled={disabled}
          title="Rating"
          column={table.getColumn("rating")}
          options={RATING_OPTIONS.map((rating, i) => ({
            label: <RatingIcons rating={rating} />,
            value: rating,
            key: i,
          }))}
        />
      )}
      {hiddenRows > 0 && (
        <div className="text-sm text-muted-foreground ml-2">
          {hiddenRows} hidden {hiddenRows > 1 ? "rows" : "row"}
        </div>
      )}
    </div>
  );
}

function DisabledToolbar<T>({ table }: { table: Table<T> }) {
  return <Toolbar table={table} disabled />;
}

function StageCell({
  stage,
  jobListingId,
  userId,
  canUpdate,
}: {
  stage: ApplicationStage;
  jobListingId: string;
  userId: string;
  canUpdate: boolean;
}) {
  const [optimisticStage, setOptimisticStage] = useOptimistic(stage);
  const [isPending, startTransition] = useTransition();

  if (!canUpdate) {
    return <StageDetails stage={optimisticStage} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("-ml-3", isPending && "opacity-50")}
        >
          <StageDetails stage={optimisticStage} />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {applicationStage
          .toSorted(sortApplicationsByStage)
          .map((stageValue) => (
            <DropdownMenuItem
              key={stageValue}
              onClick={() => {
                startTransition(async () => {
                  setOptimisticStage(stageValue);
                  const res = await updateJobListingApplicationStage(
                    {
                      jobListingId,
                      userId,
                    },
                    stageValue
                  );

                  if (res?.error) {
                    toast.error(res.message);
                  }
                });
              }}
            >
              <StageDetails stage={stageValue} />
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RatingCell({
  rating,
  jobListingId,
  userId,
  canUpdate,
}: {
  rating: number | null;
  jobListingId: string;
  userId: string;
  canUpdate: boolean;
}) {
  const [optimisticRating, setOptimisticRating] = useOptimistic(rating);
  const [isPending, startTransition] = useTransition();

  if (!canUpdate) {
    return <RatingIcons rating={optimisticRating} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("-ml-3", isPending && "opacity-50")}
        >
          <RatingIcons rating={optimisticRating} />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {RATING_OPTIONS.map((ratingValue) => (
          <DropdownMenuItem
            key={ratingValue ?? "none"}
            onClick={() => {
              startTransition(async () => {
                setOptimisticRating(ratingValue);
                const res = await updateJobListingApplicationRating(
                  {
                    jobListingId,
                    userId,
                  },
                  ratingValue
                );

                if (res?.error) {
                  toast.error(res.message);
                }
              });
            }}
          >
            <RatingIcons rating={ratingValue} className="text-inherit" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ActionCell({
  resumeUrl,
  userName,
  resumeMarkdown,
  coverLetterMarkdown,
}: {
  resumeUrl: string | null | undefined;
  userName: string;
  resumeMarkdown: ReactNode | null;
  coverLetterMarkdown: ReactNode | null;
}) {
  const [openModal, setOpenModal] = useState<"resume" | "coverLetter" | null>(
    null
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {resumeUrl != null || resumeMarkdown != null ? (
            <DropdownMenuItem onClick={() => setOpenModal("resume")}>
              View Resume
            </DropdownMenuItem>
          ) : (
            <DropdownMenuLabel className="text-muted-foreground">
              No Resume
            </DropdownMenuLabel>
          )}
          {coverLetterMarkdown ? (
            <DropdownMenuItem onClick={() => setOpenModal("coverLetter")}>
              View Cover Letter
            </DropdownMenuItem>
          ) : (
            <DropdownMenuLabel className="text-muted-foreground">
              No Cover Letter
            </DropdownMenuLabel>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {coverLetterMarkdown && (
        <Dialog
          open={openModal === "coverLetter"}
          onOpenChange={(o) => setOpenModal(o ? "coverLetter" : null)}
        >
          <DialogContent className="lg:max-w-5xl md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Cover Letter</DialogTitle>
              <DialogDescription>{userName}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{coverLetterMarkdown}</div>
          </DialogContent>
        </Dialog>
      )}
      {(resumeMarkdown || resumeUrl) && (
        <Dialog
          open={openModal === "resume"}
          onOpenChange={(o) => setOpenModal(o ? "resume" : null)}
        >
          <DialogContent className="lg:max-w-5xl md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Resume</DialogTitle>
              <DialogDescription>{userName}</DialogDescription>
              {resumeUrl && (
                <Button asChild className="self-start">
                  <Link
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Original Resume
                  </Link>
                </Button>
              )}
              <DialogDescription className="mt-2">
                This is an AI-generated summary of the applicant&apos;s resume
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{resumeMarkdown}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
function StageDetails({ stage }: { stage: ApplicationStage }) {
  return (
    <div className="flex gap-2 items-center">
      <StageIcon stage={stage} className="size-5 text-inherit" />
      <div>{formatJobListingApplicationStage(stage)}</div>
    </div>
  );
}
