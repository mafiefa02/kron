import { db, Profiles } from "@shared/lib/db";
import type { Selectable } from "kysely";
import { useEffect, useState } from "react";

export const Home = () => {
  const [data, setData] = useState<Selectable<Profiles>[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await db.selectFrom("profiles").selectAll().execute();
        setData(response);
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        console.error("Failed to fetch profiles", error.message);
      }
    };

    fetchProfiles();
  }, []);

  if (error !== null) return <p>{error}</p>;

  return <p>{JSON.stringify(data)}</p>;
};
