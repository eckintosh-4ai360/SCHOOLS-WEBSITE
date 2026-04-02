import ContactForm from "@/components/public/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Eckintosh Academy",
  description: "Get in touch with Eckintosh Academy. Send us a message, visit our campus, or give us a call.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient pb-16 pt-24 md:pt-28">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-[#e8a020] font-semibold uppercase tracking-widest text-sm mb-4">We'd Love to Hear From You</p>
          <h1 className="mb-6 font-serif text-4xl font-bold text-white sm:text-5xl md:text-6xl">Get In Touch</h1>
          <p className="text-lg text-blue-100 md:text-xl">Have a question? We're here to help. Send us a message and we'll respond as soon as possible.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-[#f8fafc]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <p className="section-label">Contact Details</p>
              <h2 className="text-3xl font-bold text-[#1a4f8a] font-serif">Find Us Here</h2>
            </div>

            {[
              { icon: MapPin, title: "Our Address", value: process.env.NEXT_PUBLIC_SCHOOL_ADDRESS || "123 Education Blvd, Springfield, ST 12345" },
              { icon: Phone, title: "Phone Number", value: process.env.NEXT_PUBLIC_SCHOOL_PHONE || "+1 (555) 234-5678" },
              { icon: Mail, title: "Email Address", value: process.env.NEXT_PUBLIC_SCHOOL_EMAIL || "info@eckintoshacademy.edu" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="card p-5 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1a4f8a]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{title}</p>
                  <p className="text-slate-700 font-medium text-sm">{value}</p>
                </div>
              </div>
            ))}

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#1a4f8a]" />
                </div>
                <p className="font-semibold text-[#1a4f8a]">Office Hours</p>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">7:30AM – 5:00PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="font-medium">8:00AM – 12:00PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-red-500">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-5 sm:p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#1a4f8a] mb-2 font-serif">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-6">Fill out the form and our team will get back to you within 24 hours.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-72 sm:h-80 md:h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.03660986826!2d-74.30933357912837!3d40.6974881493959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="School Location Map"
        />
      </section>
    </>
  );
}
