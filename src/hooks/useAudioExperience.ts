import { luxuryAudio } from '../utils/audioSynth'

export function useAudioExperience() {
  return {
    playSpritz: () => luxuryAudio.playSpritz(),
    playGoldChime: () => luxuryAudio.playGoldChime(),
    playVelvetClick: () => luxuryAudio.playVelvetClick(),
  }
}
