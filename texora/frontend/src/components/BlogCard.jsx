import { motion } from 'framer-motion'
import { HiOutlineUser, HiOutlineChatAlt2, HiArrowRight } from 'react-icons/hi'
import { fadeUp, viewportOnce } from '../utils/animations'

export default function BlogCard({ post, index = 0 }) {
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-navy to-navy-light">
        <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-700 bg-[radial-gradient(circle_at_30%_30%,rgba(242,194,48,0.5),transparent_60%)]" />
        <div className="absolute top-4 left-4 bg-gold text-navy rounded-lg px-3 py-1.5 text-center leading-tight">
          <div className="font-bold text-sm">{post.day}</div>
          <div className="text-[10px] font-semibold">{post.month}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-navy/50 mb-3">
          <span className="flex items-center gap-1"><HiOutlineUser /> By {post.author}</span>
          <span className="flex items-center gap-1"><HiOutlineChatAlt2 /> ({post.comments}) Comments</span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-navy mb-3 group-hover:text-gold-dark transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-navy/55 mb-4 leading-relaxed">{post.excerpt}</p>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-navy group-hover:text-gold-dark transition-colors">
          READ MORE <HiArrowRight />
        </span>
      </div>
    </motion.article>
  )
}
