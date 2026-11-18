'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#041E42] text-slate-300 dark:border-slate-800 dark:bg-[#021229]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <Image
              src="/images/mentorlagbe-full-dark.png"
              alt="MentorLagbe"
              width={175}
              height={46}
              className="h-11 w-auto object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed text-slate-300">
            Smart Tuition & Mentorship Platform connecting verified tutors and
            motivated students across Bangladesh and worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="transition hover:text-[#FF6B00]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/tuitions" className="transition hover:text-[#FF6B00]">
                Browse Tuitions
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition hover:text-[#FF6B00]">
                Pricing / Pro Plans
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="transition hover:text-[#FF6B00]"
              >
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Contact Info
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#FF6B00]" />
              <span>support@mentorlagbe.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#FF6B00]" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-[#FF6B00]" />
              <span>Dhaka & Rajshahi, Bangladesh</span>
            </li>
          </ul>
        </div>

        {/* Socials (নতুন X লোগোসহ) */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Follow Us
          </h3>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-[#FF6B00]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-[#FF6B00]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-[#FF6B00]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}