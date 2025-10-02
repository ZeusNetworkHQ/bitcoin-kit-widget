import Hero from "./sections/Hero";
import EmbedSelector from "./components/Embed/EmbedSelector";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-44 items-center justify-start min-h-[calc(100dvh-150px)]">
      <Hero />
      <EmbedSelector />
    </div>
  );
}
