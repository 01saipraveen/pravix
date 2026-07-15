import React from 'react';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { 
  Mail, Phone, MapPin, Send, 
  ShieldAlert, FileText, Gift 
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
          <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">Our Engineering Core</h1>
          <p className="text-sm text-indigo-500 font-bold">Pravix Corporation • Est. 2026</p>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            At Pravix, we engineer premium computers, wear, and home subsystems designed for engineers, creators, and power-users. Our products combine next-generation neural processing cores with tactile, premium materials to deliver state-of-the-art experiences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850">
              <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">Precision Assembly</h4>
              <p className="text-xs text-slate-400 mt-2">Every keyboard switch and thermal pad is calibrated for maximum longevity.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850">
              <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">Neural Software Sync</h4>
              <p className="text-xs text-slate-400 mt-2">Our custom firmware syncs with your IDE parameters dynamically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    showToast(`Telemetry report received from ${data.email}. Dispatching response...`, 'success');
    reset();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <h3 className="font-extrabold text-lg">Support Channels</h3>
          
          <div className="flex items-start gap-3 text-xs">
            <Mail className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">General Telemetry</p>
              <p className="text-slate-500 mt-0.5">support@Pravix.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <Phone className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">System Line</p>
              <p className="text-slate-500 mt-0.5">+1 (800) NexusCore</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Neural Headquarters</p>
              <p className="text-slate-500 mt-0.5">128 Innovation Way, San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h3 className="font-extrabold text-xl">Calibrate Ticket (Contact Support)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400">Your Identity</label>
                <input
                  type="text"
                  required
                  {...register('name')}
                  placeholder="Full Name"
                  className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  {...register('email')}
                  placeholder="name@domain.com"
                  className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400">Ticket Contents</label>
              <textarea
                required
                rows={4}
                {...register('message')}
                placeholder="Log details regarding hardware components or support needs..."
                className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl py-2.5 px-4 text-xs border border-slate-200 dark:border-slate-850 resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-end shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Ticket</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-indigo-500" />
            <span>Privacy & Telemetry Policy</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Effective Version: 14.2.1</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Pravix processes user parameters solely to fulfill hardware shipments, calibrate recommendation models, and protect account transactions. We encrypt address registers and card details securely using industry-standard protocols.
          </p>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white mt-2">1. Collected Telemetry</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We store basic handle names, email targets, shipping coordinates, and transaction logs. No raw credit card credentials are retained in our database nodes.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsConditions: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-500" />
            <span>System Terms & Conditions</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            By accessing Pravix terminals or configuring systems, you agree to fulfill transaction calculations, respect hardware patents, and avoid malicious reverse engineering of neural architectures.
          </p>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white mt-2">1. Hardware Calibration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All system specifications described are simulated demonstrations. Any warranty or hardware configurations are subject to local customer regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReturnRefundPolicy: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <Gift className="w-7 h-7 text-indigo-500" />
            <span>Return & Refund Protocol</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We offer a 30-day return policy. If a component does not fit your technical expectations, you can request a shipping label in your dashboard to return the unit.
          </p>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white mt-2">1. Conditions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Components must not have experienced liquid ingress or physical drops. The original packaging must be returned intact for complete refund approval.
          </p>
        </div>
      </div>
    </div>
  );
};
