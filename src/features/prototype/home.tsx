import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/job-card";
import { usePrototype } from "./store";
import { publishedJobs } from "./model";
import { cn } from "@/lib/utils";

const categories = [
  {
    slug: "build",
    label: "Build",
    description: "Tworzysz modele, systemy i produkty wykorzystujące AI.",
  },
  {
    slug: "apply",
    label: "Apply",
    description: "Używasz AI, żeby lepiej wykonywać swoją właściwą pracę.",
  },
  {
    slug: "lead",
    label: "Lead",
    description: "Prowadzisz zmianę, decyzje i zespoły w świecie AI.",
  },
] as const;

export default function HomePage() {
  const { state } = usePrototype();
  const latestJobs = publishedJobs(state).slice(0, 4);

  return (
    <>
      <section className="neon-home-hero">
        <div className="neon-home-inner">
          <div className="neon-home-copy">
            <h1>
              Przyszłość
              <br />
              nie czeka.
              <br />
              <span>Do roboty.</span>
            </h1>
            <p>Znajdź swoje miejsce w świecie AI.</p>
            <Link to="/oferty" className={cn(buttonVariants({ size: "lg" }), "neon-home-cta")}>
              Zobacz oferty <ArrowRight />
            </Link>
          </div>
          <span className="neon-caption">LUDZIE × POMYSŁY × AI</span>
        </div>
      </section>
      <section className="neon-featured">
        <h2>Oferty dla Ciebie</h2>
        <div className="neon-featured-grid">
          {latestJobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-medium tracking-[var(--gui-tracking-xl)] text-muted-foreground">
          Trzy sposoby pracy z AI
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[var(--gui-tracking-s)] sm:text-4xl">
          Build. Apply. Lead.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <article key={category.slug} className="prototype-panel">
              <span className="text-xs font-medium text-muted-foreground">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{category.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--gui-link)] hover:underline"
                to={`/oferty?category=${category.slug}`}
              >
                Przeglądaj role <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
