import React, { useState } from 'react';
import { Mail, Send, Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface ContactFormWidgetProps {
  contactEmail: string;
  username: string;
  displayName: string;
  light: boolean;
  compact?: boolean;
}

export const ContactFormWidget: React.FC<ContactFormWidgetProps> = ({
  contactEmail,
  username,
  displayName,
  light,
  compact = false,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const trimmedEmail = (contactEmail || '').trim();
  const hasValidReceiver = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  const mailtoHref = `mailto:${encodeURIComponent(trimmedEmail)}?subject=${encodeURIComponent(
    `Message from ${senderName || 'Visitor'} via LinkSphere (@${username})`
  )}&body=${encodeURIComponent(
    `Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidReceiver) {
      setStatus('error');
      setErrorText('Receiver email সেট করা নেই। Widgets ট্যাবে গিয়ে আপনার ইমেইল দিন।');
      return;
    }

    setStatus('sending');
    setErrorText('');

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(trimmedEmail)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: senderName,
            email: senderEmail,
            message,
            _subject: `New Message from ${senderName} (@${username})`,
            _template: 'table',
            _captcha: 'false',
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true || !data.error)) {
        setStatus('sent');
        setSenderName('');
        setSenderEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorText(
          data.message ||
            'ইমেইল সার্ভারে পাঠানো যায়নি। নিচের Email App বাটন দিয়ে সরাসরি পাঠাতে পারেন।'
        );
      }
    } catch {
      setStatus('error');
      setErrorText('নেটওয়ার্ক সমস্যার কারণে পাঠানো যায়নি। নিচের Email App বাটন ব্যবহার করুন।');
    }
  };

  return (
    <div
      className={`${compact ? 'mt-5 p-3.5' : 'mt-6 p-4'} rounded-2xl backdrop-blur-md border text-left ${
        light ? 'bg-white/85 border-slate-200 shadow-sm' : 'bg-white/10 border-white/15'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5 min-w-0">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <Mail className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-indigo-400 shrink-0`} />
          <span
            className={`${compact ? 'text-xs' : 'text-sm'} font-semibold ${
              light ? 'text-slate-900' : 'text-white'
            }`}
          >
            Send Direct Message
          </span>
        </div>
        {hasValidReceiver && (
          <span
            className={`text-[10px] font-mono truncate min-w-0 ${
              light ? 'text-slate-500' : 'text-white/55'
            }`}
            title={`Delivers to ${trimmedEmail}`}
          >
            → {trimmedEmail}
          </span>
        )}
      </div>

      {status === 'sent' ? (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-center space-y-1.5">
          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
          <p className={`text-xs font-semibold ${light ? 'text-emerald-900' : 'text-emerald-200'}`}>
            মেসেজ পাঠানো হয়েছে! ({trimmedEmail})
          </p>
          <p className={`text-[11px] leading-relaxed ${light ? 'text-emerald-800/80' : 'text-emerald-200/80'}`}>
            প্রথমবার হলে {trimmedEmail} ইনবক্স/Spam চেক করে FormSubmit কনফার্মেশন লিংকটি ১ বার অ্যাক্টিভেট করে নিন।
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          {status === 'error' && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/30 space-y-1.5">
              <div className="flex items-start gap-1.5 text-[11px] text-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                <span className={light ? 'text-rose-800' : 'text-rose-200'}>{errorText}</span>
              </div>
              {hasValidReceiver && (
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:underline"
                >
                  <span>Open Email App ({trimmedEmail})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your Name / আপনার নাম"
            required
            className={`w-full px-3 ${
              compact ? 'py-1.5 text-xs rounded-lg' : 'py-2 text-sm rounded-xl'
            } border outline-none focus:border-indigo-400 ${
              light
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-black/30 border-white/20 text-white placeholder:text-white/40'
            }`}
          />
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Your Email / আপনার ইমেইল"
            required
            className={`w-full px-3 ${
              compact ? 'py-1.5 text-xs rounded-lg' : 'py-2 text-sm rounded-xl'
            } border outline-none focus:border-indigo-400 ${
              light
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-black/30 border-white/20 text-white placeholder:text-white/40'
            }`}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${displayName}...`}
            rows={compact ? 2 : 3}
            required
            className={`w-full px-3 ${
              compact ? 'py-1.5 text-xs rounded-lg' : 'py-2 text-sm rounded-xl'
            } border outline-none focus:border-indigo-400 resize-none ${
              light
                ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                : 'bg-black/30 border-white/20 text-white placeholder:text-white/40'
            }`}
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`w-full ${
              compact ? 'py-1.5 text-xs rounded-lg' : 'py-2.5 text-sm rounded-xl'
            } bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition`}
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
