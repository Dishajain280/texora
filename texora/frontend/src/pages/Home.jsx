import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiOutlinePhone, HiPlay } from 'react-icons/hi'
import { GiWeight, GiClothes, GiSewingMachine, GiCottonFlower } from 'react-icons/gi'
import { fadeUp, slideInLeft, slideInRight, viewportOnce } from '../utils/animations'
import SectionBadge from '../components/SectionBadge'
import ServiceCard from '../components/ServiceCard'
import StatCounter from '../components/StatCounter'
import ProgressBar from '../components/ProgressBar'
import ProcessSteps from '../components/ProcessSteps'
import Testimonials from '../components/Testimonials'
import BlogCard from '../components/BlogCard'
import ProjectCard from '../components/ProjectCard'
import { useEffect, useState } from 'react'
import api from '../utils/api'



const services = [
  { icon: GiWeight, title: 'Woven Texoras', desc: 'We are a leading textile & garment manufacturing company producing high-quality fabrics.' },
  { icon: GiSewingMachine, title: 'Knit Warp & Circular', desc: 'We are a leading textile & garment manufacturing company producing high-quality fabrics.' },
  { icon: GiClothes, title: 'Garment Manufacturing', desc: 'We are a leading textile & garment manufacturing company producing high-quality apparel.' },
  { icon: GiCottonFlower, title: 'Natural Fiber Texoras', desc: 'We are a leading textile & garment manufacturing company producing high-quality fabrics.' },
]

const advantages = [
  { title: 'Skilled Workforce Expertise', desc: 'Decades of hands-on experience across every production line.' },
  { title: 'Unmatched Quality Control', desc: 'Rigorous multi-stage inspection before every shipment.' },
  { title: 'Eco-Friendly Practices', desc: 'Sustainable sourcing and low-impact manufacturing.' },
  { title: 'Innovative Fabric Solutions', desc: 'Constant R&D into new blends and finishing techniques.' },
]

const posts = [
  { day: '21', month: 'July', author: 'Admin', comments: '03', title: 'Smart Texoras: How Technology is Transforming Fabrics', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { day: '21', month: 'July', author: 'Admin', comments: '03', title: 'The Future of Sustainable Fabrics in Global Fashion', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { day: '21', month: 'July', author: 'Admin', comments: '03', title: 'Behind the Loom: Inside Modern Garment Manufacturing', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
]

export default function Home() {
  const [categories, setCategories] = useState([])
const [categoriesLoading, setCategoriesLoading] = useState(true)

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')

      console.log('Categories API Response:', response.data)

      const categoryData = response.data

      const categoryList = Array.isArray(categoryData)
        ? categoryData
        : categoryData?.categories || categoryData?.data || []

      setCategories(categoryList.slice(0, 5))
    } catch (error) {
      console.error('Failed to load categories:', error)
      console.error('Category API Error:', error.response?.data || error.message)
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }

  fetchCategories()
}, [])

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-navy overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(242,194,48,0.18),transparent_50%)]" />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[8%] top-1/3 w-40 h-40 rounded-full bg-gold/10 blur-2xl"
        />
        <div className="container-x relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span variants={fadeUp} initial="hidden" animate="visible" className="section-badge mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> The Future of Fabric Begins Here
            </motion.span>
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Global Perspective <span className="text-gold">Texora</span> Industry
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="text-white/60 max-w-lg mb-8 leading-relaxed">
              In 1999, Texora entered the textile sector with its manufacturing facilities of cotton yarn, combining modern technology with skilled manpower under a unique, inspiring atmosphere.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-5">
              <Link to="/about" className="btn-primary">Explore More <HiArrowRight /></Link>
              <button className="flex items-center gap-3 text-white group">
                <span className="w-12 h-12 rounded-full bg-white/10 grid place-items-center group-hover:bg-gold group-hover:text-navy transition-colors">
                  <HiPlay />
                </span>
                Watch Video
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-navy-light via-navy to-gold/20 relative overflow-hidden shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 border border-dashed border-white/10 rounded-full"
              />
              <div className="absolute inset-0 grid place-items-center">
                <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-32 h-32 rounded-3xl bg-gold/90 grid place-items-center text-navy shadow-xl">
                  <GiSewingMachine size={54} />
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 w-56"
            >
              <p className="text-3xl font-heading font-bold text-navy">350k+</p>
              <p className="text-sm text-navy/50">Project Complete</p>
            </motion.div>
          </motion.div>
        </div>
      </section>



    {/* TOP CATEGORIES */}
