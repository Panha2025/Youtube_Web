import { FacebookLogo, YouTubeLogo } from "./BrandIcons";

export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white text-black" id="contact">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <div>
          <p className="font-serif text-3xl font-black italic">Polika</p>
          <p className="mt-1 text-stone-500">Cook Inspire Enjoy</p>
        </div>
        <div className="flex gap-3">
          <a
            aria-label="YouTube channel"
            className="smooth-motion grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md"
            href={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "https://www.youtube.com/@POLIKASIM"}
            rel="noreferrer"
            target="_blank"
          >
            <YouTubeLogo className="h-7 w-7" />
          </a>
          <a
            aria-label="Facebook"
            className="smooth-motion grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md"
            href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/"}
            rel="noreferrer"
            target="_blank"
          >
            <FacebookLogo className="h-7 w-7" />
          </a>
        </div>
      </div>
    </footer>
  );
}
