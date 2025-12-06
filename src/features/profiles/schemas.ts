import z from "zod";

export const createProfileSchema = z.object({
  "profile-name": z.string().min(1, { error: "Name is required!" }),
});
