import { Link } from "wouter";

export default function NotFound() {
  return <div className="page"><section className="page-intro"><div><p className="eyebrow">SIGNAL LOST / <span>404</span></p><h1>WRONG<br /><span>ARENA.</span></h1></div><p className="page-intro__copy">That route is not part of the current dojo. Return to the command deck and choose a live training path.</p></section><div style={{ paddingTop: 38 }}><Link className="button button-primary" href="/">RETURN HOME</Link></div></div>;
}
