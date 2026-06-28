import Hero from '@/components/Hero/Hero'
import Projects from '@/components/Projects/Projects'
import SkillsGrid from '@/components/Skills/SkillsGrid'
import Achievements from '@/components/Achievements/Achievements'
import Experience from '@/components/Experience/Esxperiemce'
import GithubPinned from '@/components/Github/GithubPinned'
import Contact from '@/components/Contact/Contact'
import FooterTerminal from '@/components/FooterTerminal/FooterTerminal'
import Footer from '@/components/Footer/Footer'
import LiveStats from '@/components/CodingStats/LiveStats'

export default function HomePage() {
  return (
    <>
      {/* Home Section: add padding-top to offset fixed navbar */}
     <section id="home">
  <Hero />
</section>

 <section id="github" >
        <GithubPinned />
      </section>
  <section id="experience" className="pt-8">
        <Experience />
      </section>

      {/* Other sections: keep spacing, can reduce if needed */}
      <section id="projects" className="pt-20">
        <Projects />
      </section>

      <section id="skills" className="pt-24">
        <SkillsGrid />
      </section>

      <section id="coding-stats" className="pt-24">
        <LiveStats />
      </section>

      <section id="achievements" className="pt-24">
        <Achievements />
      </section>

      <section id="contact" className="pt-20">
        <Contact />
      </section>

      <section >
        <FooterTerminal />
      </section>

      <footer >
         <Footer />
      </footer>

      
    </>
  )
}
