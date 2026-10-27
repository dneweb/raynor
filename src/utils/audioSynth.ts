/**
 * Web Audio API procedural luxury sound synthesizer
 * Zero external files needed. Instant, zero latency.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Atomizer mist spritz sound (bandpassed pink noise envelope)
  playSpritz() {
    try {
      this.init()
      if (!this.ctx) return

      const bufferSize = this.ctx.sampleRate * 0.18
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime)
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.17)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start()
      noise.stop(this.ctx.currentTime + 0.18)
    } catch {
      // Fallback
    }
  }

  // Warm chime on button click or interaction
  playGoldChime() {
    try {
      this.init()
      if (!this.ctx) return

      const frequencies = [587.33, 880, 1174.66]
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04)

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.03, this.ctx.currentTime + idx * 0.04 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.04 + 0.6)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(this.ctx.currentTime + idx * 0.04)
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.6)
      })
    } catch {
      // Fallback
    }
  }

  // Soft velvet click for notes selection
  playVelvetClick() {
    try {
      this.init()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {
      // Fallback
    }
  }
}

export const luxuryAudio = new AudioSynthesizer()
