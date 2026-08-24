import { ChefHat, Play, UserRound, Users, Youtube } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white px-6 pb-8 pt-3 lg:px-12">
      <div className="animate-rise-in relative mx-auto min-h-[520px] max-w-[1440px] overflow-hidden rounded-[28px] bg-[#f6f0e7] shadow-sm">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden md:block">
          <div className="animate-drift-bg absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#f6f0e7] via-[#f6f0e7]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f6f0e7] to-transparent" />
        </div>

        <div className="relative grid min-h-[520px] items-center px-8 py-12 sm:px-14 lg:grid-cols-[0.48fr_0.52fr] lg:px-24">
          <div className="max-w-lg">
            <p className="animate-rise-in font-serif text-2xl italic text-[#f04b23] [animation-delay:120ms]">
              Hello! I&apos;m
            </p>
            <div className="animate-rise-in mt-3 flex items-center gap-4 [animation-delay:180ms]">
              <h1 className="font-serif text-6xl font-black leading-none text-black sm:text-7xl lg:text-8xl">
                Polika
              </h1>
              <ChefHat className="hidden h-12 w-12 text-[#f04b23] sm:block" />
            </div>
            <div className="mt-6 h-1 w-32 rounded-full bg-[#f8b62d]" />
            <h2 className="mt-7 text-xl font-black text-black">Welcome to my kitchen!</h2>
            <p className="mt-4 max-w-sm text-base leading-7 text-stone-600">
              Easy homemade recipes from my YouTube channel.
            </p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <a
                className="smooth-motion inline-flex items-center justify-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#f04b23]"
                href="#recipes"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-black">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                Watch Latest Video
              </a>
              <a
                className="smooth-motion inline-flex items-center justify-center gap-3 rounded-full border border-stone-400 bg-white/70 px-6 py-3 text-sm font-black text-black transition hover:-translate-y-1 hover:border-black"
                href="#about"
              >
                <UserRound className="h-5 w-5" />
                About Me
              </a>
            </div>
            <div className="mt-9 grid max-w-md grid-cols-3 gap-4 text-black">
              <div className="animate-float-soft">
                <ChefHat className="mb-2 h-6 w-6" />
                <p className="font-black">300+</p>
                <p className="text-xs text-stone-500">Recipes</p>
              </div>
              <div className="animate-float-soft [animation-delay:450ms]">
                <Users className="mb-2 h-6 w-6" />
                <p className="font-black">250K+</p>
                <p className="text-xs text-stone-500">Subscribers</p>
              </div>
              <div className="animate-float-soft [animation-delay:900ms]">
                <Youtube className="mb-2 h-6 w-6" />
                <p className="font-black">500+</p>
                <p className="text-xs text-stone-500">Videos</p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none relative mt-10 min-h-[280px] md:hidden">
            <div className="absolute inset-0 rounded-[28px] bg-[url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85')] bg-cover bg-center shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
