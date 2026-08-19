"use client";

import React from "react";
import Link from "next/link";
import {
  ChefHat,
  Star,
  Trophy,
  Users,
  ArrowRight,
  MessageSquare,
  Utensils,
  Search,
  Sparkles,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { WordRotate } from "@/components/ui/word-rotate";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Ripple } from "@/components/ui/ripple";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { BrandLogo } from "@/components/ui/BrandLogo";

const reviews = [
  {
    name: "Rahim Ahmed",
    role: "CSE Student",
    body: "The biryani at Dhaka Biryani House is absolutely authentic. Rating dishes before ordering saves money!",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    role: "BBA Student",
    body: "Love how easy it is to find good campus eats. The live ratings and prices are super accurate.",
    rating: 5,
  },
  {
    name: "Arif Hossain",
    role: "EEE Student",
    body: "Finally a platform where students have a voice and shop owners actually respond to feedback.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "English Student",
    body: "The campus leaderboard keeps stalls accountable. Food quality on campus has noticeably improved!",
    rating: 5,
  },
  {
    name: "Tanvir Islam",
    role: "SWE Student",
    body: "Clean UI, instant dish ratings, and transparent prices in Taka. Super helpful for lunch breaks.",
    rating: 5,
  },
  {
    name: "Sadia Rahman",
    role: "Pharmacy Student",
    body: "I check reviews before every meal now. Avoided bad stalls and found great breakfast spots!",
    rating: 5,
  },
];

function ReviewCard({
  name,
  role,
  body,
  rating,
}: {
  name: string;
  role: string;
  body: string;
  rating: number;
}) {
  return (
    <figure className="relative w-80 shrink-0 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md p-5 shadow-2xs transition-transform hover:scale-[1.01]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs shadow-2xs">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <figcaption className="text-xs font-bold text-gray-900 truncate">
            {name
          }</figcaption>
          <p className="text-xs text-gray-500 font-medium">{role}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
          />
        ))}
      </div>
      <blockquote className="mt-2 text-xs text-gray-700 leading-relaxed font-normal">
        &ldquo;{body}&rdquo;
      </blockquote>
    </figure>
  );
}

const features = [
  {
    icon: Star,
    title: "Honest Dish & Stall Reviews",
    description:
      "Rate individual food items and entire campus stalls with dual-layer fractional star precision and verified student feedback.",
  },
  {
    icon: Trophy,
    title: "Live Campus Leaderboard",
    description:
      "Real-time rankings highlight top-rated food stalls across DIU campus, driving healthy vendor accountability.",
  },
  {
    icon: Utensils,
    title: "Digital Menus & Live Pricing",
    description:
      "Browse updated menus, dish photos, ingredients, and exact prices in BDT (৳) before heading out for lunch.",
  },
  {
    icon: MessageSquare,
    title: "Two-Way Owner Responses",
    description:
      "Shop owners reply directly to student reviews, addressing quality concerns and building peer trust.",
  },
];

