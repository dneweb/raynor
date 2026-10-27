import { HeroSection } from './components/home/HeroSection'
import { CurtainLoader } from './components/common/CurtainLoader'
import './styles/main.css'

export default function App() {
  return (
    <>
      <CurtainLoader />
      <main style={{ minHeight: '100vh', backgroundColor: '#f5efe6', overflowX: 'hidden' }}>
        <HeroSection />
      </main>
    </>
  )
}