<section className="py-24 bg-white">
  <div className="container-x">

    <div className="text-center max-w-2xl mx-auto mb-14">
      <SectionBadge>Our Categories</SectionBadge>

      <h2 className="section-title mt-5">
        Explore Our Top Categories
      </h2>

      <p className="mt-4 text-sm leading-relaxed text-navy/60 sm:text-base">
        Explore our product categories and find the products that match
        your requirements.
      </p>
    </div>

    {categoriesLoading ? (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="aspect-[4/3] animate-pulse rounded-2xl bg-navy/10"
      />
    ))}
  </div>
) : categories.length > 0 ? (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {categories.map((category) => (
      <Link
        key={category._id}
        to={`/products?category=${category._id}`}
        className="group overflow-hidden rounded-2xl border border-navy/10 bg-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="aspect-[4/3] overflow-hidden bg-white">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-navy/40">
              No Image
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 p-4">
          <h3 className="text-sm font-semibold text-navy sm:text-base">
            {category.name}
          </h3>

          <HiArrowRight
            size={18}
            className="shrink-0 text-navy transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </Link>
    ))}
  </div>
) : (
  <div className="rounded-2xl border border-navy/10 bg-soft px-6 py-10 text-center">
    <p className="text-sm text-navy/60">
      No categories available right now.
    </p>
  </div>
)}

  </div>
