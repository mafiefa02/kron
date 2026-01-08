import { BackgroundBeams } from "@shared/components/background-beams";
import { BrandText } from "@shared/components/brand-text";
import { Spotlight } from "@shared/components/spotlight";
import { NewProfileForm } from "./components/new-profile-form";

export const Onboarding = () => {
  return (
    <>
      <BackgroundBeams className="pointer-events-none" />
      <div className="pointer-events-none absolute size-full max-w-2xl">
        <Spotlight />
      </div>

      <div className="space-y-1 text-center">
        <BrandText className="text-5xl [&_svg]:size-11" />
        <h3 className="text-center font-light tracking-tight text-muted-foreground">
          The hassle-free scheduling solution
        </h3>
      </div>
      <NewProfileForm />
    </>
  );
};
