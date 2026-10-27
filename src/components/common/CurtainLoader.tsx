import React, { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import '../../styles/curtain-loader.css'

// Safe lag-smoothing: clamp jumps when returning from background tabs without timeline breakdown
gsap.ticker.lagSmoothing(500, 33)

declare global {
  interface Window {
    __RAYNOR_LOADER_DONE__?: boolean
  }
}

interface CurtainLoaderProps {
  onComplete?: () => void
}

export const CurtainLoader: React.FC<CurtainLoaderProps> = ({ onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const logoWrapperRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  const runCurtainSequence = useCallback(() => {
    // Lock scrolling during curtain sequence
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Ensure background stays pure obsidian during loading, zero flash
    document.documentElement.style.backgroundColor = '#000000'
    document.body.style.backgroundColor = '#000000'

    // Clean up any existing GSAP context before starting a new run
    if (ctxRef.current) {
      ctxRef.current.revert()
    }

    ctxRef.current = gsap.context(() => {
      // Remove the native HTML preloader — React's CurtainLoader overlay is now active
      const htmlPreloader = document.getElementById('html-preloader')
      if (htmlPreloader) htmlPreloader.remove()

      // Ensure root is visible and panels cover the screen completely
      gsap.set(rootRef.current, { display: 'block', pointerEvents: 'all' })
      gsap.set(leftPanelRef.current, { xPercent: 0, force3D: true })
      gsap.set(rightPanelRef.current, { xPercent: 0, force3D: true })

      // Initial state: Logo starts SMALL and transparent
      gsap.set(logoWrapperRef.current, {
        opacity: 0,
        scale: 0.35,
        force3D: true,
      })

      const tl = gsap.timeline({
        onComplete: () => {
          window.__RAYNOR_LOADER_DONE__ = true
          document.documentElement.setAttribute('data-loader-done', 'true')
          document.body.style.overflow = previousOverflow
          document.documentElement.style.backgroundColor = '#f5efe6'
          document.body.style.backgroundColor = '#f5efe6'
          if (rootRef.current) {
            rootRef.current.style.display = 'none'
          }
          onComplete?.()
        },
      })

      // -------------------------------------------------------------
      // 1. Logo increases from SMALL to BIG smoothly (0.0s - 1.4s)
      // -------------------------------------------------------------
      tl.to(
        logoWrapperRef.current,
        {
          opacity: 1,
          scale: 1.0,
          duration: 1.4,
          ease: 'power2.out',
          force3D: true,
        },
        0.1
      )

      // -------------------------------------------------------------
      // 2. Poise Phase: Logo rests at majestic big size (1.4s - 2.2s)
      // -------------------------------------------------------------
      .to(
        logoWrapperRef.current,
        {
          scale: 1.02,
          duration: 0.8,
          ease: 'sine.inOut',
          force3D: true,
        },
        '>-0.05'
      )

      // -------------------------------------------------------------
      // 3. THE GRAND CURTAIN REVEAL EFFECT (2.2s - 3.6s)
      //    - Left & right obsidian panels part to uncover the website!
      //    - Logo dissolves synchronously into the parting curtains
      // -------------------------------------------------------------
      .addLabel('reveal')
      .call(() => {
        window.__RAYNOR_LOADER_DONE__ = true
        document.documentElement.setAttribute('data-loader-done', 'true')
        window.dispatchEvent(new CustomEvent('raynor:loader-done'))
      }, [], 'reveal')
      .to(
        leftPanelRef.current,
        {
          xPercent: -100,
          duration: 1.4,
          ease: 'power3.inOut',
          force3D: true,
        },
        'reveal'
      )
      .to(
        rightPanelRef.current,
        {
          xPercent: 100,
          duration: 1.4,
          ease: 'power3.inOut',
          force3D: true,
        },
        'reveal'
      )
      .to(
        logoWrapperRef.current,
        {
          opacity: 0,
          scale: 1.08,
          duration: 0.7,
          ease: 'power2.inOut',
          force3D: true,
        },
        'reveal'
      )
    }, rootRef)
  }, [onComplete])

  useEffect(() => {
    runCurtainSequence()

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert()
      }
    }
  }, [runCurtainSequence])

  return (
    <div
      ref={rootRef}
      className="curtain-loader-root"
      aria-label="Loading Raynor Haute Parfumerie"
      role="dialog"
      aria-modal="true"
    >
      {/* Left Curtain Half — Pure Solid Obsidian Black, Zero Middle Line */}
      <div ref={leftPanelRef} className="curtain-panel curtain-panel-left" />

      {/* Right Curtain Half — Pure Solid Obsidian Black, Zero Middle Line */}
      <div ref={rightPanelRef} className="curtain-panel curtain-panel-right" />

      {/* Centered Grand Brand Stage */}
      <div className="curtain-logo-stage">
        <div ref={logoWrapperRef} className="curtain-logo-wrapper">
          <img
            src="/images/raynor-logo.png"
            alt="Raynor - The Essence of Luxury"
            className="curtain-logo-image"
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}
