import { motion } from 'framer-motion'
import { Download, ShieldCheck, Smartphone, Zap, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FEATURES = [
  { icon: Smartphone, title: "Native Experience", description: "Fully optimized for Android devices with smooth 120Hz support." },
  { icon: Zap, title: "Real-time Sync", description: "Your project assets and team updates synchronized instantly." },
  { icon: ShieldCheck, title: "Security First", description: "Identity protection and encrypted data transfers by default." }
]

const INSTALL_STEPS = [
  "Tap the download button and save the APK file.",
  "Open the file from your 'Downloads' folder.",
  "If prompted, allow 'Install from Unknown Sources' in your settings.",
  "Follow the on-screen steps to complete installation."
]

export default function DownloadAppPage() {
  const apkUrl = "/satbyte-v1.0.1.apk"

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="px-4 py-1 rounded-full border-cyan-500/30 bg-cyan-500/5 text-cyan-400 mb-6">
                v1.0.1 Production Ready
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                SatByte <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Technologies
                </span> <br />
                for Android
              </h1>
              <p className="mt-6 text-xl text-white/50 leading-relaxed max-w-lg">
                Manage your projects, sync your gallery, and communicate with your team from anywhere. 
                Our native Android app is engineered for speed and precision.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href={apkUrl} download>
                <Button size="lg" className="h-14 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg gap-2 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Download className="h-6 w-6" />
                  Download APK
                </Button>
              </a>
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 text-white font-bold text-lg rounded-2xl cursor-not-allowed">
                iOS App (Coming Soon)
              </Button>
            </motion.div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-[#050505] bg-white/10 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40 font-medium">
                Joined by <span className="text-white font-bold">500+</span> SatByte users
              </p>
            </div>
          </div>

          {/* Right Column: Visual Component */}
          <div className="relative lg:pl-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[3rem] blur opacity-25" />
              <Card className="relative bg-black/40 border-white/10 backdrop-blur-xl p-8 rounded-[3rem] overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="h-12 w-12 rounded-xl bg-cyan-500 flex items-center justify-center">
                      <Download className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">System Verification</h4>
                      <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        Scanned & Secure
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-widest text-white/40 font-black">Installation Guide</p>
                    <div className="space-y-4">
                      {INSTALL_STEPS.map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                            <span className="text-[10px] font-black">{idx + 1}</span>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Build Version</p>
                      <p className="text-sm font-bold">SB_MOBILE_1.0.1_R</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">File Size</p>
                      <p className="text-sm font-bold">5.9 MB</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-40">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/20 transition-all hover:bg-white/[0.04] group"
            >
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-cyan-500/10 transition-all">
                <feature.icon className="h-6 w-6 text-white group-hover:text-cyan-400" />
              </div>
              <h3 className="text-xl font-black mb-2">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-40 p-10 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex gap-6 items-center">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-200">Production Build Information</h4>
            <p className="text-sm text-amber-200/50 leading-relaxed">
              This is a direct-run APK provided for beta testers and early adopters. 
              Please ensure your device allows installation from unknown sources to run the application securely.
            </p>
          </div>
        </div>

        {/* Background Footer Detail */}
        <div className="text-center mt-32">
          <p className="text-[10px] text-white/10 uppercase font-black tracking-[0.5em]">
            ENGINEERED AT SATBYTE PRECISION LABS
          </p>
        </div>
      </div>
    </div>
  )
}
