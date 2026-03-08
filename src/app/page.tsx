"use client";

import React from "react";
import Link from "next/link";
import {
  ChefHat,
  Star,
  Trophy,
  Users,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Utensils,
  TrendingUp,
  Search,
  Heart,
} from "lucide-react";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { WordRotate } from "@/components/ui/word-rotate";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Ripple } from "@/components/ui/ripple";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    name: "Rahim Ahmed",
    role: "CSE Student",
    body: "The biryani at Shop #3 is absolutely amazing! Best campus food I've had.",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    role: "BBA Student",
    body: "Love how easy it is to find good food spots. The ratings are super helpful!",
    rating: 4,
  },
  {
    name: "Arif Hossain",
    role: "EEE Student",
    body: "Finally a platform where our voices matter. Shop owners actually respond now!",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "English Student",
    body: "The leaderboard keeps shops on their toes. Quality has improved so much!",
    rating: 5,
  },
  {
    name: "Tanvir Islam",
    role: "SWE Student",
    body: "Great UI and smooth experience. Makes reviewing food fun and rewarding.",
    rating: 4,
  },
  {
    name: "Sadia Rahman",
    role: "Pharmacy Student",
    body: "I check reviews before every meal now. Saved me from bad food many times!",
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
    <figure className="relative w-72 shrink-0 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <figcaption className="text-sm font-semibold text-gray-900">
            {name}
          </figcaption>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <div className="mt-2 flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      <blockquote className="mt-2 text-sm text-gray-600 leading-relaxed">
        {body}
      </blockquote>
    </figure>
  );
}

