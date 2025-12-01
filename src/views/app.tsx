import type { Selectable } from "kysely";
import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { Profiles } from "../lib/db/types";

export const App = () => {
  const [data, setData] = useState<Selectable<Profiles>[] | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await db.selectFrom("profiles").selectAll().execute();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch profiles", error);
      }
    };

    fetchProfiles();
  }, []);

  if (!data) return <p>Loading...</p>;

  return <p>{JSON.stringify(data)}</p>;
};
