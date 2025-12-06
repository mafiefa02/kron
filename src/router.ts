import { createHashRouter } from "react-router";
import { profileCheckLoader } from "./loaders";
import { Home, Onboarding, PickProfiles, Profiles, Sounds } from "./pages";
import { Layout } from "./pages/layout";
import { getProfiles } from "./pages/pick-profiles/loaders/get-profiles";

export const router = createHashRouter([
  {
    loader: profileCheckLoader,
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "profiles", Component: Profiles },
      { path: "sounds", Component: Sounds },
    ],
  },
  {
    path: "onboarding",
    Component: Onboarding,
  },
  {
    path: "pick-profiles",
    loader: getProfiles,
    Component: PickProfiles,
  },
]);
