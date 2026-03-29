import { DataProps } from "./types";
import { Reviews, Discussions, Playlists, Goals } from "./tabs";

export default function ProfileBody({ activeTab, userId }: DataProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        return <Reviews userId={userId} />;
      case "discussions":
        return <Discussions userId={userId} />;
      case "playlists":
        return <Playlists userId={userId} />;
      case "goals":
        return <Goals userId={userId} />;
      default:
        return null;
    }
  };
  return <section className="flex flex-col gap-1">{renderContent()}</section>;
}
