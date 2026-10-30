import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { X, ShoppingBag, Sparkles, Check, ArrowRight } from 'lucide-react'
import { HeroSlide } from './HeroSlide'

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

const perfumesData = [
  {
    id: 'first_light' as const,
    name: 'FIRST LIGHT',
    badge: 'SLIDE 01 / 02 • FIRST LIGHT',
    title: (
      <>
        A RADIANT
        <br />
        BEGINNING
      </>
    ),
    description:
      'A vibrant blend of citrus and warm amber, First Light captures the energy of new beginnings.',
    cta: 'EXPLORE FIRST LIGHT',
    bottleImg: '/images/perfume/first_light/bottle.webp',
    flaconTitle: 'First Light Eau de Parfum',
    flaconDesc:
      'Sun-drenched Mediterranean citrus, crisp Italian bergamot & warm solar amber crystal.',
    notes: [
      { name: 'Bergamot' },
      { name: 'Orange' },
      { name: 'Mandarin' },
      { name: 'Lemon' },
      { name: 'Amber' },
      { name: 'Musk' },
    ],
  },
  {
    id: 'after_glow' as const,
    name: 'AFTER GLOW',
    badge: 'SLIDE 02 / 02 • AFTER GLOW',
    title: (
      <>
        WARM EMBRACE
        <br />
        OF DUSK
      </>
    ),
    description:
      'An intoxicating warmth of rosewood, rich patchouli, and spiced cinnamon bathed in golden amber.',
    cta: 'EXPLORE AFTER GLOW',
    bottleImg: '/images/perfume/after_glow/bottle.webp',
    flaconTitle: 'After Glow Eau de Parfum',
    flaconDesc:
      'Spiced Ceylon cinnamon, velvety herbal sage, smoky rosewood & rich patchouli in solar amber.',
    notes: [
      { name: 'Lemon' },
      { name: 'Sage' },
      { name: 'Rosewood' },
      { name: 'Amber' },
      { name: 'Patchouli' },
      { name: 'Cinnamon' },
    ],
  },
]

