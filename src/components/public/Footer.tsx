import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/news", label: "Latest News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const schoolName = process.env.NEXT_PUBLIC_SCHOOL_NAME || "Eckintosh Academy";

  return (
    <footer className="bg-[#0f3460] text-white">
      {/* Top bar */}
      <div className="bg-[#e8a020] py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm font-medium text-white">
          <span>🎓 Admissions Open for 2024/2025 Academic Year</span>
          <Link href="/admissions" className="underline hover:no-underline">
            Apply Now →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e8a020] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg font-serif">{schoolName}</span>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed mb-5">
            {process.env.NEXT_PUBLIC_SCHOOL_TAGLINE || "Empowering Minds, Shaping Futures"}. Dedicated to academic excellence since 1985.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e8a020] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4 font-serif">Quick Links</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-blue-200 hover:text-[#e8a020] text-sm transition-colors flex items-center gap-1"
                >
                  <span className="text-[#e8a020]">›</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-lg mb-4 font-serif">Contact Us</h3>
          <ul className="space-y-3 text-sm text-blue-200">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#e8a020] mt-0.5 shrink-0" />
              <span>{process.env.NEXT_PUBLIC_SCHOOL_ADDRESS || "123 Education Blvd, Springfield"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#e8a020] shrink-0" />
              <a href={`tel:${process.env.NEXT_PUBLIC_SCHOOL_PHONE}`} className="hover:text-white transition-colors">
                {process.env.NEXT_PUBLIC_SCHOOL_PHONE || "+1 (555) 234-5678"}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#e8a020] shrink-0" />
              <a href={`mailto:${process.env.NEXT_PUBLIC_SCHOOL_EMAIL}`} className="hover:text-white transition-colors">
                {process.env.NEXT_PUBLIC_SCHOOL_EMAIL || "info@eckintoshacademy.edu"}
              </a>
            </li>
          </ul>
        </div>

        {/* Office Hours */}
        <div>
          <h3 className="font-bold text-lg mb-4 font-serif">Office Hours</h3>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="flex justify-between"><span>Monday – Friday</span><span className="text-white">7:30AM – 5PM</span></li>
            <li className="flex justify-between"><span>Saturday</span><span className="text-white">8AM – 12PM</span></li>
            <li className="flex justify-between"><span>Sunday</span><span className="text-red-400">Closed</span></li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20">
            <p className="text-xs text-blue-200 mb-1">Emergency Contact</p>
            <p className="font-semibold text-sm">+1 (555) 911-0000</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-300">
          <p>© {year} {schoolName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/admin/login" className="hover:text-[#e8a020] transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
