import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/all-prompts", label: "All Prompts" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { icon: <FaTwitter />, href: "#", label: "Twitter" },
  { icon: <FaGithub />, href: "#", label: "GitHub" },
  { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
  { icon: <FaEnvelope />, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mt-auto">
      <div className="container mx-auto px-4 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Prompt-Bazaar</h3>
            <p className="text-white/80 mb-4">
              Discover powerful prompts, boost productivity, and unlock creativity through automation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white/80 hover:text-white transition-colors text-xl"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
          <p>&copy; {new Date().getFullYear()} Prompt-Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
