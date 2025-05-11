import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Services from "@/components/sections/services"
import Projects from "@/components/sections/projects"
import Contact from "@/components/sections/contact"
import Cta from "@/components/sections/cta"

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      <Cta />
    </>
  )
}