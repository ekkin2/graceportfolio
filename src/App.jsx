import { useState, useEffect } from 'react'

const PHRASES = [
  'product design engineer',
  'hobbyist artist <3',
  'mechanical engineer',
  'plush maker',
  'lobster lover',
  'makerspace enthusiast',
  'professional napper zzz',
]

const PROJECTS = [
  { name: 'honeycomb', color: '#e8c47a' },
  { name: 'silversmithing', color: '#b0b0b0' },
  { name: 'lobster', color: '#e85d4a' },
  { name: 'flow', color: '#7ab5e8' },
  { name: 'lotus', color: '#e8a0c4' },
  { name: 'coming soon', color: '#c4c4c4' },
]

function TypingEffect() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = PHRASES[phraseIdx]
    let timeout
    if (!deleting && charIdx < phrase.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), 100)
    } else if (!deleting && charIdx === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), 50)
    } else if (deleting && charIdx === 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setPhraseIdx(i => (i + 1) % PHRASES.length)
      }, 500)
    }
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phraseIdx])

  return (
    <span className="typed">{PHRASES[phraseIdx].slice(0, charIdx)}<span className="cursor" /></span>
  )
}

function Card({ name, color }) {
  return (
    <div className="card">
      <div className="card-placeholder" style={{ background: color }} />
      <div className="card-overlay">
        <div className="card-label">{name}</div>
      </div>
    </div>
  )
}

export default function App() {
  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })

  return (
    <>
      <nav>
        <span className="nav-logo">._.</span>
        <span className="nav-name">GRACE PAN</span>
        <div className="nav-links">
          <a href="#work">work</a>
          <a href="#quickstart">quickstart</a>
          <a href="#play">play</a>
          <a href="#about">about</a>
        </div>
      </nav>

      <section className="hero">
        <h1 className="hero-title">
          Hello! I'm Grace, a <TypingEffect />
        </h1>
        <p className="hero-sub">I love making functional and aesthetic products that provide simple joys :0</p>
        <div className="scroll-hint" onClick={scrollDown}>
          <div className="chevron" />
        </div>
      </section>

      <section className="projects" id="work">
        <div className="project-grid">
          {PROJECTS.map(p => <Card key={p.name} {...p} />)}
        </div>
        <div className="more-wrap">
          <button className="more-btn">more</button>
        </div>
      </section>

      <footer>
        <div className="footer-left">
          <span>&copy; GRACE PAN 2026</span>
          <span>designer + engineer</span>
        </div>
        <div className="footer-right">
          <a href="#">LINKEDIN</a>
          <a href="#">EMAIL</a>
          <a href="#">RESUME</a>
        </div>
      </footer>
    </>
  )
}
