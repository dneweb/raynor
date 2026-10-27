import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowRight, ChevronDown, X, ShoppingBag, Sparkles, Check } from 'lucide-react'
import { useAudioExperience } from '../../hooks/useAudioExperience'

// Safe lag-smoothing: clamp jumps when returning from background tabs without timeline breakdown
gsap.ticker.lagSmoothing(500, 33)

// Sunburst Icon matching reference header logo
const SunburstIcon: React.FC<{ size?: number }> = ({ size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="14" fill="#141824" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24
        const isLong = i % 2 === 0
        const r1 = 20
        const r2 = isLong ? 46 : 36
        const rad = (angle * Math.PI) / 180
        const x1 = 50 + r1 * Math.cos(rad)
        const y1 = 50 + r1 * Math.sin(rad)
        const x2 = 50 + r2 * Math.cos(rad)
        const y2 = 50 + r2 * Math.sin(rad)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#141824"
            strokeWidth={isLong ? '3' : '2'}
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Layer Refs for GSAP Parallax & Floating Animations
  const textFirRef = useRef<HTMLDivElement>(null)
  const textStRef = useRef<HTMLDivElement>(null)
  const textLiRef = useRef<HTMLDivElement>(null)
  const textGhtRef = useRef<HTMLDivElement>(null)
  const centerpieceRef = useRef<HTMLDivElement>(null)
  const orangeRef = useRef<HTMLDivElement>(null)
  const lemonRef = useRef<HTMLDivElement>(null)
  const leafOnRRef = useRef<HTMLDivElement>(null)
  const twoLeafsRef = useRef<HTMLDivElement>(null)
  const amberChunkRef = useRef<HTMLDivElement>(null)
  const amberChunk2Ref = useRef<HTMLDivElement>(null)
  const amberDropletRef = useRef<HTMLDivElement>(null)
  const bergamotRef = useRef<HTMLDivElement>(null)
  const muskRef = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)
  const bokehRef = useRef<HTMLDivElement>(null)

  const { playSpritz, playVelvetClick, playGoldChime } = useAudioExperience()
  const [activeNote, setActiveNote] = useState<string>('Amber')
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<number>(1)

  const notesList = [
    { name: 'Bergamot' },
    { name: 'Orange' },
    { name: 'Mandarin' },
    { name: 'Lemon' },
    { name: 'Amber' },
    { name: 'Musk' },
  ]

  // Keyboard navigation for accessible drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false)
        setIsCartOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Centerpiece Stage Zero-G idle floating
      gsap.to(centerpieceRef.current, {
        y: '-=9',
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // 2. Contact-anchored micro-breathing (organic wind motion)
      gsap.to(orangeRef.current, {
        rotation: '+=0.8',
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.2,
      })

      gsap.to(lemonRef.current, {
        rotation: '-=0.7',
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      })

      gsap.to(leafOnRRef.current, {
        rotation: '+=1.2',
        duration: 4.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.1,
      })

      gsap.to(bergamotRef.current, {
        rotation: '+=0.9',
        duration: 4.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4,
      })

      gsap.to(amberDropletRef.current, {
        y: '-=5',
        x: '+=2',
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3,
      })

      gsap.to(twoLeafsRef.current, {
        rotation: '-=0.9',
        duration: 5.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.6,
      })

      gsap.to(amberChunk2Ref.current, {
        rotation: '+=0.6',
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      })

      gsap.to(muskRef.current, {
        rotation: '-=0.5',
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.7,
      })
    }, containerRef)

    // Smooth Mouse Movement Parallax (Desktop / Fine pointers)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    let rafId = 0
    let latestMouseX = 0
    let latestMouseY = 0

    const dispatchParallax = () => {
      const { innerWidth: width, innerHeight: height } = window
      const normX = (latestMouseX / width - 0.5) * 2
      const normY = (latestMouseY / height - 0.5) * 2

      // DEPTH PLANE 1: BOTANICAL LAYER (far plane)
      if (centerpieceRef.current) {
        gsap.to(centerpieceRef.current, {
          x: normX * 8,
          y: normY * 6,
          rotationY: normX * 4,
          rotationX: -normY * 3,
          duration: 1.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      // DEPTH PLANE 2: BOTTLE LAYER (near plane)
      if (bottleRef.current) {
        gsap.to(bottleRef.current, {
          x: normX * 22,
          y: normY * 16,
          rotationY: normX * 6,
          rotationX: -normY * 5,
          filter: `drop-shadow(${-normX * 18}px ${38 - normY * 12}px 52px rgba(10, 20, 45, 0.42))`,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      // BACKGROUND: Typography counter-drift
      ;[textFirRef, textStRef, textLiRef, textGhtRef].forEach(({ current: el }) => {
        if (el) {
          gsap.to(el, {
            x: -normX * 8,
            y: -normY * 6,
            duration: 1.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      })

      rafId = 0
    }

    const handleMouseMove = (e: MouseEvent) => {
      latestMouseX = e.clientX
      latestMouseY = e.clientY
      if (rafId === 0) {
        rafId = requestAnimationFrame(dispatchParallax)
      }
    }

    if (isFinePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
      ctx.revert()
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // BOTANICAL BURST ENTRANCE ANIMATION & TAB-VISIBILITY GUARDIAN
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const botanicals = [
      { ref: orangeRef,       x: 80,   y: 0,    delay: 0.00 }, // W
      { ref: lemonRef,        x: -80,  y: -40,  delay: 0.06 }, // E-SE
      { ref: leafOnRRef,      x: 60,   y: 80,   delay: 0.03 }, // NW
      { ref: twoLeafsRef,     x: 70,   y: -50,  delay: 0.09 }, // SW
      { ref: amberChunk2Ref,  x: -70,  y: 70,   delay: 0.02 }, // NE
      { ref: bergamotRef,     x: -80,  y: 40,   delay: 0.07 }, // E-NE
      { ref: muskRef,         x: -50,  y: -60,  delay: 0.11 }, // SE
      { ref: amberChunkRef,   x: 20,   y: -80,  delay: 0.05 }, // S
      { ref: amberDropletRef, x: -30,  y: 60,   delay: 0.04 }, // center-right
    ]

    const showAllInstantly = () => {
      botanicals.forEach(({ ref }) => {
        if (ref.current) {
          gsap.set(ref.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            force3D: true,
            clearProps: 'opacity,scale,x,y',
          })
        }
      })
    }

    // 1. STATEFUL CHECK: If loader already finished (e.g. tab restored or re-render),
    // NEVER hide botanicals! Show them instantly and exit.
    const isLoaderAlreadyDone =
      window.__RAYNOR_LOADER_DONE__ ||
      document.documentElement.getAttribute('data-loader-done') === 'true'

    if (isLoaderAlreadyDone) {
      showAllInstantly()
      return
    }

    // 2. Set initial hidden state only for initial first-time load
    botanicals.forEach(({ ref }) => {
      if (ref.current) {
        gsap.set(ref.current, { opacity: 0, scale: 0.4, force3D: true })
      }
    })

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      const handler = () => showAllInstantly()
      window.addEventListener('raynor:loader-done', handler, { once: true })
      return () => window.removeEventListener('raynor:loader-done', handler)
    }

    const burstCtxRef = { current: null as gsap.Context | null }
    let hasRevealed = false

    const handleLoaderDone = () => {
      if (hasRevealed) return
      hasRevealed = true

      burstCtxRef.current = gsap.context(() => {
        const tl = gsap.timeline()

        botanicals.forEach(({ ref, x, y, delay }) => {
          if (!ref.current) return
          tl.fromTo(
            ref.current,
            {
              opacity: 0,
              scale: 0.4,
              x,
              y,
              force3D: true,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 1.1,
              ease: 'power3.out',
              force3D: true,
              overwrite: 'auto',
              clearProps: 'x,y,scale,opacity',
            },
            delay
          )
        })
      })
    }

    window.addEventListener('raynor:loader-done', handleLoaderDone, { once: true })

    // 3. Fallback Safety Guard: If after 4.2s the event was missed (e.g. background tab),
    // automatically trigger reveal so botanicals are guaranteed never to stay hidden
    const safetyTimer = setTimeout(() => {
      if (!hasRevealed) {
        handleLoaderDone()
      }
    }, 4200)

    // 4. Tab Visibility Guardian: When switching back to this tab, verify botanicals are visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const isDone =
          window.__RAYNOR_LOADER_DONE__ ||
          document.documentElement.getAttribute('data-loader-done') === 'true'
        if (isDone || hasRevealed) {
          showAllInstantly()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('raynor:loader-done', handleLoaderDone)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(safetyTimer)
      burstCtxRef.current?.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="hero-container">
      {/* ========================================================
          LAYER 0: BACKGROUND PLATE (hero.webp) — STATIC, NO PARALLAX
          ======================================================== */}
      <div className="hero-bg-plate" />

      {/* ========================================================
          LAYER 1: TOP HEADER NAVIGATION (3-Column Symmetrical Grid)
          ======================================================== */}
      <header className="hero-header">
        {/* Left Slot: Desktop Nav / Mobile Toggle Trigger */}
        <div className="hero-header-left">
          <button
            className="hero-mobile-toggle-btn"
            onClick={() => {
              setIsDrawerOpen(true)
              playVelvetClick()
            }}
            aria-label="Open Navigation Menu"
          >
            <div className="hero-mobile-toggle-icon">
              <span />
              <span />
              <span />
            </div>
          </button>

          <nav className="hero-nav-desktop" aria-label="Main Navigation">
            <a href="#home" className="hero-nav-link hero-nav-link-active">
              HOME
            </a>
            <a href="#collection" className="hero-nav-link">
              COLLECTION
            </a>
            <a href="#our-story" className="hero-nav-link">
              OUR STORY
            </a>
            <a href="#journal" className="hero-nav-link">
              JOURNAL
            </a>
          </nav>
        </div>

        {/* Center Slot: Brand Logo */}
        <a href="#home" className="hero-logo" aria-label="RAYNOR — The Essence of Luxury">
          <img
            src="/images/header-logo.webp"
            alt="RAYNOR — The Essence of Luxury"
            className="hero-logo-img"
          />
        </a>

        {/* Right Slot: Actions */}
        <div className="hero-header-actions">
          <button
            className="hero-action-btn hero-search-btn"
            onClick={playVelvetClick}
            aria-label="Search Fragrances"
          >
            SEARCH
          </button>

          <button
            className="hero-action-btn hero-cart-btn"
            onClick={() => {
              setIsCartOpen(true)
              playGoldChime()
            }}
            aria-label={`Shopping Bag (${cartCount} items)`}
          >
            <ShoppingBag size={14} />
            <span>CART ({cartCount})</span>
          </button>

          <span className="hero-header-divider" />

          <button
            className="hero-menu-toggle"
            onClick={() => {
              setIsDrawerOpen(true)
              playVelvetClick()
            }}
            aria-label="Open Navigation Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ========================================================
          LAYER 2: BIG TYPOGRAPHY ("FIRST LIGHT" & "EAU DE PARFUM")
          ======================================================== */}
      <div className="hero-eau-de-parfum">EAU DE PARFUM</div>
      {/* Desktop split words for 3D mouse parallax */}
      <div ref={textFirRef} className="hero-title-word hero-text-fir">
        FIR
      </div>
      <div ref={textStRef} className="hero-title-word hero-text-st">
        ST
      </div>
      <div ref={textLiRef} className="hero-title-word hero-text-li">
        LI
      </div>
      <div ref={textGhtRef} className="hero-title-word hero-text-ght">
        GHT
      </div>

      {/* Mobile unified typography: perfectly centered words matching Image 1 */}
      <div className="hero-title-mobile" aria-hidden="true">
        <div className="hero-title-word hero-title-mobile-first">FIRST</div>
        <div className="hero-title-word hero-title-mobile-light">LIGHT</div>
      </div>

      {/* ========================================================
          CENTERPIECE SCULPTURE STAGE (UNIFIED 3D STAGE)
          ======================================================== */}
      <div className="hero-centerpiece-anchor">
        <div ref={centerpieceRef} className="hero-centerpiece-stage">
          {/* Layer 3A: Two Leaves (Southwest Burst) */}
          <div ref={twoLeafsRef} className="hero-stage-item hero-two-leafs">
            <img src="/images/perfume/first_light/two_leafs.webp" alt="Citrus Botanical Leaves" />
          </div>

          {/* Layer 3B: Orange Slice (West Burst) */}
          <div
            ref={orangeRef}
            className={`hero-stage-item hero-orange ${activeNote === 'Orange' ? 'active-highlight' : ''}`}
          >
            <img src="/images/perfume/first_light/orange.webp" alt="Sun-Drenched Bergamot Orange" />
          </div>

          {/* Layer 3C: Single Leaf (Northwest Burst) */}
          <div ref={leafOnRRef} className="hero-stage-item hero-leaf-on-r">
            <img src="/images/perfume/first_light/leaf.webp" alt="Glossy Citrus Leaf" />
          </div>

          {/* Layer 3D: Amber Droplet Splash */}
          <div
            ref={amberDropletRef}
            className={`hero-stage-item hero-amber-droplet ${activeNote === 'Amber' ? 'active-highlight' : ''}`}
          >
            <img src="/images/perfume/first_light/amber_droplet.webp" alt="Amber Essence Droplet" />
          </div>

          {/* Layer 3E: Secondary Splash Accents */}
          <div className="hero-stage-item hero-amber-droplet-sub-1">
            <img src="/images/perfume/first_light/amber_droplet.webp" alt="Amber Droplet Accent" />
          </div>
          <div className="hero-stage-item hero-amber-droplet-sub-2">
            <img src="/images/perfume/first_light/amber_droplet.webp" alt="Amber Droplet Accent" />
          </div>

          {/* Layer 3F: Top Amber Chunk (Northeast Burst) */}
          <div
            ref={amberChunk2Ref}
            className={`hero-stage-item hero-amber-chunk-top ${activeNote === 'Amber' ? 'active-highlight' : ''}`}
          >
            <img src="/images/perfume/first_light/amber_chunk2.webp" alt="Golden Amber Crystal" />
          </div>

          {/* Layer 3G: Bergamot Citrus Slice (East-Northeast Burst) */}
          <div
            ref={bergamotRef}
            className={`hero-stage-item hero-bergamot ${activeNote === 'Bergamot' ? 'active-highlight' : ''}`}
          >
            <img src="/images/perfume/first_light/bergamot.webp" alt="Fresh Italian Bergamot" />
          </div>

          {/* Layer 3H: Lemon Slice (East-Southeast Burst) */}
          <div
            ref={lemonRef}
            className={`hero-stage-item hero-lemon ${activeNote === 'Lemon' ? 'active-highlight' : ''}`}
          >
            <img src="/images/perfume/first_light/lemon.webp" alt="Mediterranean Lemon Slice" />
          </div>

          {/* Layer 3I: White Cashmere Musk (Southeast Burst) */}
          <div
            ref={muskRef}
            className={`hero-stage-item hero-musk ${activeNote === 'Musk' ? 'active-highlight' : ''}`}
          >
            <img
              src="/images/perfume/first_light/musk_flower.webp"
              alt="White Ambrette Musk Blossom"
              className="hero-musk-blossom"
            />
          </div>

          {/* Layer 3J: Amber Chunk at Bottom (South-Southwest Burst) */}
          <div
            ref={amberChunkRef}
            className={`hero-stage-item hero-amber-chunk-bottom ${activeNote === 'Amber' ? 'active-highlight' : ''}`}
          >
            <img src="/images/perfume/first_light/amber_chunk.webp" alt="Warm Amber Resin Chunk" />
          </div>

          {/* ========================================================
              FOREGROUND CENTERPIECE FLACON (STRICTLY IN FRONT)
              ======================================================== */}
          <div
            ref={bottleRef}
            className="hero-bottle"
            onClick={playSpritz}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                playSpritz()
              }
            }}
            aria-label="Experience First Light spray atomizer"
            title="Click to experience First Light"
          >
            <img src="/images/perfume/first_light/bottle.webp" alt="RAYNOR First Light Flacon" />
          </div>
        </div>
      </div>

      {/* ========================================================
          LAYER 6: FOREGROUND BOKEH & ATMOSPHERE
          ======================================================== */}
      <div ref={bokehRef} className="hero-bokeh" />

      {/* ========================================================
          LAYER 7: LEFT NARRATIVE STORY BLOCK & CTA
          ======================================================== */}
      <div className="hero-narrative-block">
        <div className="hero-narrative-dash" />
        <h4 className="hero-narrative-title">
          A RADIANT
          <br />
          BEGINNING
        </h4>
        <p className="hero-narrative-p">
          A vibrant blend of citrus and warm amber, First Light captures the energy of new beginnings.
        </p>

        <button
          className="hero-cta-btn"
          onClick={() => {
            playSpritz()
            playGoldChime()
            setIsCartOpen(true)
          }}
          aria-label="Explore First Light and order"
        >
          <span>EXPLORE FIRST LIGHT</span>
          <span className="hero-cta-icon">
            <ArrowRight size={11} color="#ffffff" />
          </span>
        </button>
      </div>

      {/* ========================================================
          LAYER 8: RIGHT OLFACTORY NOTES TRACKER ("THE NOTES")
          All dots are identical pure black dots
          ======================================================== */}
      <div className="hero-notes-tracker">
        <span className="hero-notes-label">
          THE
          <br />
          NOTES
        </span>

        <div className="hero-notes-stepper">
          <div className="hero-notes-line" />

          {notesList.map((note) => {
            const isSelected = activeNote === note.name
            return (
              <div
                key={note.name}
                onClick={() => {
                  setActiveNote(note.name)
                  playVelvetClick()
                }}
                className="hero-notes-tracker-item"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveNote(note.name)
                    playVelvetClick()
                  }
                }}
                aria-label={`Select ${note.name} note`}
              >
                <div className="hero-note-dot" />
                <span
                  className="hero-note-name"
                  style={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#12141a' : '#454a55',
                  }}
                >
                  {note.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================
          LAYER 9: SCROLL INDICATOR
          ======================================================== */}
      <div className="hero-scroll-indicator">
        <span className="hero-scroll-text">SCROLL</span>
        <div className="hero-scroll-circle">
          <ChevronDown size={11} color="#333742" />
        </div>
      </div>

      {/* ========================================================
          LAYER 10: LUXURY MOBILE SLIDE-OUT DRAWER
          ======================================================== */}
      <div
        className={`hero-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      />
      <aside
        className={`hero-drawer-panel ${isDrawerOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation and Notes Explorer"
      >
        <div>
          <div className="hero-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SunburstIcon size={22} />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  letterSpacing: '0.24em',
                  fontWeight: 600,
                  color: '#121622',
                }}
              >
                RAYNOR
              </span>
            </div>
            <button
              className="hero-drawer-close"
              onClick={() => {
                setIsDrawerOpen(false)
                playVelvetClick()
              }}
              aria-label="Close Navigation Menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="hero-drawer-nav">
            <a
              href="#home"
              className="hero-drawer-link"
              onClick={() => setIsDrawerOpen(false)}
            >
              Home
            </a>
            <a
              href="#collection"
              className="hero-drawer-link"
              onClick={() => setIsDrawerOpen(false)}
            >
              Collection
            </a>
            <a
              href="#our-story"
              className="hero-drawer-link"
              onClick={() => setIsDrawerOpen(false)}
            >
              Our Story
            </a>
            <a
              href="#journal"
              className="hero-drawer-link"
              onClick={() => setIsDrawerOpen(false)}
            >
              Journal
            </a>
          </nav>

          <div className="hero-drawer-notes-section">
            <div className="hero-drawer-notes-title">EXPLORE THE NOTES</div>
            <div className="hero-drawer-notes-chips">
              {notesList.map((note) => {
                const isSelected = activeNote === note.name
                return (
                  <button
                    key={note.name}
                    className={`hero-drawer-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveNote(note.name)
                      playVelvetClick()
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#ffffff' : '#12141a',
                        display: 'inline-block',
                      }}
                    />
                    <span>{note.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="hero-drawer-product-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#d48b28" />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.5625rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#d48b28',
                textTransform: 'uppercase',
              }}
            >
              SIGNATURE RELEASE
            </span>
          </div>
          <div className="hero-drawer-product-title">First Light Eau de Parfum</div>
          <p className="hero-drawer-product-desc">
            Sun-drenched Mediterranean citrus, crisp Italian bergamot & warm solar amber crystal.
          </p>
          <div className="hero-drawer-product-action">
            <span className="hero-drawer-price">$285.00</span>
            <button
              className="hero-drawer-add-btn"
              onClick={() => {
                setCartCount((prev) => prev + 1)
                setIsDrawerOpen(false)
                setIsCartOpen(true)
                playGoldChime()
              }}
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          LAYER 11: LUXURY SHOPPING BAG DRAWER
          ======================================================== */}
      <div
        className={`hero-drawer-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden={!isCartOpen}
      />
      <aside
        className={`hero-cart-drawer-panel ${isCartOpen ? 'open' : ''}`}
        aria-label="Shopping Bag Drawer"
      >
        <div>
          <div className="hero-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={18} color="#121622" />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  color: '#121622',
                }}
              >
                YOUR BAG ({cartCount})
              </span>
            </div>
            <button
              className="hero-drawer-close"
              onClick={() => {
                setIsCartOpen(false)
                playVelvetClick()
              }}
              aria-label="Close Shopping Bag"
            >
              <X size={18} />
            </button>
          </div>

          <div className="hero-cart-item">
            <div className="hero-cart-img-wrap">
              <img src="/images/perfume/first_light/bottle.webp" alt="First Light Flacon" />
            </div>
            <div className="hero-cart-item-info">
              <div className="hero-cart-item-name">First Light Eau de Parfum</div>
              <div className="hero-cart-item-meta">100ml / 3.4 FL. OZ. • Signature Flacon</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Check size={12} color="#385e3c" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: '#385e3c' }}>
                  In Stock • Hand-Numbered
                </span>
              </div>
              <div className="hero-cart-item-price">$285.00</div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(212, 139, 40, 0.08)',
              borderRadius: '12px',
              margin: '20px 0',
              border: '1px solid rgba(212, 139, 40, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={13} color="#d48b28" />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#8c5912',
                }}
              >
                COMPLIMENTARY LUXURY GIFTS
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                color: '#555b68',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Includes 2ml discovery vials of Solstice Blanche & Noir Velours, plus signature gift wrapping.
            </p>
          </div>
        </div>

        <div className="hero-cart-footer">
          <div className="hero-cart-row">
            <span>Subtotal</span>
            <span>$285.00</span>
          </div>
          <div className="hero-cart-row">
            <span>Worldwide Express Shipping</span>
            <span style={{ color: '#385e3c', fontWeight: 600 }}>COMPLIMENTARY</span>
          </div>
          <div className="hero-cart-row hero-cart-total-row">
            <span>Total</span>
            <span>$285.00</span>
          </div>

          <button
            className="hero-checkout-btn"
            onClick={() => {
              playGoldChime()
              alert('Thank you for choosing Raynor Haute Parfumerie. Checkout is connecting...')
            }}
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight size={13} color="#ffffff" />
          </button>

          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.5625rem',
              color: '#7e8391',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            Guaranteed Authenticity • Carbon-Neutral Climate Delivery
          </span>
        </div>
      </aside>
    </div>
  )
}
