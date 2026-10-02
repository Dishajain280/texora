import PageHero from '../components/PageHero'
import SectionBadge from '../components/SectionBadge'
import ProjectCard from '../components/ProjectCard'

const projects = [
  { title: 'Luxury Fabric Collection', tag: 'Fashion' },
  { title: 'Denim Manufacturing Line', tag: 'Denim' },
  { title: 'Bridal Couture Textile', tag: 'Couture' },
  { title: 'Sustainable Cotton Yarn', tag: 'Eco' },
  { title: 'Knitwear Production', tag: 'Knitwear' },
  { title: 'Technical Textile R&D', tag: 'Research' },
  { title: 'Home Furnishing Fabrics', tag: 'Interior' },
  { title: 'Sportswear Collection', tag: 'Activewear' },
  { title: 'Export Ready Packaging', tag: 'Logistics' },
]

export default function Projects() {
  return (
    <>
      <PageHero subtitle="Our Work" title="Our Projects" crumb="Projects" />
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Projects</SectionBadge>
            <h2 className="section-title mt-5">Showcasing Our Finest Manufacturing Work</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => <ProjectCard key={p.title} index={i} {...p} />)}
          </div>
        </div>
      </section>
    </>
  )
}
