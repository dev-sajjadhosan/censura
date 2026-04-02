import { Film, Github, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Explore", href: "/explore" },
    { label: "Watchlist", href: "/profile/watchlist" },
    { label: "Subscription", href: "/subscription" },
    { label: "Collections", href: "/profile/collections" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "DMCA", href: "/dmca" },
  ],
};

const socials = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background text-foreground">

      {/* Main footer grid */}
      <div className="px-8 md:px-12 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Brand col — takes 2 cols */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Film size={16} className="text-orange-500" />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight">
              Censura
            </span>
          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            A community-driven media review platform. Every rating, every
            review — held to a higher standard.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2 mt-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
              >
                <s.icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group} className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {group}
            </p>
            <ul className="flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-8 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Censura. All rights reserved.
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            All systems operational
          </span>
        </div>
      </div>

    </footer>
  );
}