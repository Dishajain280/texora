import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import SectionBadge from '../components/SectionBadge'
import BlogCard from '../components/BlogCard'
import api from '../utils/api'

const fallbackPosts = [
  { _id: '1', day: '21', month: 'July', author: 'Admin', comments: '03', title: 'Smart Texoras: How Technology is Transforming Fabrics', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { _id: '2', day: '21', month: 'July', author: 'Admin', comments: '03', title: 'The Future of Sustainable Fabrics in Global Fashion', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { _id: '3', day: '21', month: 'July', author: 'Admin', comments: '03', title: 'Behind the Loom: Inside Modern Garment Manufacturing', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { _id: '4', day: '18', month: 'June', author: 'Admin', comments: '05', title: 'Eco Dyeing Techniques Every Brand Should Know', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { _id: '5', day: '10', month: 'June', author: 'Admin', comments: '02', title: 'Why Quality Inspection Teams Matter in Textiles', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
  { _id: '6', day: '02', month: 'June', author: 'Admin', comments: '07', title: 'Natural Fibers vs Synthetic: A Manufacturing Guide', excerpt: 'Our mission is to empower businesses of all sizes to thrive in an ever-changing industry.' },
]

export default function Blog() {
  const [posts, setPosts] = useState(fallbackPosts)

  useEffect(() => {
    api.get('/blogs').then((res) => {
      if (res.data?.length) setPosts(res.data)
    }).catch(() => {})
  }, [])

  return (
    <>
      <PageHero subtitle="News & Articles" title="Our Blog" crumb="Blog" />
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge>Our Blog & Article</SectionBadge>
            <h2 className="section-title mt-5">Latest Insights & Industry Trends</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => <BlogCard key={p._id || i} post={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  )
}
