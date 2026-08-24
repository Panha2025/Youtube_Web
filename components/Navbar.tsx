"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Mail, Search, X } from "lucide-react";
import { FacebookLogo, YouTubeLogo } from "./BrandIcons";

export function Navbar() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "https://www.youtube.com/@POLIKASIM";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Add your email in .env.local";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/92 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-6 py-5 lg:px-12">
        <Link className="shrink-0 leading-none" href="/">
          <span className="block font-serif text-3xl font-black italic tracking-tight text-black sm:text-4xl">
            Polika
          </span>
          <span className="ml-1 block text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
            Cook Inspire Enjoy
          </span>
        </Link>

        <div className="hidden items-center gap-9 text-sm font-bold text-stone-700 lg:flex">
          <Link className="relative text-black after:absolute after:-bottom-4 after:left-0 after:h-0.5 after:w-full after:bg-[#f8b62d]" href="/">
            Home
          </Link>
          <a className="transition hover:text-[#f04b23]" href="#recipes">
            Recipes
          </a>
          <a className="inline-flex items-center gap-1 transition hover:text-[#f04b23]" href="#all-recipes">
            Categories
            <ChevronDown className="h-3.5 w-3.5" />
          </a>
          <a className="transition hover:text-[#f04b23]" href="#about">About Chef</a>
          <a className="transition hover:text-[#f04b23]" href="#recipes">Blog</a>
          <button
            className="transition hover:text-[#f04b23]"
            onClick={() => setIsContactOpen((current) => !current)}
            type="button"
          >
            Contact
          </button>
        </div>

        <div className="hidden min-w-[260px] max-w-xs flex-1 items-center rounded-full border border-stone-200 px-4 py-3 xl:flex">
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            placeholder="Search recipes..."
            readOnly
          />
          <Search className="h-5 w-5 text-stone-500" />
        </div>

        <div className="flex items-center gap-3 text-black">
          <a
            aria-label="YouTube"
            className="smooth-motion grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md"
            href={youtubeUrl}
            rel="noreferrer"
            target="_blank"
          >
            <YouTubeLogo className="h-7 w-7" />
          </a>
          <a
            aria-label="Facebook"
            className="smooth-motion hidden h-11 w-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md sm:grid"
            href={facebookUrl}
            rel="noreferrer"
            target="_blank"
          >
            <FacebookLogo className="h-7 w-7" />
          </a>
        </div>
      </nav>

      {isContactOpen && (
        <div className="animate-rise-in border-t border-stone-100 bg-white px-6 py-4 shadow-lg shadow-stone-200/60 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f04b23]">Contact Us</p>
              <h2 className="mt-1 text-2xl font-black text-black">Reach Polika</h2>
            </div>

            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:justify-center">
              <ContactItem icon={<YouTubeLogo className="h-6 w-6" />} label="YouTube" value="@POLIKASIM" href={youtubeUrl} />
              <ContactItem icon={<FacebookLogo className="h-6 w-6" />} label="Facebook" value="Polika" href={facebookUrl} />
              <ContactItem icon={<Mail className="h-5 w-5" />} label="Email" value={contactEmail} href={contactEmail.includes("@") ? `mailto:${contactEmail}` : undefined} />
            </div>

            <button
              className="smooth-motion inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-200 px-5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:border-black"
              onClick={() => setIsContactOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="smooth-motion inline-flex min-h-12 items-center gap-3 rounded-2xl border border-stone-200 bg-[#fbfaf8] px-4 text-sm font-black text-stone-800 transition hover:-translate-y-0.5 hover:border-[#f04b23] hover:bg-white">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-stone-200">{icon}</span>
      <span>
        <span className="mr-1 text-stone-500">{label}:</span>
        {value}
      </span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} rel="noreferrer" target={href.startsWith("mailto:") ? undefined : "_blank"}>
      {content}
    </a>
  );
}
