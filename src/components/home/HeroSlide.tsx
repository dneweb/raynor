import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface HeroSlideProps {
  slideIndex: number
  perfumeId: 'first_light' | 'after_glow'
  activeNote: string
  isActive?: boolean
  stageWrapRef?: React.RefObject<HTMLDivElement | null>
  titleWrapRef?: React.RefObject<HTMLDivElement | null>
}

export const HeroSlide: React.FC<HeroSlideProps> = ({
  slideIndex,
  perfumeId,
  activeNote,
  isActive = slideIndex === 0,
  stageWrapRef,
  titleWrapRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Typography Refs for 3D mouse parallax
  const textFirRef = useRef<HTMLDivElement>(null)
  const textStRef = useRef<HTMLDivElement>(null)
  const textLiRef = useRef<HTMLDivElement>(null)
  const textGhtRef = useRef<HTMLDivElement>(null)

  // Centerpiece & Bottle
  const centerpieceRef = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)

  // First Light Botanical Refs
  const orangeRef = useRef<HTMLDivElement>(null)
  const lemonRef = useRef<HTMLDivElement>(null)
  const leafOnRRef = useRef<HTMLDivElement>(null)
  const twoLeafsRef = useRef<HTMLDivElement>(null)
  const amberChunkRef = useRef<HTMLDivElement>(null)
  const bergamotRef = useRef<HTMLDivElement>(null)
  const muskRef = useRef<HTMLDivElement>(null)

  // After Glow Botanical Refs
  const cinnamonRef = useRef<HTMLDivElement>(null)
  const sageRef = useRef<HTMLDivElement>(null)
  const patchouliRef = useRef<HTMLDivElement>(null)
  const rosewoodRef = useRef<HTMLDivElement>(null)

  // Guard flags and animation context refs for entrance burst & parallax synchronization
  const isBurstingRef = useRef(false)
  const hasRevealedRef = useRef(false)
  const burstCtxRef = useRef<gsap.Context | null>(null)
  const isActiveRef = useRef(isActive)

  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

  // ─────────────────────────────────────────────────────────────────────────
  // ZERO-G FLOATING IDLE ANIMATIONS
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Centerpiece Stage Zero-G floating
      gsap.to(centerpieceRef.current, {
        y: '-=9',
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // 2. Shared / First Light Elements
      if (perfumeId === 'first_light') {
        gsap.to(leafOnRRef.current, {
          rotation: '+=1.0',
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.1,
        })

        gsap.to(orangeRef.current, {
          rotation: '-=0.8',
          duration: 5.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.2,
        })

        gsap.to(twoLeafsRef.current, {
          rotation: '+=0.9',
          duration: 5.0,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        })

        gsap.to(bergamotRef.current, {
          rotation: '+=0.8',
          duration: 4.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.3,
        })

        gsap.to(lemonRef.current, {
          rotation: '-=0.7',
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.4,
        })

        gsap.to(muskRef.current, {
          rotation: '+=0.6',
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.6,
        })

        gsap.to(amberChunkRef.current, {
          rotation: '-=0.6',
          duration: 4.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.7,
        })
      } else {
        // After Glow Elements Idle Floating
        gsap.to(sageRef.current, {
          rotation: '+=1.0',
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.2,
        })

        gsap.to(lemonRef.current, {
          rotation: '-=0.8',
          duration: 5.0,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.4,
        })

        gsap.to(cinnamonRef.current, {
          rotation: '+=0.9',
          duration: 5.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.1,
        })

        gsap.to(rosewoodRef.current, {
          rotation: '-=0.7',
          duration: 4.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.3,
        })

        gsap.to(patchouliRef.current, {
          rotation: '+=0.8',
          duration: 4.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        })

        gsap.to(amberChunkRef.current, {
          rotation: '-=0.6',
          duration: 4.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.6,
        })
      }
    }, containerRef)

    // Smooth Mouse Movement Parallax (Desktop / Fine pointers)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    let rafId = 0
    let latestMouseX = 0
    let latestMouseY = 0

    const dispatchParallax = () => {
      const isLoaderReady =
        window.__RAYNOR_LOADER_DONE__ ||
        document.documentElement.getAttribute('data-loader-done') === 'true'
      if (!isActiveRef.current || !isLoaderReady || isBurstingRef.current) {
        rafId = 0
        return
      }

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
  }, [perfumeId])

  // ─────────────────────────────────────────────────────────────────────────
  // BOTANICAL ENTRANCE BURST
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const botanicals =
      perfumeId === 'first_light'
        ? [
            { ref: leafOnRRef,    x: 40,   y: 60,   delay: 0.02 },
            { ref: orangeRef,     x: 60,   y: 10,   delay: 0.00 },
            { ref: twoLeafsRef,   x: 50,   y: -40,  delay: 0.06 },
            { ref: bergamotRef,   x: -60,  y: 40,   delay: 0.03 },
            { ref: lemonRef,      x: -70,  y: -10,  delay: 0.05 },
            { ref: amberChunkRef, x: 20,   y: -50,  delay: 0.08 },
            { ref: muskRef,       x: -40,  y: -50,  delay: 0.09 },
          ]
        : [
            { ref: sageRef,         x: 40,   y: 50,   delay: 0.02 },
            { ref: lemonRef,        x: 60,   y: 10,   delay: 0.05 },
            { ref: cinnamonRef,     x: 50,   y: -40,  delay: 0.00 },
            { ref: amberChunkRef,   x: -60,  y: 40,   delay: 0.03 },
            { ref: patchouliRef,    x: -50,  y: -20,  delay: 0.06 },
            { ref: rosewoodRef,     x: -40,  y: -50,  delay: 0.08 },
          ]

    const setHiddenState = () => {
      if (bottleRef.current) {
        gsap.set(bottleRef.current, { opacity: 0, scale: 0.82, y: 40, force3D: true })
      }
      botanicals.forEach(({ ref, x, y }) => {
        if (ref.current) {
          gsap.set(ref.current, { opacity: 0, scale: 0.4, x, y, force3D: true })
        }
      })
    }

    const showAllInstantly = () => {
      isBurstingRef.current = false
      if (bottleRef.current) {
        gsap.set(bottleRef.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          force3D: true,
          clearProps: 'opacity,scale,x,y',
        })
      }
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      showAllInstantly()
      return
    }

    // When slide is not active: prime offscreen after slide exit completes
    if (!isActive) {
      if (!hasRevealedRef.current) {
        setHiddenState()
      } else {
        const offscreenTimer = setTimeout(() => {
          setHiddenState()
        }, 700)
        return () => clearTimeout(offscreenTimer)
      }
      return
    }

    // Now isActive is true
    const isLoaderAlreadyDone =
      window.__RAYNOR_LOADER_DONE__ ||
      document.documentElement.getAttribute('data-loader-done') === 'true'

    const playBurst = (startDelay = 0) => {
      isBurstingRef.current = true
      hasRevealedRef.current = true

      burstCtxRef.current?.revert()
      burstCtxRef.current = gsap.context(() => {
        const tl = gsap.timeline({
          delay: startDelay,
          onComplete: () => {
            isBurstingRef.current = false
          },
        })

        // 1. Centerpiece Bottle Flacon Burst (rises and blooms into the foreground)
        if (bottleRef.current) {
          tl.fromTo(
            bottleRef.current,
            { opacity: 0, scale: 0.82, y: 40, force3D: true },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.25,
              ease: 'power3.out',
              force3D: true,
              overwrite: 'auto',
              clearProps: 'opacity,scale,y',
            },
            0
          )
        }

        // 2. Botanical ingredients radial burst outward
        botanicals.forEach(({ ref, x, y, delay }) => {
          if (!ref.current) return
          tl.fromTo(
            ref.current,
            { opacity: 0, scale: 0.4, x, y, force3D: true },
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

    // If curtain loader is already complete (e.g. user scrolled to After Glow, or navigated back),
    // trigger the burst with a 0.08s glide offset so elements blossom right in center stage
    if (isLoaderAlreadyDone) {
      playBurst(0.08)
      return () => {
        burstCtxRef.current?.revert()
      }
    }

    // Otherwise, this is initial page load and curtain loader is still active:
    // Hold in hidden burst state until curtains part
    setHiddenState()

    const handleLoaderDone = () => {
      playBurst(0)
    }

    window.addEventListener('raynor:loader-done', handleLoaderDone, { once: true })

    const safetyTimer = setTimeout(() => {
      if (!hasRevealedRef.current) {
        handleLoaderDone()
      }
    }, 4200)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const isDone =
          window.__RAYNOR_LOADER_DONE__ ||
          document.documentElement.getAttribute('data-loader-done') === 'true'
        if (isDone && hasRevealedRef.current) {
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
  }, [isActive, slideIndex, perfumeId])

  return (
    <div
      ref={containerRef}
      className={`hero-slide-stage hero-slide-stage-${slideIndex + 1} hero-slide-${perfumeId}`}
      data-slide-index={slideIndex}
      data-perfume-id={perfumeId}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. THE NAME ("FIRST LIGHT" vs "AFTER GLOW")
          ───────────────────────────────────────────────────────────── */}
      <div ref={titleWrapRef} className="hero-slide-title-wrap">
        <div className="hero-eau-de-parfum">EAU DE PARFUM</div>

        {perfumeId === 'after_glow' ? (
          <>
            {/* Desktop split words: AFT ER GL OW */}
            <div ref={textFirRef} className="hero-title-word hero-text-fir">
              AFT
            </div>
            <div ref={textStRef} className="hero-title-word hero-text-st">
              ER
            </div>
            <div ref={textLiRef} className="hero-title-word hero-text-li">
              GL
            </div>
            <div ref={textGhtRef} className="hero-title-word hero-text-ght">
              OW
            </div>

            {/* Mobile unified typography */}
            <div className="hero-title-mobile" aria-hidden="true">
              <div className="hero-title-word hero-title-mobile-first">AFTER</div>
              <div className="hero-title-word hero-title-mobile-light">GLOW</div>
            </div>
          </>
        ) : (
          <>
            {/* Desktop split words: FIR ST LI GHT */}
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

            {/* Mobile unified typography */}
            <div className="hero-title-mobile" aria-hidden="true">
              <div className="hero-title-word hero-title-mobile-first">FIRST</div>
              <div className="hero-title-word hero-title-mobile-light">LIGHT</div>
            </div>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. THE BOTTLE AND THE FLOATING ELEMENTS (CENTERPIECE SCULPTURE)
          ───────────────────────────────────────────────────────────── */}
      <div ref={stageWrapRef} className="hero-slide-stage-wrap">
        <div className="hero-centerpiece-anchor">
          <div ref={centerpieceRef} className="hero-centerpiece-stage">
            {perfumeId === 'after_glow' ? (
              /* ========================================================
                 AFTER GLOW CENTERPIECE INGREDIENTS
                 Strict 6-Note Radial Burst Sculptural Composition
                 ======================================================== */
              <>
                {/* 1. Velvet Sage Leaves (Northwest / 11 o'clock) */}
                <div
                  ref={sageRef}
                  className={`hero-stage-item hero-afterglow-sage ${activeNote === 'Sage' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/after_glow/sage.webp" alt="Velvet Herbal Sage" />
                </div>

                {/* 2. Mediterranean Lemon Slice (West / 9:30 o'clock) */}
                <div
                  ref={lemonRef}
                  className={`hero-stage-item hero-afterglow-lemon ${activeNote === 'Lemon' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/lemon.webp" alt="Mediterranean Lemon Slice" />
                </div>

                {/* 3. Spiced Ceylon Cinnamon Sticks (Southwest / 7:30 o'clock) */}
                <div
                  ref={cinnamonRef}
                  className={`hero-stage-item hero-afterglow-cinnamon ${activeNote === 'Cinnamon' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/after_glow/cinnamon.webp" alt="Spiced Ceylon Cinnamon" />
                </div>

                {/* 4. Luminous Amber Crystal Resin (Northeast / 2 o'clock) */}
                <div
                  ref={amberChunkRef}
                  className={`hero-stage-item hero-afterglow-amber ${activeNote === 'Amber' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/amber_chunk.webp" alt="Warm Amber Resin Chunk" />
                </div>

                {/* 5. Smoked Velvet Rosewood Bark (South-Southeast / 5:30 o'clock) */}
                <div
                  ref={rosewoodRef}
                  className={`hero-stage-item hero-afterglow-rosewood ${activeNote === 'Rosewood' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/after_glow/rosewood.webp" alt="Smoked Velvet Rosewood" />
                </div>

                {/* 6. Aromatic Dark Patchouli (Southeast / 4:00 o'clock) */}
                <div
                  ref={patchouliRef}
                  className={`hero-stage-item hero-afterglow-patchouli ${activeNote === 'Patchouli' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/after_glow/patchouli.webp" alt="Earthy Dark Patchouli" />
                </div>

                {/* 7. AFTER GLOW BOTTLE FLACON (Centerpiece Flacon, z-index: 30) */}
                <div
                  ref={bottleRef}
                  className="hero-bottle"
                  aria-label="RAYNOR After Glow Flacon"
                  title="RAYNOR After Glow Flacon"
                >
                  <img src="/images/perfume/after_glow/bottle.webp" alt="RAYNOR After Glow Flacon" />
                </div>
              </>
            ) : (
              /* ========================================================
                 FIRST LIGHT CENTERPIECE INGREDIENTS
                 Strict 6-Note Radial Burst Sculptural Composition
                 ======================================================== */
              <>
                {/* 1. Mandarin Citrus Glossy Leaf (Northwest / 11 o'clock) */}
                <div
                  ref={leafOnRRef}
                  className={`hero-stage-item hero-leaf-on-r ${activeNote === 'Mandarin' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/leaf.webp" alt="Glossy Mandarin Citrus Leaf" />
                </div>

                {/* 2. Sun-Drenched Bergamot Orange Slice (West / 9:30 o'clock) */}
                <div
                  ref={orangeRef}
                  className={`hero-stage-item hero-orange ${activeNote === 'Orange' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/orange.webp" alt="Sun-Drenched Bergamot Orange Wheel" />
                </div>

                {/* 3. Twin Botanical Leaves (Southwest / 7:30 o'clock) */}
                <div
                  ref={twoLeafsRef}
                  className={`hero-stage-item hero-two-leafs ${activeNote === 'Mandarin' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/two_leafs.webp" alt="Citrus Botanical Leaves" />
                </div>

                {/* 4. Crisp Italian Bergamot Slice (Northeast / 2 o'clock) */}
                <div
                  ref={bergamotRef}
                  className={`hero-stage-item hero-bergamot ${activeNote === 'Bergamot' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/bergamot.webp" alt="Fresh Italian Green Bergamot" />
                </div>

                {/* 5. Mediterranean Lemon Wheel (East-Southeast / 4 o'clock) */}
                <div
                  ref={lemonRef}
                  className={`hero-stage-item hero-lemon ${activeNote === 'Lemon' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/lemon.webp" alt="Mediterranean Lemon Slice" />
                </div>

                {/* 6. Solar Amber Resin Crystal (South-Southwest / 6:30 o'clock) */}
                <div
                  ref={amberChunkRef}
                  className={`hero-stage-item hero-amber-chunk-bottom ${activeNote === 'Amber' ? 'active-highlight' : ''}`}
                >
                  <img src="/images/perfume/first_light/amber_chunk.webp" alt="Warm Golden Amber Resin" />
                </div>

                {/* 7. White Cashmere Musk Blossom (South-Southeast / 5:30 o'clock) */}
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

                {/* 8. FIRST LIGHT BOTTLE FLACON (Centerpiece Flacon, z-index: 30) */}
                <div
                  ref={bottleRef}
                  className="hero-bottle"
                  aria-label="RAYNOR First Light Flacon"
                  title="RAYNOR First Light Flacon"
                >
                  <img src="/images/perfume/first_light/bottle.webp" alt="RAYNOR First Light Flacon" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
