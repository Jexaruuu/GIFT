import { useState } from "react";
import HeroSection from "./homepage/herosection";
import NewYearHeroSection from "./homepage/newyearherosection";

export default function App() {
  const [page, setPage] = useState<"christmas" | "newyear">("christmas");

  if (page === "newyear") return <NewYearHeroSection />;

  return <HeroSection onNewYear={() => setPage("newyear")} />;
}
