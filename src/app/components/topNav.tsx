"use client";

import { useState } from "react";
import Icon from "./icons";

const links = [
  { href: "#about", label: "About" },
  { href: "#generate", label: "Try MatchMuse" },
  { href: "#faq", label: "FAQ" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-rose-200 backdrop-blur-md dark:border-zinc-800 dark:bg-black/70">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          className="text-sm font-semibold tracking-wide hover:opacity-70 transition"
          onClick={closeMenu}
        >
          <Icon lightSrc={"/images/logo.png"} darkSrc={"/images/logo.png"} alt={"logo"} />
          MatchMuse
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:opacity-60 transition">
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`md:hidden border-t border-zinc-200 dark:border-zinc-800 ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}