import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../utils/animations'

const steps = [
  { num: '01', title: 'Production of Fabric', desc: 'We execute stabilization including reweaving & stitch repair details.' },
  { num: '02', title: 'Exportation Globally', desc: 'Assist collection strategies, storage, application and pest production.' },
  { num: '03', title: 'Improve and Evolve', desc: 'We review the design for enhancements and ongoing improvement.' },
  { num: '04', title: 'Lasting Partnership', desc: 'We build strong client relationships through regular contact and feedback.' },
]

export default function ProcessSteps() {
  return (
    <div className="grid md:grid-cols-4 gap-8 relative">
      {steps.map((s, i) => (
        <motion.div
          key={s.num}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center relative"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-20 h-20 mx-auto rounded-full border-2 border-navy/15 grid place-items-center text-xl font-heading font-bold text-navy bg-white shadow-md relative z-10"
          >
            {s.num}
          </motion.div>
          {i < steps.length - 1 && (
            <span className="hidden md:block absolute top-10 left-[60%] w-full h-px bg-navy/15" />
          )}
          <h4 className="font-heading font-semibold text-navy mt-5 mb-2">{s.title}</h4>
          <p className="text-sm text-navy/55 leading-relaxed px-2">{s.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}
