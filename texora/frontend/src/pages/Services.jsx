import { GiWeight, GiClothes, GiSewingMachine, GiCottonFlower, GiFactory } from 'react-icons/gi'
import PageHero from '../components/PageHero'
import SectionBadge from '../components/SectionBadge'
import ServiceCard from '../components/ServiceCard'

const services = [
  { icon: GiWeight, title: 'Woven Texoras', desc: 'High-quality woven fabrics produced with precision looms and premium raw materials.' },
  { icon: GiSewingMachine, title: 'Knit Warp & Circular', desc: 'Advanced knitting technology delivering stretch, comfort and durability.' },
  { icon: GiClothes, title: 'Garment Manufacturing', desc: 'End-to-end apparel manufacturing from pattern design to finished product.' },
  { icon: GiCottonFlower, title: 'Natural Fiber Texoras', desc: 'Sustainably sourced natural fiber fabrics for eco-conscious brands.' },
  // { icon: GiThreadSpool, title: 'Dyeing Techniques', desc: 'Modern dyeing processes ensuring vibrant, long-lasting color consistency.' },
  { icon: GiFactory, title: 'Design Partnerships', desc: 'Collaborative design studios bridging trend research with production.' },
]

export default function Services() {
  return (
    <>
      <PageHero subtitle="What We Offer" title="Our Services" crumb="Services" />
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Services</SectionBadge>
            <h2 className="section-title mt-5">Complete Texora & Garment Manufacturing Solutions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => <ServiceCard key={s.title} index={i} {...s} />)}
          </div>
        </div>
      </section>
    </>
  )
}
