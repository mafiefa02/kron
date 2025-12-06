import { BackgroundBeams } from "@shared/components/background-beams";
import { BrandText } from "@shared/components/brand-text";
import { Spotlight } from "@shared/components/spotlight";
import { Card, CardContent, CardFooter } from "@shared/components/ui/card";
import { useLoaderData } from "react-router";
import { CreateNewProfile } from "./components/create-new-profile";
import { ProfileCard } from "./components/profile-card";
import { type GetProfiles } from "./loaders/get-profiles";

export const PickProfiles = () => {
  const profiles = useLoaderData<GetProfiles>();
  return (
    <div className="relative flex h-dvh flex-1 items-center justify-center overflow-hidden p-8">
      <BrandText className="absolute top-8 text-muted-foreground" />
      <BackgroundBeams />
      <div className="absolute size-full max-w-2xl">
        <Spotlight />
      </div>

      <div className="flex h-full w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-8 pt-28 pb-20">
        <div className="flex w-full items-center justify-between">
          <div className="w-full space-y-0 text-center">
            <h1 className="text-3xl font-bold">Pick a Profile</h1>
            <h3 className="font-light text-muted-foreground">
              Choose a profile to get set up
            </h3>
          </div>
        </div>

        <Card className="flex max-h-full w-full bg-card/15">
          <CardContent className="overflow-y-auto">
            <div className="flex w-full flex-col gap-3">
              {profiles.map((profile) => (
                <ProfileCard
                  profile={profile}
                  key={profile.id}
                />
              ))}
            </div>
          </CardContent>

          <CardFooter>
            <CreateNewProfile />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
