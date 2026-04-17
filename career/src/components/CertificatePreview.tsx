import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, FileText, Download, ExternalLink, ShieldCheck, Zap } from 'lucide-react'

// Asset paths (from generated artifacts)
const DEMO_CERT = '/0d309038-484e-4251-b777-2debc82a90ae/demo_certificate_mockup_1775907983466.png'
const DEMO_LOR = '/0d309038-484e-4251-b777-2debc82a90ae/lor_mockup_illustration_1775908009926.png'

interface PreviewProps {
  isOpen: boolean
  onClose: () => void
  type?: 'certificate' | 'lor'
}

export function CertificatePreview({ isOpen, onClose, type = 'certificate' }: PreviewProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-5xl bg-card rounded-[3.5rem] shadow-2xl overflow-hidden border border-border"
          >
            {/* Header Overlay */}
            <div className="absolute top-0 inset-x-0 p-10 flex justify-between items-center z-20 pointer-events-none">
              <div className="flex items-center gap-4 bg-background px-6 py-3 rounded-2xl shadow-xl border border-border pointer-events-auto">
                <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg">
                   {type === 'certificate' ? <Award size={20} /> : <FileText size={20} />}
                </div>
                <h3 className="font-heading font-black text-foreground tracking-tighter uppercase text-sm">
                  {type === 'certificate' ? 'Official Credential' : 'Professional LOR'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="h-14 w-14 flex items-center justify-center rounded-2xl bg-background shadow-xl border border-border hover:bg-secondary transition-colors pointer-events-auto group"
              >
                <X size={24} className="text-foreground group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Preview */}
              <div className="flex-1 bg-secondary p-12 lg:p-24 pt-32 lg:pt-32 flex items-center justify-center overflow-auto min-h-[400px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="relative group"
                >
                  <img
                    src={type === 'certificate' ? DEMO_CERT : DEMO_LOR}
                    alt="Document Preview"
                    className="max-h-[60vh] w-auto rounded-2xl shadow-2xl border border-border group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-2xl" />
                </motion.div>
              </div>

              {/* Info Sidebar */}
              <div className="w-full lg:w-[380px] p-12 bg-card border-l border-border flex flex-col justify-center relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-[60px] rounded-full" />
                 
                 <div className="space-y-10 relative z-10">
                    <div>
                       <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4 block">Spec Sheet</span>
                       <h4 className="text-3xl font-heading font-black text-foreground leading-tight tracking-tighter">
                          High-Fidelity {type === 'certificate' ? 'Credential' : 'Endorsement'}
                       </h4>
                       <p className="mt-4 text-[15px] font-medium text-muted-foreground leading-relaxed">
                          {type === 'certificate' 
                            ? 'Our credentials are cryptographically signed and optimized for professional platforms like LinkedIn.' 
                            : 'Personalized endorsements from senior tech leads summarizing your technical contributions.'}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary border border-border transition-colors hover:border-brand-emerald/30 group">
                          <ShieldCheck className="text-brand-emerald group-hover:scale-110 transition-transform" size={24} />
                          <span className="text-[11px] font-black text-foreground uppercase tracking-widest">On-Chain Verified</span>
                       </div>
                       <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary border border-border transition-colors hover:border-brand-blue/30 group">
                          <ExternalLink className="text-brand-blue group-hover:scale-110 transition-transform" size={24} />
                          <span className="text-[11px] font-black text-foreground uppercase tracking-widest">Portfolio Sync</span>
                       </div>
                       <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary border border-border transition-colors hover:border-brand-blue/30 group">
                          <Zap className="text-brand-amber group-hover:scale-110 transition-transform" size={24} />
                          <span className="text-[11px] font-black text-foreground uppercase tracking-widest">Instant Share</span>
                       </div>
                    </div>

                    <button className="w-full h-16 rounded-full bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all group/btn">
                       <Download size={20} className="group-hover/btn:translate-y-1 transition-transform" /> Sample Distribution
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
