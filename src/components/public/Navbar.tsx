"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent py-4"
          : "border-b border-slate-200/70 bg-white/95 py-2 shadow-md backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a4f8a] shadow-md transition-colors group-hover:bg-[#0f3460]">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p
              className={`text-lg font-bold leading-tight transition-colors ${
                isTransparent ? "text-white text-shadow" : "text-[#1a4f8a]"
              }`}
            >
              {process.env.NEXT_PUBLIC_SCHOOL_NAME || "Eckintosh Academy"}
            </p>
            <p className={`text-xs transition-colors ${isTransparent ? "text-blue-100" : "text-slate-500"}`}>
              Excellence in Education
            </p>
          </div>
        </Link>

        <div className="ml-6 hidden items-center gap-3 lg:flex">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    pathname === link.href
                      ? isTransparent
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-[#1a4f8a]"
                      : isTransparent
                      ? "text-blue-100 hover:bg-white/10 hover:text-white"
                      : "text-slate-700 hover:bg-blue-50 hover:text-[#1a4f8a]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/admissions" className="btn-accent px-5 py-2.5 text-sm">
            Apply Now
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className={`ml-auto shrink-0 rounded-lg p-2 transition-colors lg:hidden ${
            isTransparent ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
          }`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-slate-100 bg-white shadow-xl lg:hidden">
          <ul className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-blue-50 text-[#1a4f8a]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#1a4f8a]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/admissions" className="btn-accent w-full justify-center text-sm">
                Apply Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
