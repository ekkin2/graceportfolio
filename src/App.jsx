import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import projects from './data/projects.json'
import honeycombData from './data/honeycomb.json'

const PHRASES = [
  'product design engineer', 'hobbyist artist <3', 'mechanical engineer',
  'plush maker', 'lobster lover', 'makerspace enthusiast', 'professional napper zzz',
]

const PROJECT_DATA = { honeycomb: honeycombData }

function TypingEffect() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const phrase = PHRASES[phraseIdx]
    let timeout
    if (!deleting && charIdx < phrase.length) timeout = setTimeout(() => setCharIdx(c => c + 1), 100)
    else if (!deleting && charIdx === phrase.length) timeout = setTimeout(() => setDeleting(true), 2000)
    else if (deleting && charIdx > 0) timeout = setTimeout(() => setCharIdx(c => c - 1), 50)
    else if (deleting && charIdx === 0) timeout = setTimeout(() => { setDeleting(false); setPhraseIdx(i => (i + 1) % PHRASES.length) }, 500)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phraseIdx])
  return <span className="typed">{PHRASES[phraseIdx].slice(0, charIdx)}<span className="cursor" /></span>
}

function Nav() {
  const loc = useLocation()
  const isHome = loc.pathname === '/'
  return (
    <nav>
      {isHome ? (
        <>
          <Link to="/" className="nav-logo">._.</Link>
          <Link to="/" className="nav-name">GRACE PAN</Link>
          <div className="nav-links">
            <a href="#work">work</a><a href="#quickstart">quickstart</a><a href="#play">play</a><a href="#about">about</a>
          </div>
        </>
      ) : (
        <>
          <div className="nav-links">
            <Link to="/">work</Link><a href="#quickstart">quickstart</a><a href="#play">play</a>
          </div>
          <Link to="/" className="nav-name">GRACE PAN</Link>
          <div className="nav-links">
            <a href="#">resume</a><a href="#">linkedin</a><a href="#about">about</a>
          </div>
        </>
      )}
    </nav>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <span>&copy; GRACE PAN 2026</span>
        <span>designer + engineer</span>
      </div>
      <div className="footer-right">
        <a href="#">LINKEDIN</a><a href="#">EMAIL</a><a href="#">RESUME</a>
      </div>
    </footer>
  )
}

function Layout() {
  return <><Nav /><Outlet /><Footer /></>
}

function Card({ id, name, color, image }) {
  const nav = useNavigate()
  const hasPage = !!PROJECT_DATA[id]
  return (
    <div className="card" onClick={() => hasPage && nav(`/${id}`)} style={{ cursor: hasPage ? 'pointer' : 'default' }}>
      {image ? <img className="card-bg" src={image} alt={name} /> : <div className="card-placeholder" style={{ background: color }} />}
      <div className="card-overlay"><div className="card-label">{name}</div></div>
    </div>
  )
}

function HomePage() {
  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  return (
    <>
      <section className="hero">
        <h1 className="hero-title">Hello! I'm Grace, a <TypingEffect /></h1>
        <p className="hero-sub">I love making functional and aesthetic products that provide simple joys :0</p>
        <div className="scroll-hint" onClick={scrollDown}><div className="chevron" /></div>
      </section>
      <section className="projects" id="work">
        <div className="project-grid">
          {projects.map(p => <Card key={p.id} {...p} />)}
        </div>
        <div className="more-wrap"><button className="more-btn">more</button></div>
      </section>
    </>
  )
}

function BodyText({ body }) {
  return (
    <div className="body-text">
      {body.map((block, i) => {
        if (block.p) return <p key={i}>{block.p}</p>
        if (block.bold && !block.text) return <p key={i} className="body-bold">{block.bold}{block.after || ''}</p>
        if (block.ul) return (
          <ul key={i}>
            {block.ul.map((item, j) =>
              <li key={j}>{typeof item === 'string' ? item : <><strong>{item.bold}</strong>{item.text}</>}</li>
            )}
          </ul>
        )
        if (block.ol) return (
          <ol key={i}>
            {block.ol.map((item, j) =>
              <li key={j}>{typeof item === 'string' ? item : <><strong>{item.bold}</strong>{item.text}</>}</li>
            )}
          </ol>
        )
        return null
      })}
    </div>
  )
}

function SectionPill({ number, label }) {
  return <div className="section-pill"><span className="pill-num">{number}</span> | {label}</div>
}

function SectionHeading({ main, accent }) {
  return (
    <h2 className="section-heading">
      <strong>{main}</strong>
      {accent && <>{' '}<span className="light">|</span> <span className="accent">{accent}</span></>}
    </h2>
  )
}

function ImagePlaceholder({ height = 300, label, color = '#f0f0f0', src }) {
  if (src) return (
    <div className="image-placeholder has-img" style={{ height, background: color }}>
      <img src={src} alt={label || ''} />
      {label && <span className="img-label">{label}</span>}
    </div>
  )
  return (
    <div className="image-placeholder" style={{ height, background: color }}>
      {label && <span className="img-label">{label}</span>}
    </div>
  )
}

