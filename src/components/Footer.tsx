export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="webring">
        <span className="webring-label">[ Lamb Web Ring ]</span>
        <div className="webring-nav">
          <a href="#" className="webring-link">← Prev</a>
          <span className="webring-divider">|</span>
          <a href="#" className="webring-link">Random</a>
          <span className="webring-divider">|</span>
          <a href="#" className="webring-link">Next →</a>
        </div>
      </div>
      <div className="footer-badges">
        <span className="badge">Made with 💖</span>
        <span className="badge">HTML</span>
        <span className="badge">No AI was harmed</span>
        <span className="badge">Y2K Ready</span>
      </div>
      <div className="footer-divider">
        ·.:*~★~*:.· ·.:*~★~*:.· ·.:*~★~*:.·
      </div>
      <p className="copyright">
        © 1997-{new Date().getFullYear()} LambLollipops™ — All Rights Reserved
      </p>
      <p className="footer-email">
        📧 webmaster@lamblollipops.com
      </p>
      <p className="footer-disclaimer">
        This site is not affiliated with any real lambs or lollipops.
        <br />
        No lambs were harmed in the making of this website.
      </p>
    </footer>
  )
}
