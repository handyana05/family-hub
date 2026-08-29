import "server-only";

import { db } from "@/lib/db";

export type FamilyMemberHeaderDto = {
  id: string;
  name: string;
  avatarUrl: string | null;
  color: string | null;
};

export type FamilyHeaderDto = {
  name: string;
  members: FamilyMemberHeaderDto[];
};

export async function getFamilyHeaderData(
  householdId: string
): Promise<FamilyHeaderDto> {
  const household = await db.household.findUnique({
    where: {
      id: householdId,
    },
    select: {
      name: true,
      users: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          color: true,
        },
      },
    },
  });

  if (!household) {
    throw new Error("Household not found");
  }

  return {
    name: household.name,
    members: household.users,
  };
}