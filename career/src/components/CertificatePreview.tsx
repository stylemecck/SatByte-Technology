import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react'

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-8 flex justify-between items-center z-10 pointer-events-none">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur px-5 py-2.5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                   {type === 'certificate' ? <Award size={18} /> : <FileText size={18} />}
                </div>
                <h3 className="font-heading font-bold text-secondary">
                  {type === 'certificate' ? 'Sample Certification' : 'Sample Recommendation'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors pointer-events-auto"
              >
                <X size={20} className="text-secondary" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row h-full min-h-[500px]">
              {/* Image Preview */}
              <div className="flex-1 bg-slate-100 p-12 pt-24 flex items-center justify-center overflow-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                >
                  <img
                    src={type === 'certificate' ? DEMO_CERT : DEMO_LOR}
                    alt="Certificate Preview"
                    className="max-h-[70vh] w-auto rounded-lg shadow-2xl border border-slate-200"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg pointer-events-none" />
                </motion.div>
              </div>

              {/* Info Sidebar */}
              <div className="w-full lg:w-80 p-8 bg-slate-50 border-l border-slate-200 flex flex-col justify-center">
                 <div className="space-y-8">
                    <div>
                       <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Document Details</span>
                       <h4 className="text-2xl font-heading font-extrabold text-secondary leading-tight">
                          Industry-Recognized {type === 'certificate' ? 'Credential' : 'Recommendation'}
                       </h4>
                       <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                          {type === 'certificate' 
                            ? 'Our certificates are verified on-chain and directly shareable on LinkedIn and top hiring portals.' 
                            : 'Personalized letters of recommendation from lead engineers highlighting your project achievements.'}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                          <ShieldCheck className="text-emerald-500" size={20} />
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Globally Verifiable</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                          <ExternalLink className="text-primary" size={20} />
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Share anywhere</span>
                       </div>
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-secondary text-white font-bold text-sm shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 hover:bg-primary transition-all">
                       <Download size={16} /> Sample PDF
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