function ImageGrid({ layout = 'full', count = 1, height = 300, labels = [], alt, src, images }) {
  if (src) return (
    <div className="section-img">
      <img src={src} alt={alt || labels[0] || ''} />
    </div>
  )
  const cols = layout === 'full' ? 1 : layout === '2-col' ? 2 : layout === '3-col' ? 3 : layout === '4-col' ? 4 : 1
  if (images) return (
    <div className={`image-grid image-grid-${cols}`}>
      {images.map((img, i) => (
        <div key={i} className="image-item">
          <img src={img.src} alt={img.label || ''} />
          {img.label && <span className="img-caption">{img.label}</span>}
        </div>
      ))}
    </div>
  )
  return (
    <div className={`image-grid image-grid-${cols}`}>
      {Array.from({ length: count }, (_, i) => (
        <ImagePlaceholder key={i} height={height} label={labels[i] || alt || ''} />
      ))}
    </div>
  )
}

function RelatedProjects({ ids }) {
  const items = ids.map(id => projects.find(p => p.id === id)).filter(Boolean)
  const nav = useNavigate()
  return (
    <div className="related-section">
      <p className="related-title">you might also like :0</p>
      <div className="related-grid">
        {items.map(p => (
          <div key={p.id} className="related-card" onClick={() => PROJECT_DATA[p.id] && nav(`/${p.id}`)}>
            <div className="related-img" style={{ background: p.image ? undefined : (p.color || '#f7f7f7') }}>
              {p.image && <img src={p.image} alt={p.name} />}
            </div>
            <div className="related-info">
              <span className="related-name">{p.name} - {p.subtitle}</span>
              {p.year && <span className="related-year">{p.year}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectPage() {
  const loc = useLocation()
  const projectId = loc.pathname.slice(1)
  const data = PROJECT_DATA[projectId]
  useEffect(() => { window.scrollTo(0, 0) }, [projectId])
  if (!data) return <div style={{ padding: 80, textAlign: 'center' }}>Project not found</div>

  const finalRef = (el) => { if (el) window.__finalSection = el }
  const jumpToFinal = () => window.__finalSection?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="project-page">
      <div className="project-hero" style={{ background: data.heroImage ? `url(${data.heroImage}) center/cover` : data.heroColor }} />
      <div className="project-divider" />

      <div className="project-header">
        <div className="project-header-left">
          <h1 className="project-title">
            <strong>{data.title.main}</strong>
            <span className="light"> | </span>
            <span className="light">{data.title.sub}</span>
          </h1>
          <p className="project-subtitle">{data.subtitle}</p>
          <div className="body-text">
            <p className="body-bold">Skills:</p>
            <ul>{data.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </div>
        <div className="project-header-right">
          <div className="body-text">
            <p className="body-bold">Specs:</p>
            <ul>
              <li>{data.specs.type}</li>
              <li>Duration: {data.specs.duration}</li>
            </ul>
          </div>
          <button className="jump-btn" onClick={jumpToFinal}>Jump to Final</button>
        </div>
      </div>

      <div className="project-sections">
        {data.sections.map((sec, i) => {
          const isFinal = sec.type === 'pill' && sec.number === '03'
          switch (sec.type) {
            case 'pill': return <div key={i} ref={isFinal ? finalRef : undefined}><SectionPill number={sec.number} label={sec.label} /></div>
            case 'heading': return <SectionHeading key={i} main={sec.main} accent={sec.accent} />
            case 'text': return <BodyText key={i} body={sec.body} />
            case 'image': return <ImageGrid key={i} layout={sec.layout} count={sec.count} height={sec.height} labels={sec.labels || []} alt={sec.alt} src={sec.src} images={sec.images} />
            case 'content': {
              const mainIters = sec.right?.images?.filter(img => img.notes) || []
              const sideIter = sec.right?.images?.find(img => !img.notes)
              return (
                <div key={i} className={`two-col-layout ${sec.layout === 'two-col-reverse' ? 'reverse' : ''}`}>
                  <div className="col-left">
                    {sec.left?.body && <BodyText body={sec.left.body} />}
                    {sec.left?.src && <img src={sec.left.src} alt="" className="col-img" />}
                    {sec.left?.images?.map((img, j) => <ImagePlaceholder key={j} height={img.height || 200} label={img.label} />)}
                  </div>
                  <div className="col-right">
                    {sec.right?.body && <BodyText body={sec.right.body} />}
                    {sec.right?.src && <img src={sec.right.src} alt="" className="col-img" />}
                    {mainIters.length > 0 ? (
                      <div className="iter-grid">
                        <div className="iter-main">
                          {mainIters.map((img, j) => (
                            <div key={j} className="proto-iteration">
                              {img.label && <span className="iter-label">{img.label}</span>}
                              <div className="iter-imgs">
                                {img.srcs?.map((s, k) => <img key={k} src={s} alt="" className="iter-img" />)}
                              </div>
                              <div className="iter-notes-col">
                                {img.notes.map((n, k) => <p key={k} style={{ color: n.color }}>{n.text}</p>)}
                              </div>
                            </div>
                          ))}
                        </div>
                        {sideIter && (
                          <div className="iter-side">
                            {sideIter.label && <span className="iter-label">{sideIter.label}</span>}
                            {sideIter.srcs?.map((s, k) => <img key={k} src={s} alt="" className="iter-img bordered" />)}
                          </div>
                        )}
                      </div>
                    ) : sec.right?.images?.map((img, j) => (
                      <div key={j} className="proto-iteration">
                        {img.label && <span className="iter-label">{img.label}</span>}
                        <div className="iter-imgs">
                          {img.srcs?.map((s, k) => <img key={k} src={s} alt="" className="iter-img" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            case 'ending': return <p key={i} className="project-ending">{sec.text}</p>
            default: return null
          }
        })}
      </div>

      <RelatedProjects ids={data.relatedProjects} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:projectId" element={<ProjectPage />} />
      </Route>
    </Routes>
  )
}
