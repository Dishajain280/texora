import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiArrowUp } from 'react-icons/hi'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { COMPANY } from '../utils/constants'

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function Footer() {
  return (
    <footer className="relative bg-navy-dark text-white pt-20 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
      <div className="container-x relative grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark grid place-items-center text-navy font-heading font-bold">T</span>
            <span className="font-heading font-bold text-xl">Texora</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Texora improves efficiency and provides a better customer experience with modern textile services available worldwide.
          </p>
          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/15 grid place-items-center hover:bg-gold hover:text-navy hover:border-gold transition-colors">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-gold">Quick Links</h4>
          <ul className="space-y-3 mt-4">
            {['Home', 'About Us', 'Services', 'Projects', 'Contact'].map((item) => (
              <li key={item}>
                <Link to="/" className="text-white/60 hover:text-gold text-sm flex items-center gap-2 transition-colors">
                  <span>→</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-gold">Our Solutions</h4>
          <ul className="space-y-3 mt-4">
            {['Fabric Manufacturing', 'Garment Production', 'Knit & Woven', 'Natural Fibers'].map((item) => (
              <li key={item}>
                <Link to="/services" className="text-white/60 hover:text-gold text-sm flex items-center gap-2 transition-colors">
                  <span>→</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-lg mb-4 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-gold">Contact Info</h4>
          <ul className="space-y-4 mt-4 text-sm text-white/60">
            <li className="flex gap-3"><HiOutlineLocationMarker className="text-gold shrink-0 mt-0.5" /> {COMPANY.address}</li>
            <li className="flex gap-3"><HiOutlinePhone className="text-gold shrink-0 mt-0.5" /> {COMPANY.phone}</li>
            <li className="flex gap-3"><HiOutlineMail className="text-gold shrink-0 mt-0.5" /> {COMPANY.email}</li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Texora. All rights reserved.</p>
        <p className="text-white/40 text-sm">Built with the MERN Stack</p>
      </div>

      <motion.button
        whileHover={{ y: -4 }}
        onClick={scrollTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-gold text-navy grid place-items-center shadow-lg shadow-gold/30 z-40"
        aria-label="Scroll to top"
      >
        <HiArrowUp size={20} />
      </motion.button>
    </footer>
  )
}
