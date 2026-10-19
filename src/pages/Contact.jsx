import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Check, Copy, Mail, MoveUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '../data';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', kind: 'A new website', message: '' });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Project enquiry — ${form.kind}`);
    const body = encodeURIComponent(`Hi LIYAQAT,\n\n${form.message}\n\nA little about me: ${form.name}\nMy email: ${form.email}\nProject type: ${form.kind}\n`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };
  const copyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Keep the user on the contact page if clipboard permission is denied.
      setCopied(false);
      window.prompt('Copy this email address:', siteConfig.email);
    }
  };
  return (
    <main className="inner-page contact-page page-gutter">
      <div className="page-kicker"><span>THE BEGINNING OF SOMETHING</span><Link to="/work">See the work <ArrowUpRight size={14} /></Link></div>
      <motion.div className="contact-intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}><span className="eyebrow"><span className="eyebrow-dot" /> GOT A GOOD ONE?</span><h1>Let’s make<br /><em>something matter.</em></h1><p>A half-formed idea, a big brief, a small question — I’m happy to start wherever you are.</p></motion.div>
      <div className="contact-layout"><section className="contact-info"><span className="contact-info-label">THE DIRECT ROUTE</span><button className="contact-email-button" onClick={copyEmail}><span>{siteConfig.email}</span>{copied ? <Check size={18} /> : <Copy size={18} />}</button><span className="contact-hint">{copied ? 'Copied to clipboard' : 'Click to copy email address'}</span><div className="contact-rule"/><div className="contact-info-block"><span>BASED IN</span><p>{siteConfig.location}</p></div><div className="contact-info-block"><span>CURRENT STATUS</span><p><i className="contact-status-dot" /> {siteConfig.availability}</p></div><div className="contact-sticker"><span className="contact-sticker-star">✳</span><span>GOOD IDEAS<br />WELCOME HERE.</span><ArrowUpRight size={18} /></div><div className="contact-note"><Mail size={16} /><p>Prefer email? Write a few lines about what you have in mind and I’ll take it from there.</p></div></section>
        <motion.form className="contact-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12 }}><div className="form-heading"><span className="eyebrow">OR DROP A NOTE HERE</span><p>Just enough to get us started.</p></div><label>Your name<input name="name" autoComplete="name" maxLength={100} required value={form.name} onChange={update} placeholder="What should I call you?" /></label><label>Your email<input type="email" name="email" autoComplete="email" maxLength={254} required value={form.email} onChange={update} placeholder="you@example.com" /></label><label>What are you thinking about?<select name="kind" value={form.kind} onChange={update}><option>A new website</option><option>Brand identity or design</option><option>Motion or video</option><option>Creative partnership</option><option>Something else entirely</option></select></label><label>A little about the idea<textarea name="message" maxLength={5000} required value={form.message} onChange={update} rows="4" placeholder="The idea, the goal, the thing you can't stop thinking about…" /></label><button className="button button-primary form-submit" type="submit">Prepare your message <MoveUpRight size={17} /></button><span className="form-footnote">This opens your email app with a pre-filled draft. No information is sent from this website.</span></motion.form></div>
      <div className="contact-bottom-line"><span>NO PRESSURE. NO DECK REQUIRED.</span><Link to="/about">A little more about me <ArrowDownRight size={15} /></Link></div>
    </main>
  );
}
