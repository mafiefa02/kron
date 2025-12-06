import { BackgroundBeams } from "@shared/components/background-beams";
import { BrandText } from "@shared/components/brand-text";
import { Spotlight } from "@shared/components/spotlight";
import { NewProfileForm } from "./components/new-profile-form";

export const Onboarding = () => {
  return (
    <div className="relative flex h-dvh flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-8">
      <BackgroundBeams />
      <div className="absolute size-full max-w-2xl">
        <Spotlight />
      </div>

      <div className="space-y-1">
        <BrandText className="text-5xl [&_svg]:size-11" />
        <h3 className="text-center font-light tracking-tight text-muted-foreground">
          Let&apos;s get you set up as quick as possible
        </h3>
      </div>
      <NewProfileForm />
    </div>
  );
};
