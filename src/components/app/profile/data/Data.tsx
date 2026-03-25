import { DataProps } from "./types";
import { Reviews } from "./tabs";

export default function Data({ activeTab, userId }: DataProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        return <Reviews userId={userId} />;
      case "discussions":
        return <div>Discussions Content</div>;
      case "playlists":
        return <div>Playlists Content</div>;
      case "goals":
        return <div>Goals Content</div>;
      default:
        return null;
    }
  };
  return <section className="flex flex-col gap-1">{renderContent()}</section>;
}
