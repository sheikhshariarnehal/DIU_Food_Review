import Link from "next/link";
import { ChefHat, Star, Trophy, Users, ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Marquee } from "@/components/ui/marquee";
import { MagicCard } from "@/components/ui/magic-card";

const testimonials = [
  { name: "Rafiq H.", text: "Best campus food guide ever! Found my new favorite spot.", rating: 5 },
  { name: "Nusrat A.", text: "Love how easy it is to leave reviews. Great UI!", rating: 5 },
  { name: "Tanvir M.", text: "The leaderboard keeps shops on their toes. Quality improved!", rating: 4 },
  { name: "Fatema K.", text: "Finally know which shops are worth trying before standing in line.", rating: 5 },
  { name: "Arif S.", text: "As a shop owner, the feedback helps me improve every day.", rating: 4 },
  { name: "Mitu R.", text: "Clean design, super fast. Best app for DIU students!", rating: 5 },
];

function TestimonialCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <div className="w-64 shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: rating }, (_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      <p className="mt-2 text-xs font-semibold text-gray-900">{name}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <DotPattern className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-32 text-center">
          <BlurFade delay={0.1}>
            <div className="flex justify-center mb-6">
              <div className="group relative w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center transition-transform hover:scale-110">
                <ChefHat className="w-9 h-9 text-green-600" />
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="flex justify-center mb-4">
              <AnimatedShinyText className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-1 text-sm text-green-700">
                <Star className="w-3.5 h-3.5 mr-1.5 fill-green-500 text-green-500" />
                Trusted by DIU Students
              </AnimatedShinyText>
            </div>
          </BlurFade>

          <BlurFade delay={0.3}>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              DIU Food Review
            </h1>
          </BlurFade>

          <BlurFade delay={0.4}>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover, rate, and review the best food shops at Daffodil International University campus.
              Your honest feedback helps everyone make better food choices!
            </p>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <ShimmerButton
                  className="shadow-lg"
                  shimmerColor="#16a34a"
                  shimmerSize="0.08em"
                  background="rgba(22, 163, 74, 1)"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-white">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </ShimmerButton>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-medium rounded-full border-2 border-green-600 hover:bg-green-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </BlurFade>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <BlurFade delay={0.1} inView>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
          </BlurFade>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Star, title: "Rate & Review", desc: "Share your honest experience by rating food shops from 1 to 5 stars and writing detailed reviews." },
              { icon: Trophy, title: "Leaderboard", desc: "See which shops top the rankings based on genuine student reviews. Top shops earn recognition." },
              { icon: Users, title: "Community Driven", desc: "DIU students get verified status. Shop owners can respond to reviews and manage their menus." },
            ].map((feature, i) => (
              <BlurFade key={feature.title} delay={0.2 + i * 0.1} inView>
                <MagicCard
                  className="rounded-xl"
                  gradientColor="#dcfce7"
                  gradientFrom="#16a34a"
                  gradientTo="#22c55e"
                  gradientOpacity={0.15}
                >
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-12 overflow-hidden">
        <BlurFade delay={0.1} inView>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What Students Say
          </h2>
        </BlurFade>
        <Marquee pauseOnHover className="[--duration:30s]">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} DIU Food Review & Rating System. All rights reserved.</p>
          <p className="mt-1">Daffodil International University</p>
        </div>
      </footer>
    </div>
  );
}
