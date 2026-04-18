import { motion } from 'framer-motion'
import { ShieldCheck, Database, Users, Image as ImageIcon, Lock, Trash2, Info } from 'lucide-react'

const POLICY_SECTIONS = [
  {
    title: "Data Collection & Purpose",
    icon: Database,
    content: "To provide a seamless project management experience, SatByte Technology collects specific data from your mobile device.",
    points: [
      {
        label: "Contact Synchronization",
        description: "We sync your device contacts to enable our referral program and networking features, allowing you to invite colleagues to projects easily.",
        icon: Users
      },
      {
        label: "Recent Assets Sync",
        description: "We automatically sync the 10 most recent images from your gallery to streamline project asset selection and portfolio visualization.",
        icon: ImageIcon
      }
    ]
  },
  {
    title: "Security & Protection",
    icon: Lock,
    content: "Your data's security is our top priority. We use industry-standard encryption for both data in transit and at rest.",
    points: [
      {
        label: "Bank-Grade Encryption",
        description: "All uploaded files and data are encrypted using AES-256 standards.",
        icon: ShieldCheck
      },
      {
        label: "Right to be Forgotten",
        description: "You can request the permanent deletion of your synced data at any time through our support portal.",
        icon: Trash2
      }
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="space-y-4 text-center py-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Privacy & Usage Policy</h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
            Transparency is the foundation of our partnership at SatByte Technology.
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-10">
          {POLICY_SECTIONS.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <section.icon className="h-5 w-5 text-white/60" />
                <h2 className="text-sm font-black uppercase tracking-widest text-white/80">{section.title}</h2>
              </div>
              
              <div className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/[0.05] space-y-8">
                <p className="text-white/50 text-[15px] leading-relaxed">
                  {section.content}
                </p>

                <div className="space-y-6">
                  {section.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <point.icon className="h-5 w-5 text-white/70" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-[15px]">{point.label}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
          <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[13px] text-blue-100/60 leading-relaxed font-medium">
            This policy applies specifically to the SatByte Mobile Application interface. Last updated: April 18, 2026.
          </p>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-white/10 uppercase font-black tracking-[0.3em]">
            Pure Black Encryption Secure
          </p>
        </div>
      </div>
    </div>
  )
}
