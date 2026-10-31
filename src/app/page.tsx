import { Reveal } from "@/components/ui/reveal";
import { WatchRoom } from "@/components/sections/watch-room";
import { site } from "@/lib/site-config";

export default function HomePage() {
  return (
    <div className="pb-32 pt-36 md:pt-40">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Закрытый показ</p>
          <h1 className="max-w-2xl text-balance font-display text-5xl font-light italic leading-[1.05] md:text-7xl">
            {site.name}
          </h1>
          <p className="mt-5 max-w-md text-balance text-base text-mist md:text-lg">{site.tagline}</p>
        </Reveal>

        <div className="mt-14">
          <WatchRoom />
        </div>
      </div>
    </div>
  );
}