const features = [
  {
    icon: Star,
    title: "Rate & Review",
    description:
      "Share honest experiences by rating food shops from 1 to 5 stars with detailed reviews.",
  },
  {
    icon: Trophy,
    title: "Live Leaderboard",
    description:
      "See which shops top the rankings based on genuine student reviews in real-time.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "DIU students get verified status. Your collective voice shapes campus dining.",
  },
  {
    icon: MessageSquare,
    title: "Owner Responses",
    description:
      "Shop owners can reply to reviews, address concerns, and build trust.",
  },
  {
    icon: Utensils,
    title: "Menu Discovery",
    description:
      "Browse complete menus with prices before visiting. No more surprises!",
  },
  {
    icon: ShieldCheck,
    title: "Verified Reviews",
    description:
      "Only authenticated DIU students can review, ensuring genuine feedback.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up with your DIU credentials as a student or shop owner.",
    icon: Users,
  },
  {
    step: "02",
    title: "Explore Campus Shops",
    description: "Browse all food shops, menus, and read reviews from fellow students.",
    icon: Search,
  },
  {
    step: "03",
    title: "Rate & Review",
    description: "Share your dining experience with star ratings and detailed feedback.",
    icon: Star,
  },
  {
    step: "04",
    title: "Help the Community",
    description: "Your reviews help students find great food and shops improve quality.",
    icon: Heart,
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
            ? "border-b border-gray-100 bg-white/90 backdrop-blur-lg shadow-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 shadow-md shadow-green-600/30">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className={`text-lg font-bold transition-colors duration-300 ${scrolled ? "text-gray-900" : "text-white drop-shadow"}`}>
              DIU Food Review
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className={`transition-colors duration-300 ${scrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-white/90 hover:text-white hover:bg-white/15"}`}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/30"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative">
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24">
          {/* DIU Campus background image — focused on upper campus */}
          <img
            src="https://tbsgraduates.net/wp-content/uploads/2024/06/359031962_662709532556337_8513791220280977836_n.jpg"
            alt="DIU Campus"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 20%" }}
          />
          {/* Base dark overlay — lighter so image breathes */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Gradient overlay: deep top, transparent mid, fades to white at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-white/95" />
          {/* Green brand tint — top only */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/35 via-transparent to-transparent" />
          {/* Bottom white feather to blend into Features section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-[5]" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 pt-28 pb-20 sm:pt-36 sm:pb-32 text-center">
            <BlurFade delay={0.1} inView>
              <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <AnimatedShinyText className="text-sm font-medium text-white/90">
                  Now live for DIU Campus
                </AnimatedShinyText>
              </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <h1
                className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
              >
                Discover the Best
                <br />
                <span className="text-green-400 drop-shadow-[0_2px_12px_rgba(74,222,128,0.5)]">Campus Food</span>{" "}
                <WordRotate
                  className="inline-block text-green-400 drop-shadow-[0_2px_12px_rgba(74,222,128,0.5)]"
                  motionProps={{
                    initial: { opacity: 0, scale: 0.85 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.85 },
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  words={["Reviews", "Ratings", "Menus", "Shops"]}
                />
              </h1>
            </BlurFade>

            <BlurFade delay={0.4} inView>
              <p
                className="mx-auto mt-6 max-w-2xl text-lg text-white/85 leading-relaxed sm:text-xl"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
              >
                The ultimate food review platform for Daffodil International
                University. Rate, review, and discover the best campus eats — powered by
                students, for students.
              </p>
            </BlurFade>

            <BlurFade delay={0.6} inView>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="h-12 gap-2 rounded-xl bg-green-500 px-8 text-base text-white shadow-xl shadow-green-700/40 hover:bg-green-400 hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-200 border border-green-400/50"
                  >
                    Start Reviewing
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 gap-2 rounded-xl px-8 text-base border-white/50 text-white bg-white/15 backdrop-blur-md hover:border-white/70 hover:bg-white/25 transition-all duration-200 shadow-lg shadow-black/10"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </BlurFade>

            {/* Stats — glass pill */}
            <BlurFade delay={0.8} inView>
              <div className="mx-auto mt-16 w-fit">
                <div className="flex items-center gap-0 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl shadow-black/20 overflow-hidden">
                  {[
                    { value: 500, label: "Active Reviews" },
                    { value: 50, label: "Campus Shops" },
                    { value: 1000, label: "DIU Students" },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`px-6 py-4 sm:px-10 sm:py-5 text-center ${i < 2 ? "border-r border-white/20" : ""}`}
                    >
                      <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                        <NumberTicker value={stat.value} />+
                      </div>
                      <p className="mt-0.5 text-xs text-white/70 sm:text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Everything you need to find great food
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Built specifically for the DIU community with powerful tools to
                rate, discover, and improve campus dining.
              </p>
            </div>
          </BlurFade>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <BlurFade key={feature.title} delay={0.1 + i * 0.1} inView className="h-full">
                <MagicCard
                  className="p-6 rounded-2xl h-full"
                  gradientColor="#dcfce7"
                  gradientFrom="#16a34a"
                  gradientTo="#22c55e"
                  gradientOpacity={0.15}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Get started in minutes
              </h2>
            </div>
          </BlurFade>

          {/* Steps grid — 1 col mobile, 2 col tablet, 4 col desktop */}
          <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
            {steps.map((step, i) => (
              <BlurFade key={step.step} delay={0.15 + i * 0.15} inView>
                <div className="relative flex flex-col items-center text-center px-4">

                  {/* Horizontal connector — only between cards on desktop */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-8 left-[calc(50%+2rem)] right-0 hidden h-px bg-gradient-to-r from-green-300 to-green-100 lg:block" />
                  )}

                  {/* Icon badge */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-green-100 border border-green-100">
                    <step.icon className="h-7 w-7 text-green-600" />
                    <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white ring-2 ring-gray-50">
                      {step.step}
                    </span>
                  </div>

                  {/* Vertical connector — mobile only, between stacked steps */}
                  {i < steps.length - 1 && (
                    <div className="mt-4 h-8 w-px bg-gradient-to-b from-green-300 to-transparent sm:hidden" />
                  )}

                  <h3 className="mt-5 text-base font-semibold text-gray-900 leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Reviews Marquee */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
                Testimonials
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Loved by <SparklesText className="inline text-3xl sm:text-4xl" colors={{ first: "#16a34a", second: "#22c55e" }}>students</SparklesText>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-600">
                See what DIU students are saying about their campus food experience.
              </p>
            </div>
          </BlurFade>

          <div className="relative mt-12">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-white" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-white" />
            <Marquee pauseOnHover className="[--duration:35s]">
              {reviews.map((review) => (
                <ReviewCard key={review.name} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="mt-4 [--duration:35s]">
              {reviews.map((review) => (
                <ReviewCard key={review.name + "-2"} {...review} />
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <BlurFade delay={0.1} inView>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-700 p-10 sm:p-16 text-center">
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
                numCircles={5}
                className="opacity-30 [&_div]:border-white/20 [&_div]:bg-white/5"
              />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Ready to find your next meal?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-green-100 text-lg">
                  Join the DIU food community today and help fellow students discover amazing campus food.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-12 gap-2 rounded-xl bg-white px-8 text-base text-green-700 font-semibold shadow-lg hover:bg-green-50 transition-all"
                    >
                      Create Free Account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-12 gap-2 rounded-xl px-8 text-base border-white/30 text-white hover:bg-white/10 transition-all"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                {/* SVG Decorative Elements */}
                <div className="pointer-events-none absolute -top-10 -left-10 opacity-10">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="8 8">
                      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1.5" strokeDasharray="4 6">
                      <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="15s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-10">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="8 8">
                      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="-360 100 100" dur="25s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="1" strokeDasharray="6 4">
                      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="18s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <ChefHat className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                DIU Food Review
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
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
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DIU Food Review & Rating System. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Daffodil International University
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
