import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import SectionBadge from '../components/SectionBadge'
import StatCounter from '../components/StatCounter'
import ProgressBar from '../components/ProgressBar'
import ProcessSteps from '../components/ProcessSteps'
import { slideInLeft, slideInRight, viewportOnce } from '../utils/animations'

export default function About() {
  return (
    <>
      <PageHero subtitle="Get To Know Us" title="About Texora Industry" crumb="About" />

      <section className="py-24 bg-white">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl h-80 bg-gradient-to-br from-navy to-navy-light mt-8" />
            <div className="rounded-2xl h-80 bg-gradient-to-br from-gold/40 to-navy" />
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <SectionBadge>Our Story</SectionBadge>
            <h2 className="section-title mt-5 mb-5">Since 1999, Weaving Quality Into Every Thread</h2>
            <p className="text-navy/60 leading-relaxed mb-6">
              Texora entered the textile sector with manufacturing facilities for cotton yarn, combining modern technology with skilled manpower under a unique, inspiring atmosphere. Over two decades later, we remain committed to craftsmanship and innovation.
            </p>
            <p className="text-navy/60 leading-relaxed">
              We are a leading textile & garment manufacturing company dedicated to producing high-quality fabrics and apparel for global brands, with years of expertise and advanced technology.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-soft">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter end={25} label="Years of Experience" index={0} />
          <StatCounter end={350} suffix="k+" label="Projects Complete" index={1} />
          <StatCounter end={100} suffix="mil+" label="Satisfied Customers" index={2} />
          <StatCounter end={40} suffix="+" label="Countries Served" index={3} />
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionBadge>Our Mission</SectionBadge>
            <h2 className="section-title mt-5 mb-6">Committed To Sustainability & Ethical Governance</h2>
            <div className="space-y-6">
              <ProgressBar label="Experienced Professionals" percent={85} />
              <ProgressBar label="Quality Materials Only" percent={90} />
              <ProgressBar label="Eco-Friendly Solutions" percent={70} />
            </div>
          </div>
          <div className="rounded-2xl h-96 bg-gradient-to-br from-navy via-navy-light to-gold/20" />
        </div>
      </section>

      <section className="py-24 bg-soft">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge>Working Process</SectionBadge>
            <h2 className="section-title mt-5">How We Bring Every Project To Life</h2>
          </div>
          <ProcessSteps />
        </div>
      </section>
    </>
  )
}
