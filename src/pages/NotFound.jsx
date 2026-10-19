import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="inner-page page-gutter not-found-page">
      <div className="page-kicker">
        <span>ERROR / 404</span>
        <Link to="/">Back to home <ArrowUpRight size={14} /></Link>
      </div>
      <section className="not-found-content" aria-labelledby="not-found-title">
        <span className="eyebrow"><span className="eyebrow-dot" /> A LITTLE OFF THE MAP</span>
        <h1 id="not-found-title">This page took<br /><em>a different turn.</em></h1>
        <p>The link may be old, or the page may have moved. Let's get you back to something good.</p>
        <div className="not-found-actions">
          <Link className="button button-primary" to="/work"><ArrowLeft size={16} /> Explore selected work</Link>
          <Link className="button button-text" to="/">Go to homepage <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
