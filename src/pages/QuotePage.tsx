import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { SectionHeader } from '@/components/SectionHeader'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/apiClient'

type ProjectType = 'web' | 'ecommerce' | 'app' | 'other'
type PagesCount = '1-5' | '6-15' | '15+'
type Timeline = 'asap' | '1-month' | 'flexible'

export default function QuotePage() {
  const [step, setStep] = useState(1)
  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [pages, setPages] = useState<PagesCount | null>(null)
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const getEstimate = () => {
    let base = 5000
    if (projectType === 'ecommerce') base += 10000
    if (projectType === 'app') base += 20000
    
    if (pages === '6-15') base += 5000
    if (pages === '15+') base += 15000

    if (timeline === 'asap') base += 5000

    return `₹${base.toLocaleString('en-IN')} - ₹${(base + 10000).toLocaleString('en-IN')}`
  }

  const submitEstimate = async () => {
    if (!email) return;
    setStatus('sending');
    try {
      await api.post('contact/estimate', {
        projectType,
        pages,
        timeline,
        estimate: getEstimate(),
        email
      });
      setStatus('ok');
    } catch(e) {
      console.error(e);
      setStatus('err');
    }
  }

  return (
    <>
      <SEO title="Get a Quote" description="Estimate your project cost with SatByte Technologies." path="/quote" />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 min-h-[70vh]">
        <SectionHeader
          eyebrow="Interactive Estimator"
          title="Project Cost Calculator"
          subtitle="Answer a few quick questions to get an instant rough estimate for your project."
        />

        <Card className="mt-10 overflow-hidden border-slate-200/80 bg-white shadow-xl dark:border-white/10 dark:bg-[#0f172a]">
          <CardContent className="p-8 sm:p-12">
            {/* Progress indicator */}
            <div className="mb-8 flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-1 items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      step >= s
                        ? 'bg-primary text-white dark:bg-accent'
                        : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s !== 4 && (
                    <div
                      className={`h-1 flex-1 ${
                        step > s ? 'bg-primary dark:bg-accent' : 'bg-slate-100 dark:bg-white/5'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <AnimateStep step={step}>
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-secondary dark:text-white">What type of project is this?</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { id: 'web', label: 'Company Website' },
                      { id: 'ecommerce', label: 'E-commerce Store' },
                      { id: 'app', label: 'Web Application' },
                      { id: 'other', label: 'Other/Not sure' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setProjectType(opt.id as ProjectType)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          projectType === opt.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary dark:border-accent dark:bg-accent/10 dark:ring-accent'
                            : 'border-slate-200 hover:border-primary/50 dark:border-white/10 dark:hover:border-accent/50'
                        }`}
                      >
                        <div className="font-medium text-slate-800 dark:text-slate-200">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button disabled={!projectType} onClick={() => setStep(2)}>Next Step</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-secondary dark:text-white">Roughly how many pages/screens do you need?</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { id: '1-5', label: '1 - 5 Pages' },
                      { id: '6-15', label: '6 - 15 Pages' },
                      { id: '15+', label: '15+ Pages' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPages(opt.id as PagesCount)}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          pages === opt.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary dark:border-accent dark:bg-accent/10 dark:ring-accent'
                            : 'border-slate-200 hover:border-primary/50 dark:border-white/10 dark:hover:border-accent/50'
                        }`}
                      >
                        <div className="font-medium text-slate-800 dark:text-slate-200">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button disabled={!pages} onClick={() => setStep(3)}>Next Step</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-secondary dark:text-white">What is your ideal timeline?</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { id: 'asap', label: 'ASAP (Urgent)' },
                      { id: '1-month', label: 'Within 1 Month' },
                      { id: 'flexible', label: 'Flexible' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setTimeline(opt.id as Timeline)}
                        className={`rounded-xl border p-4 text-center transition-all ${
                          timeline === opt.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary dark:border-accent dark:bg-accent/10 dark:ring-accent'
                            : 'border-slate-200 hover:border-primary/50 dark:border-white/10 dark:hover:border-accent/50'
                        }`}
                      >
                        <div className="font-medium text-slate-800 dark:text-slate-200">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button disabled={!timeline} onClick={() => setStep(4)}>View Estimate</Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 text-center">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary dark:text-white mb-2">Your Estimated Project Cost</h3>
                    <div className="text-4xl font-bold text-primary dark:text-accent mb-4">
                      {getEstimate()}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      *This is a rough estimate based on your selections. Final pricing depends on specific requirements.
                    </p>
                  </div>

                  <div className="mx-auto max-w-sm space-y-4">
                    <p className="font-medium text-slate-700 dark:text-slate-200">Where should we send your detailed proposal?</p>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:border-accent dark:focus:ring-accent"
                    />
                    <Button 
                      className="w-full"
                      disabled={status === 'sending' || status === 'ok' || !email}
                      onClick={submitEstimate}
                    >
                      {status === 'sending' ? 'Sending...' : status === 'ok' ? 'Sent Successfully!' : 'Send My Proposal'}
                    </Button>
                    {status === 'err' && <p className="text-sm text-red-500">Failed to send. Please try again.</p>}
                    <div className="pt-4 flex items-center justify-center gap-4">
                      <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
                      <Button variant="secondary" asChild><Link to="/contact">Contact Sales</Link></Button>
                    </div>
                  </div>
                </div>
              )}
            </AnimateStep>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function AnimateStep({ children, step }: { children: React.ReactNode; step: number }) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
