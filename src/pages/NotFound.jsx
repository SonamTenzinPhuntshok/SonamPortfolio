import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <section className="section center-page">
      <p className="eyebrow">404</p>
      <h1 className="display">Lost in the <span className="grad">STeeverse.</span></h1>
      <Link className="btn btn-primary" to="/">Back home</Link>
    </section>
  )
}