</section>







      {/* ABOUT */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl h-72 bg-gradient-to-br from-navy to-navy-light mt-10" />
              <div className="rounded-2xl h-72 bg-gradient-to-br from-gold/40 to-navy" />
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-6 py-4 text-center w-max"
            >
              <p className="font-heading font-bold text-navy">100mil+ Satisfied Customers</p>
              <p className="text-xs text-navy/50">In World Wide</p>
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <SectionBadge>About Us</SectionBadge>
            <h2 className="section-title mt-5 mb-5">Where Tradition Meets Innovation In Texora Manufacturing</h2>
            <p className="text-navy/60 leading-relaxed mb-6">
              We are a leading textile & garment manufacturing company dedicated to producing high-quality fabrics and apparel for global brands, with years of expertise and advanced technology.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {['Sustainable Production Practices', 'Professional Quality Inspection Teams', 'Advanced Weaving Technology', 'Experienced Partnership Teams'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-gold/15 text-gold-dark grid place-items-center shrink-0 text-sm">✓</span>
                  <span className="text-sm font-medium text-navy">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/about" className="btn-primary">Explore More <HiArrowRight /></Link>
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full border border-navy/15 grid place-items-center text-navy"><HiOutlinePhone /></span>
                <div>
                  <p className="text-xs text-navy/50">Call Center 24/7</p>
                  <p className="font-semibold text-navy">+1 (212) 578-5758</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-soft">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Services</SectionBadge>
            <h2 className="section-title mt-5">Complete Texora & Garment Manufacturing Solutions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => <ServiceCard key={s.title} index={i} {...s} />)}
          </div>
          <div className="text-center mt-12 flex items-center justify-center gap-4 flex-wrap">
            <span className="text-navy/60 text-sm">Don't hesitate, contact us for better help and services.</span>
            <Link to="/services" className="btn-primary !py-2.5">See All Services <HiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* WHY TRUST US */}
      <section className="py-24 bg-white">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-soft p-6">
              <p className="font-heading font-bold text-navy mb-2">100mil+ Satisfied Customer</p>
              <p className="text-xs text-navy/50">In World Wide</p>
              <div className="h-32 rounded-xl bg-gradient-to-br from-gold/30 to-navy/10 mt-4" />
            </div>
            <div className="rounded-2xl overflow-hidden h-full bg-gradient-to-br from-navy to-navy-light relative min-h-[220px]">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-3xl font-heading font-bold">350k+</p>
                <p className="text-xs text-white/60">Project Complete</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <SectionBadge>Why Global Brands Trust Us</SectionBadge>
            <h2 className="section-title mt-5 mb-5">Why Trust Global Fashion Brands Rely On Our Texora Excellence</h2>
            <p className="text-navy/60 leading-relaxed mb-8">
              We are committed to integrating sustainability, environmental stewardship, and ethical governance into our business. As a leader in technical textiles, we recognize the responsibility we have in reducing our environmental impact and fostering a positive social footprint.
            </p>
            <div className="space-y-6">
              <ProgressBar label="Experienced Professionals" percent={85} />
              <ProgressBar label="Quality Materials Only" percent={90} />
              <ProgressBar label="Eco-Friendly Solutions" percent={70} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {['Access & Diversification', 'Expert Guidance Risk', 'Clear Investment Process', '24/7 Ongoing Support'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-navy">
                  <span className="text-gold-dark">✓</span> {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* VIDEO BANNER */}
      <section className="relative h-[420px] bg-navy overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-navy opacity-90 bg-[repeating-linear-gradient(90deg,rgba(242,194,48,0.08)_0px,rgba(242,194,48,0.08)_2px,transparent_2px,transparent_40px)]" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 w-24 h-24 rounded-full bg-gold grid place-items-center text-navy shadow-2xl"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold"
          />
          <HiPlay size={30} className="relative z-10 ml-1" />
        </motion.button>
        <p className="absolute bottom-8 text-white/70 text-sm uppercase tracking-widest">Intro Video</p>
      </section>

      {/* ADVANTAGES */}
      <section className="py-24 bg-soft">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Advantage</SectionBadge>
            <h2 className="section-title mt-5">Why We Stand Out in the Texora Industry</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <motion.div
                key={a.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-36 bg-gradient-to-br from-navy to-navy-light" />
                <div className="p-5">
                  <h4 className="font-heading font-semibold text-navy mb-2">{a.title}</h4>
                  <p className="text-sm text-navy/55 leading-relaxed">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Projects</SectionBadge>
            <h2 className="section-title mt-5">Showcasing Our Finest Manufacturing Work</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Luxury Fabric Collection', tag: 'Fashion' },
              { title: 'Denim Manufacturing Line', tag: 'Denim' },
              { title: 'Bridal Couture Textile', tag: 'Couture' },
              { title: 'Sustainable Cotton Yarn', tag: 'Eco' },
              { title: 'Knitwear Production', tag: 'Knitwear' },
              { title: 'Technical Textile R&D', tag: 'Research' },
            ].map((p, i) => <ProjectCard key={p.title} index={i} {...p} />)}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-soft">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge>Working Process</SectionBadge>
            <h2 className="section-title mt-5">Texora's Process for Exceptional Results</h2>
          </div>
          <ProcessSteps />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_80%_50%,white,transparent_40%)]" />
        <div className="container-x relative">
          <SectionBadge>Customer Testimonials</SectionBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-5 mb-14 max-w-xl">Comments Regarding The Texora Industry</h2>
          <Testimonials />
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-navy/5">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter end={25} label="Years of Experience" index={0} />
          <StatCounter end={350} suffix="k+" label="Projects Complete" index={1} />
          <StatCounter end={100} suffix="mil+" label="Satisfied Customers" index={2} />
          <StatCounter end={40} suffix="+" label="Countries Served" index={3} />
        </div>
      </section>

      {/* BLOG */}
      <section className="py-24 bg-soft">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Blog & Article</SectionBadge>
            <h2 className="section-title mt-5">Latest Insights & Industry Trends</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => <BlogCard key={p.title} post={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-gold to-gold-dark">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-navy max-w-lg">Ready to Elevate Your Textile & Garment Business?</h3>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-7 py-3.5 rounded-full hover:bg-navy-dark transition-colors">
            Get In Touch <HiArrowRight />
          </Link>
        </div>
      </section>
    </>
  )
}
