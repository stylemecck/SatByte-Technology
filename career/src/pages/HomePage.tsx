import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Award, CheckCircle2, ArrowRight, ShieldCheck, Zap, Laptop } from 'lucide-react'
import { SEO } from '../components/SEO'
import { SITE } from '../lib/constants'

export default function HomePage() {
  return (
    <>
      <SEO title="Home" description="Build your future with SatByte. Careers, Internships, and Professional Certifications." />

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
                <ShieldCheck size={16} /> Verified Career Paths
              </span>
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-secondary tracking-tight leading-[1.1]">
                {SITE.tagline.split(' — ')[0]} <br />
                <span className="text-primary">{SITE.tagline.split(' — ')[1]}</span>
              </h1>
              <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Unlock your potential with professional roles, structured internships, and industry-recognized certifications. Start your journey with {SITE.parentName}.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/careers"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-secondary text-white font-bold text-lg shadow-xl shadow-secondary/20 hover:bg-primary transition-all duration-300 hover:-translate-y-1"
                >
                  Explore Jobs <ArrowRight size={20} />
                </Link>
                <Link
                  to="/certifications"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-white text-secondary font-bold text-lg border border-slate-200 hover:border-primary hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1"
                >
                  Get Certified
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Feature Cards --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Briefcase}
              title="Careers"
              description="Join our engineering, design, and marketing teams to build scalable solutions."
              link="/careers"
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={GraduationCap}
              title="Internships"
              description="Structured programs for students to work on real projects with expert mentorship."
              link="/internships"
              color="bg-emerald-500"
            />
            <FeatureCard 
              icon={Award}
              title="Certifications"
              description="Learn in-demand skills like MERN Stack and React with verified certificates."
              link="/certifications"
              color="bg-amber-500"
            />
          </div>
        </div>
      </section>

      {/* --- Benefits Section --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Promise</span>
              <h2 className="mt-4 font-heading text-4xl sm:text-5xl font-extrabold text-secondary leading-tight">
                Why build your career <br /> at SatByte?
              </h2>
              <div className="mt-8 space-y-6">
                <BenefitItem 
                  icon={Zap} 
                  title="Industry Experience" 
                  desc="Skip the theory. Work on projects that solve real-world problems for global clients." 
                />
                <BenefitItem 
                  icon={Laptop} 
                  title="Real-World Projects" 
                  desc="Gain ownership over features and systems from day one under senior guidance." 
                />
                <BenefitItem 
                  icon={CheckCircle2} 
                  title="Verified Certificates" 
                  desc="Every internship and certification comes with a verifiable blockchain-ready certificate." 
                />
              </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl transform rotate-3" />
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                 <img 
                    src="https://images.unsplash.com/photo-1522071823991-b19c77663cf8?w=800&q=80" 
                    alt="Team Collaboration" 
                    className="w-full h-auto object-cover"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-secondary p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-secondary/40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
          <h2 className="relative z-10 font-heading text-4xl sm:text-5xl font-extrabold text-white">
            Ready to take the next step?
          </h2>
          <p className="relative z-10 mt-6 text-xl text-slate-300">
            Whether you are looking for a job, an internship, or a new skill, we have a place for you.
          </p>
          <div className="relative z-10 mt-10">
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-secondary font-extrabold text-lg shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Your Journey <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function FeatureCard({ icon: Icon, title, description, link, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-start gap-6 transition-all duration-300 hover:border-primary/30"
    >
      <div className={cn('h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg', color)}>
        <Icon size={28} />
      </div>
      <div>
         <h3 className="font-heading text-2xl font-extrabold text-secondary">{title}</h3>
         <p className="mt-3 text-slate-600 leading-relaxed">{description}</p>
      </div>
      <Link to={link} className="mt-auto inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all">
        Learn More <ArrowRight size={18} />
      </Link>
    </motion.div>
  )
}

function BenefitItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-heading font-bold text-lg text-secondary">{title}</h4>
        <p className="text-slate-600 text-[15px]">{desc}</p>
      </div>
    </div>
  )
}