const steps = [
  {
    step: "01",
    title: "Join with DIU Mail",
    description: "Sign in with your @diu.edu.bd account for verified student or merchant access.",
    icon: Users,
  },
  {
    step: "02",
    title: "Explore Campus Eats",
    description: "Browse certified stalls, filter menus, and check real-time dish ratings.",
    icon: Search,
  },
  {
    step: "03",
    title: "Rate & Share Feedback",
    description: "Submit star ratings, review taste & portion size, and guide classmates.",
    icon: Star,
  },
  {
    step: "04",
    title: "Elevate Campus Food",
    description: "Help top-performing vendors climb the DIU Leaderboard rankings.",
    icon: Trophy,
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-100 bg-white/95 backdrop-blur-lg shadow-2xs"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo size="md" />
            <span className={`text-base font-bold transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white drop-shadow-xs"}`}>
              DIU Food Review
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-semibold transition-colors duration-300 cursor-pointer ${scrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-white/90 hover:text-white hover:bg-white/15"}`}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 cursor-pointer"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative">
        <div className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pb-20 pt-16">
          {/* DIU Campus background image (Optimized Next.js Image) */}
          <SafeImage
            src="https://tbsgraduates.net/wp-content/uploads/2024/06/359031962_662709532556337_8513791220280977836_n.jpg"
            alt="DIU Campus"
            fill
            priority
            fallbackType="store"
            className="object-cover object-[center_20%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-white/95" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/80 to-transparent z-[5]" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-16 text-center">
            <BlurFade delay={0.1} inView>
              <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 backdrop-blur-md px-4 py-1.5 shadow-2xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <AnimatedShinyText className="text-xs font-bold text-white uppercase tracking-wider">
                  Live for Daffodil International University
                </AnimatedShinyText>
              </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl drop-shadow-lg">
                Discover the Best
                <br />
                <span className="text-emerald-400 drop-shadow-[0_4px_24px_rgba(52,211,153,0.65)]">Campus Food</span>{" "}
                <WordRotate
                  className="inline-block text-emerald-400 drop-shadow-[0_4px_24px_rgba(52,211,153,0.65)]"
                  motionProps={{
                    initial: { opacity: 0, scale: 0.85 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.85 },
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  words={["Reviews", "Ratings", "Menus", "Rankings"]}
                />
              </h1>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <p className="mx-auto mt-6 max-w-xl text-base text-white/95 leading-relaxed sm:text-xl drop-shadow-sm font-medium">
                The official food review platform for DIU. Rate dishes, discover daily stall menus, and shape campus dining — powered by students.
              </p>
            </BlurFade>

            <BlurFade delay={0.6} inView>
              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 gap-2 rounded-2xl bg-emerald-500 px-8 text-xs font-black uppercase tracking-wider text-white shadow-2xl shadow-emerald-700/50 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ring-4 ring-emerald-400/20"
                  >
                    <span>Start Reviewing</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 gap-2 rounded-2xl px-8 text-xs font-black uppercase tracking-wider border-white/40 text-white bg-white/15 backdrop-blur-md hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </BlurFade>

            {/* Distilled Stats Metric Pill */}
            <BlurFade delay={0.8} inView>
              <div className="mx-auto mt-14 w-fit">
                <div className="flex items-center gap-0 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-lg shadow-2xl shadow-black/20 overflow-hidden">
                  {[
                    { value: 500, label: "Student Reviews" },
                    { value: 50, label: "Campus Stalls" },
                    { value: 1000, label: "Verified Students" },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`px-6 py-4 sm:px-10 sm:py-5 text-center ${i < 2 ? "border-r border-white/20" : ""}`}
                    >
                      <div className="text-xl font-black text-white sm:text-3xl drop-shadow-sm">
                        <NumberTicker value={stat.value} />+
                      </div>
                      <p className="mt-0.5 text-xs text-white/90 font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </header>

      {/* ── Features Section (Distilled to 4 Pillars) ── */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Core Capabilities
              </p>
              <h2 className="mt-2.5 text-3xl font-black text-gray-900 sm:text-4xl tracking-tight">
                Everything you need to eat better on campus
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-xs text-gray-500 leading-relaxed font-medium">
                Tailored for DIU students and canteen vendors to make dining transparent and delicious.
              </p>
            </div>
          </BlurFade>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <BlurFade key={feature.title} delay={0.1 + i * 0.1} inView className="h-full">
                <MagicCard
                  className="p-6 rounded-2xl h-full border border-gray-100 shadow-2xs hover:border-emerald-200/80 hover:shadow-md transition-all duration-300"
                  gradientColor="#dcfce7"
                  gradientFrom="#16a34a"
                  gradientTo="#22c55e"
                  gradientOpacity={0.15}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-2xs">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="relative bg-gray-50/70 py-16 sm:py-24 border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Simple Workflow
              </p>
              <h2 className="mt-2.5 text-3xl font-black text-gray-900 sm:text-4xl tracking-tight">
                Get started in 4 easy steps
              </h2>
            </div>
          </BlurFade>

          <div className="mt-14 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
            {steps.map((step, i) => (
              <BlurFade key={step.step} delay={0.15 + i * 0.15} inView>
                <div className="relative flex flex-col items-center text-center px-3">
                  {/* Horizontal connector line on desktop */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-8 left-[calc(50%+2rem)] right-0 hidden h-px bg-gradient-to-r from-emerald-300 to-emerald-100 lg:block" />
                  )}

                  {/* Step Icon Badge */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-emerald-100 border border-emerald-100">
                    <step.icon className="h-7 w-7 text-emerald-600" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white shadow-sm ring-2 ring-white">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-gray-900 leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed max-w-xs mx-auto font-normal">
                    {step.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Marquee ── */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                Community Sentiment
              </p>
              <h2 className="mt-2.5 text-3xl font-black text-gray-900 sm:text-4xl tracking-tight">
                Loved by <SparklesText className="inline text-3xl sm:text-4xl" colors={{ first: "#16a34a", second: "#22c55e" }}>DIU students</SparklesText>
              </h2>
            </div>
          </BlurFade>

          <div className="relative mt-12">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-white" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-white" />
            <Marquee pauseOnHover className="[--duration:35s]">
              {reviews.map((review) => (
                <ReviewCard key={review.name} {...review} />
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* ── Bold Call to Action ── */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-8 sm:p-16 text-center shadow-2xl">
              <BorderBeam
                size={250}
                duration={12}
                colorFrom="#bbf7d0"
                colorTo="#4ade80"
                borderWidth={2}
              />
              <Ripple
                mainCircleSize={100}
                mainCircleOpacity={0.08}
                numCircles={4}
                className="opacity-25 [&_div]:border-white/20 [&_div]:bg-white/5"
              />

              <div className="relative z-10 space-y-4">
                <h2 className="text-3xl font-black text-white sm:text-5xl drop-shadow-md tracking-tight">
                  Ready to discover your next meal?
                </h2>
                <p className="mx-auto max-w-md text-xs text-emerald-100 sm:text-sm font-medium">
                  Join the official DIU food review platform and help fellow students discover great campus dining.
                </p>
                <div className="pt-4 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-12 gap-2 rounded-2xl bg-white px-8 text-xs font-black uppercase tracking-wider text-emerald-900 hover:bg-emerald-50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl ring-4 ring-white/20"
                    >
                      <span>Create Free Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-12 gap-2 rounded-2xl px-8 text-xs font-black uppercase tracking-wider border-white/40 text-white bg-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-gray-50/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" />
              <span className="text-xs font-bold text-gray-900">
                DIU Food Review System
              </span>
            </div>
            <div className="flex items-center gap-5 text-xs font-semibold text-gray-500">
              <Link href="/login" className="hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-gray-900 transition-colors">
                Sign Up
              </Link>
              <Link href="/shops" className="hover:text-gray-900 transition-colors">
                Browse Shops
              </Link>
              <Link href="/leaderboard" className="hover:text-gray-900 transition-colors">
                Leaderboard
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-200/80 pt-6 text-xs text-gray-400 sm:flex-row font-normal">
            <p>&copy; {new Date().getFullYear()} DIU Food Review. All rights reserved.</p>
            <p>Daffodil International University</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
