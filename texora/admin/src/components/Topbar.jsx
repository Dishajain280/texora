export default function Topbar({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-navy/50 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