export const HeroSection: React.FC = () => {
  const heroContainerRef = useRef<HTMLDivElement>(null)
  const movingTrackRef = useRef<HTMLDivElement>(null)

  // Sub-wrappers for depth parallax between typography and bottle stage
  const slide1StageWrapRef = useRef<HTMLDivElement>(null)
  const slide1TitleWrapRef = useRef<HTMLDivElement>(null)
  const slide2StageWrapRef = useRef<HTMLDivElement>(null)
  const slide2TitleWrapRef = useRef<HTMLDivElement>(null)

  // State
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const currentSlideRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)

  const [activeNote, setActiveNote] = useState<string>('Amber')
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<number>(1)
  const [drawerActiveNote, setDrawerActiveNote] = useState<string>('Amber')

  const currentPerfume = perfumesData[currentSlide]
  const notesList = currentPerfume.notes

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

  // ─────────────────────────────────────────────────────────────────────────
  // FAST HORIZONTAL ON-SCROLL SLIDE SWITCHING
  // Animates ONLY the name "FIRST LIGHT" / "AFTER GLOW" and the bottle + floating elements
  // ─────────────────────────────────────────────────────────────────────────
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current || targetIndex === currentSlideRef.current) return
      isAnimatingRef.current = true
      currentSlideRef.current = targetIndex
      setCurrentSlide(targetIndex)

      // Ensure active note is relevant to the target perfume
      const targetPerfumeNotes = perfumesData[targetIndex].notes.map((n) => n.name)
      if (!targetPerfumeNotes.includes(activeNote)) {
        setActiveNote('Amber')
      }

      const targetX = targetIndex === 0 ? 0 : -window.innerWidth

      const tl = gsap.timeline({
        defaults: { duration: 0.62, ease: 'power2.inOut' },
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })

      // 1. Fast horizontal slide of moving track (typography + centerpiece stage)
      tl.to(
        movingTrackRef.current,
        {
          x: targetX,
        },
        0
      )

      // 2. Multi-plane depth parallax: bottle & floating elements move with slight offset
      if (targetIndex === 1) {
        if (slide1StageWrapRef.current) {
          tl.to(slide1StageWrapRef.current, { x: -85 }, 0)
        }
        if (slide2StageWrapRef.current) {
          tl.fromTo(slide2StageWrapRef.current, { x: 85 }, { x: 0 }, 0)
        }
        if (slide1TitleWrapRef.current) {
          tl.to(slide1TitleWrapRef.current, { x: -40 }, 0)
        }
        if (slide2TitleWrapRef.current) {
          tl.fromTo(slide2TitleWrapRef.current, { x: 40 }, { x: 0 }, 0)
        }
      } else {
        if (slide2StageWrapRef.current) {
          tl.to(slide2StageWrapRef.current, { x: 85 }, 0)
        }
        if (slide1StageWrapRef.current) {
          tl.fromTo(slide1StageWrapRef.current, { x: -85 }, { x: 0 }, 0)
        }
        if (slide2TitleWrapRef.current) {
          tl.to(slide2TitleWrapRef.current, { x: 40 }, 0)
        }
        if (slide1TitleWrapRef.current) {
          tl.fromTo(slide1TitleWrapRef.current, { x: -40 }, { x: 0 }, 0)
        }
      }
    },
    [activeNote]
  )

  // Responsive alignment on resize
  useEffect(() => {
    const handleResize = () => {
      if (movingTrackRef.current) {
        gsap.set(movingTrackRef.current, {
          x: currentSlideRef.current === 1 ? -window.innerWidth : 0,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // FULL-SCREEN SLIDE SCROLL NAVIGATION (ZERO DEAD BLOCK)
  // The hero section is 100vh locked. Scrolling down on First Light completes
  // the hero carousel by switching to After Glow, with zero vertical page drag.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let accumulatedDelta = 0
    let resetTimer: ReturnType<typeof setTimeout> | null = null

    const handleWheel = (e: WheelEvent) => {
      // Prevent browser from scrolling away or dragging page into any dead block
      e.preventDefault()

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      accumulatedDelta += delta

      if (resetTimer) clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        accumulatedDelta = 0
      }, 160)

      // Scrolling down on Slide 0 -> Go to Slide 1 (After Glow)
      if (accumulatedDelta > 16 && currentSlideRef.current === 0) {
        accumulatedDelta = 0
        goToSlide(1)
      }
      // Scrolling up on Slide 1 -> Go to Slide 0 (First Light)
      else if (accumulatedDelta < -16 && currentSlideRef.current === 1) {
        accumulatedDelta = 0
        goToSlide(0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (resetTimer) clearTimeout(resetTimer)
    }
  }, [goToSlide])

  // Mobile touch swipe & drag handling with zero vertical bounce
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let isTracking = false

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      isTracking = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent mobile browser from dragging the hero section away
      if (isTracking && e.cancelable) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTracking) return
      isTracking = false

      const diffX = touchStartX - e.changedTouches[0].clientX
      const diffY = touchStartY - e.changedTouches[0].clientY
      const dominantDelta = Math.abs(diffX) >= Math.abs(diffY) ? diffX : diffY

      // Quick swipe threshold: 20px
      if (dominantDelta > 20 && currentSlideRef.current === 0) {
        goToSlide(1)
      } else if (dominantDelta < -20 && currentSlideRef.current === 1) {
        goToSlide(0)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentSlideRef.current === 0) goToSlide(1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlideRef.current === 1) goToSlide(0)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToSlide])

  return (
    <div
      ref={heroContainerRef}
      className={`hero-container hero-active-slide-${currentSlide}`}
      data-active-slide={currentSlide}
    >
      {/* ========================================================
          LAYER 0: STATIC BACKGROUND PLATE (Shared across slides)
          Does NOT move on scroll
          ======================================================== */}
      <div className="hero-bg-plate" />

      {/* ========================================================
          LAYER 1: STATIC TOP HEADER NAVIGATION
          Does NOT move on scroll
          ======================================================== */}
      <header className="hero-header">
        {/* Left Slot: Desktop Nav / Mobile Toggle Trigger */}
        <div className="hero-header-left">
          <button
            className="hero-mobile-toggle-btn"
            onClick={() => {
              setIsDrawerOpen(true)
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
            aria-label="Search Fragrances"
          >
            SEARCH
          </button>

          <button
            className="hero-action-btn hero-cart-btn"
            onClick={() => {
              setIsCartOpen(true)
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
          LAYERS 2-5: HORIZONTAL MOVING TRACK
          ONLY THE NAME, THE BOTTLE AND THE FLOATING ELEMENTS MOVE
          ======================================================== */}
      <div ref={movingTrackRef} className="hero-moving-track">
        {/* SLIDE 1: FIRST LIGHT */}
        <HeroSlide
          slideIndex={0}
          perfumeId="first_light"
          activeNote={activeNote}
          isActive={currentSlide === 0}
          stageWrapRef={slide1StageWrapRef}
          titleWrapRef={slide1TitleWrapRef}
        />

        {/* SLIDE 2: AFTER GLOW */}
        <HeroSlide
          slideIndex={1}
          perfumeId="after_glow"
          activeNote={activeNote}
          isActive={currentSlide === 1}
          stageWrapRef={slide2StageWrapRef}
          titleWrapRef={slide2TitleWrapRef}
        />
      </div>

      {/* ========================================================
          LAYER 6: STATIC FOREGROUND BOKEH & BLURRED NOTES
          Does NOT move on scroll
          ======================================================== */}
      <div className="hero-bokeh" />

      {/* ========================================================
          LAYER 7: STATIC LEFT NARRATIVE STORY BLOCK & CTA
          Does NOT move on scroll — Updates to active fragrance
          ======================================================== */}
      <div className="hero-narrative-block">
        <div className="hero-narrative-dash" />
        <h4 className="hero-narrative-title">{currentPerfume.title}</h4>
        <p className="hero-narrative-p">{currentPerfume.description}</p>

        <button
          className="hero-cta-btn"
          onClick={() => {
            setIsCartOpen(true)
          }}
          aria-label={`Explore ${currentPerfume.name} and order`}
        >
          <span>{currentPerfume.cta}</span>
          <span className="hero-cta-icon">
            <ArrowRight size={11} color="#ffffff" />
          </span>
        </button>
      </div>

      {/* ========================================================
          LAYER 8: STATIC RIGHT OLFACTORY NOTES TRACKER ("THE NOTES")
          Does NOT move on scroll — Displays active fragrance notes
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
                }}
                className="hero-notes-tracker-item"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveNote(note.name)
                  }
                }}
                aria-label={`Select ${note.name} note`}
              >
                <div
                  className="hero-note-dot"
                  style={{
                    backgroundColor: isSelected ? '#d48b28' : '#12141a',
                    borderColor: isSelected ? '#d48b28' : '#12141a',
                    transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
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
            <div className="hero-drawer-notes-title">
              EXPLORE {currentPerfume.name} NOTES
            </div>
            <div className="hero-drawer-notes-chips">
              {notesList.map((note) => {
                const isSelected = drawerActiveNote === note.name
                return (
                  <button
                    key={note.name}
                    className={`hero-drawer-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setDrawerActiveNote(note.name)
                      setActiveNote(note.name)
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
          <div className="hero-drawer-product-title">{currentPerfume.flaconTitle}</div>
          <p className="hero-drawer-product-desc">{currentPerfume.flaconDesc}</p>
          <div className="hero-drawer-product-action">
            <span className="hero-drawer-price">$285.00</span>
            <button
              className="hero-drawer-add-btn"
              onClick={() => {
                setCartCount((prev) => prev + 1)
                setIsDrawerOpen(false)
                setIsCartOpen(true)
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
              }}
              aria-label="Close Shopping Bag"
            >
              <X size={18} />
            </button>
          </div>

          <div className="hero-cart-item">
            <div className="hero-cart-img-wrap">
              <img src={currentPerfume.bottleImg} alt={`${currentPerfume.name} Flacon`} />
            </div>
            <div className="hero-cart-item-info">
              <div className="hero-cart-item-name">{currentPerfume.flaconTitle}</div>
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
              alert(`Thank you for choosing Raynor Haute Parfumerie. Checkout is connecting with ${currentPerfume.flaconTitle}...`)
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
