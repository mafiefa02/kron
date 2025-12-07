import { db } from "@shared/lib/db";
import { stores } from "@shared/lib/stores";
import { LoaderFunction, redirect } from "react-router";

export const profileCheckLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === "/pick-profiles" || url.pathname === "/onboarding")
    return null;

  const currentProfileId = (await stores.config.get(
    "active_profile",
  )) as number;

  if (currentProfileId) {
    // check if current profile exists in db
    const profile = await db
      .selectFrom("profiles")
      .select("id")
      .where("id", "=", currentProfileId)
      .executeTakeFirst();

    if (profile) return null;
  }

  // check either:
  // 1. this is a first launch (no profiles in db and config)
  const { count } = await db
    .selectFrom("profiles")
    .select(db.fn.countAll<number>().as("count"))
    .executeTakeFirstOrThrow();

  if (count === 0) {
    // force the user to create a profile
    // on first launch
    throw redirect("/onboarding");
  }

  // 2. currently selected profile does not exists in db
  throw redirect("/pick-profiles");
};
