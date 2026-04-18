import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { api } from '@/lib/apiClient';

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`checkout/my-orders/${order._id}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.emailReferenceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download invoice. Please try again later.');
    }
  };

  const timelineStages = [
    { label: 'Payment Received', status: 'completed', date: new Date(order.createdAt).toLocaleDateString() },
    { 
      label: 'Order Validation', 
      status: order.projectStatus !== 'Pending Validation' ? 'completed' : 'active',
      desc: order.projectStatus === 'Pending Validation' ? 'Our team is reviewing your requirements.' : 'Verified & Validated'
    },
    { 
      label: 'Development Phase', 
      status: order.progress > 0 ? (order.progress === 100 ? 'completed' : 'active') : 'pending',
      desc: order.progress > 0 ? `${order.progress}% completed` : 'Queued for development.'
    },
    { 
      label: 'Quality Assurance', 
      status: order.progress >= 90 ? (order.progress === 100 ? 'completed' : 'active') : 'pending',
      desc: 'Final testing and optimization.'
    },
    { 
      label: 'Final Handover', 
      status: order.progress === 100 ? 'completed' : 'pending',
      desc: 'Project delivery and access transfer.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-foreground">Order Details</h3>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{order.emailReferenceId}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] hide-scrollbar">
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Left Side: Summary & Timeline */}
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                       <ShieldCheck className="h-3 w-3" /> Project Timeline
                    </h4>
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                      {timelineStages.map((stage, i) => (
                        <div key={i} className="relative pl-8">
                          <div className={`absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full border-4 border-card flex items-center justify-center z-10 ${
                            stage.status === 'completed' ? 'bg-green-500' 
                            : stage.status === 'active' ? 'bg-primary animate-pulse' 
                            : 'bg-muted border-border'
                          }`}>
                            {stage.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                            {stage.status === 'active' && <Clock className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${stage.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {stage.label}
                            </span>
                            {stage.desc && <span className="text-[11px] text-muted-foreground mt-0.5">{stage.desc}</span>}
                            {stage.date && <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-tighter">{stage.date}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Side: Metadata & Action */}
                <div className="space-y-6">
                   <div className="p-5 rounded-2xl bg-muted/50 border border-border">
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Transaction Info</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Plan</span>
                          <span className="text-sm font-bold text-foreground text-right">{order.planName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Amount Paid</span>
                          <span className="text-sm font-bold text-green-500 font-mono">₹{(order.amountPaid / 100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Gateway ID</span>
                          <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]" title={order.paymentGatewayReferenceId}>
                            {order.paymentGatewayReferenceId}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Purchase Date</span>
                          <span className="text-sm font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                   </div>

                   <button 
                    onClick={handleDownloadInvoice}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                   >
                     <Download className="h-5 w-5" />
                     Download Invoice
                   </button>

                   <div className="p-4 rounded-xl border border-dashed border-primary/20 bg-primary/5">
                      <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                        Need help with this order? <br/>
                        <button className="text-primary font-bold underline">Contact Support</button>
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
