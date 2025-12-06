import { BrandText } from "../brand-text";

export const Header = () => {
  return (
    <header className="px-4 py-3">
      <div className="flex justify-between">
        <BrandText />
      </div>
    </header>
  );
};
