import { HeroSection } from './components/home/HeroSection'
import { CurtainLoader } from './components/common/CurtainLoader'
import './styles/main.css'

export default function App() {
  return (
    <>
      <CurtainLoader />
      <main style={{ height: '100dvh', overflow: 'hidden', backgroundColor: '#f5efe6' }}>
        <HeroSection />
      </main>
    </>
  )
}
