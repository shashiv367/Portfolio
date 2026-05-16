import { lazy, Suspense } from "react"
import Contact from "./components/Contact"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Services from "./components/Services"
import CosmicCursor from "./components/CosmicCursor"
import Technologies from "./components/Technologies"

const CosmicBackground = lazy(() => import("./components/CosmicBackground"))

const App = () => {
  return (
    <div className="min-h-screen text-stone-300 antialiased">
      <CosmicCursor />
      <Suspense fallback={null}>
        <CosmicBackground />
      </Suspense>

      <Navbar />

      <main className="container mx-auto px-8 pt-28 md:pt-20">
        <Hero />
        <Technologies />
        <Experience />
        <Projects />
        <Services />
        <Contact />
      </main>
    </div>
  )
}

export default App
