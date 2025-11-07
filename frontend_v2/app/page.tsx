import Link from "next/link"

import { Button } from "@/components/ui/button"
import DotGridShader from "@/components/DotGridShader"

import ProjectCard from "@/components/project-card"
import AnimatedHeading from "@/components/animated-heading"
import RevealOnView from "@/components/reveal-on-view"

export default function Page() {
  const projects = [
    {
      title: "Lung nodule detection on CT",
      subtitle: "CAD for lung cancer screening (LDCT)",
      imageSrc: "images/bg_1.jpg",
      tags: ["CT", "Detection", "CAD"],
      href: "#project-1",
      priority: true,
      gradientFrom: "#0f172a",
      gradientTo: "#6d28d9",
    },
    {
      title: "Lung tumor segmentation",
      subtitle: "3D U‑Net/nnU‑Net for treatment planning",
      imageSrc: "/images/bg_2.jpg",
      tags: ["Segmentation", "3D", "Treatment Planning"],
      href: "#project-2",
      priority: false,
      gradientFrom: "#111827",
      gradientTo: "#2563eb",
    },
    {
      title: "Chest X‑ray triage",
      subtitle: "Detect abnormalities (Pneumothorax, Nodules, Effusion)",
      imageSrc: "/images/bg_3.jpg",
      tags: ["CXR", "Triage", "Abnormality"],
      href: "#project-3",
      priority: false,
      gradientFrom: "#0b132b",
      gradientTo: "#5bc0be",
    },
  ]

  return (
    <main className="bg-neutral-950 text-white">
      {/* HERO: full-viewport row. Left is sticky; right scrolls internally. */}
      <section className="px-4 pt-4 pb-16 lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
          {/* LEFT: sticky and full height, no cut off */}
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
            <RevealOnView
              as="div"
              intensity="hero"
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8"
              staggerChildren
            >
              {/* Texture background */}
              <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-soft-light">
                <DotGridShader />
              </div>
              <div>
                {/* Wordmark */}
                <div className="mb-8 flex items-center gap-2">
                  <div className="text-2xl font-extrabold tracking-tight">Serna Health AI</div>
                  <div className="h-2 w-2 rounded-full bg-white/60" aria-hidden="true" />
                </div>

                {/* Headline with intro blur effect */}
                <AnimatedHeading
                  className="mt-35 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
                  lines={["AI-Powered Lung Cancer Segmentation"]}
                />

                <p className="mt-6 max-w-[52ch] text-lg text-white/70">
                  AI platform for CT and X-ray–based lung cancer detection, segmentation, and reporting
                </p>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/login">Get started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent">
                    <Link href="/register">Create account</Link>
                  </Button>
                </div>

                {/* Trusted by */}
                <div className="mt-10">
                  <p className="mb-3 text-xs font-semibold tracking-widest text-white/50">ACCURACY & RELIABILITY</p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-2xl font-black text-white/25 sm:grid-cols-3">
                    <li>0.85 IoU</li>
                    <li>0.92 Dice</li>
                    <li>2,5k+ Images</li>
                  </ul>
                  <p className="mt-10 text-2xl font-black text-white/25 sm:grid-cols-3">Clinically Validated</p>
                </div>
              </div>
            </RevealOnView>
          </aside>

          {/* RIGHT: simplified, no internal card or horizontal carousel */}
          <div className="space-y-4">
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                subtitle={p.subtitle}
                imageSrc={p.imageSrc}
                tags={p.tags}
                href={p.href}
                priority={p.priority}
                gradientFrom={p.gradientFrom}
                gradientTo={p.gradientTo}
                imageContainerClassName="lg:h-full"
                containerClassName="lg:h-[calc(100svh-2rem)]"
                revealDelay={idx * 0.06}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
