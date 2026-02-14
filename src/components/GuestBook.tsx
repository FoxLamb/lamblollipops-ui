const ENTRIES = [
  {
    name: 'xX_CyberLamb_Xx',
    date: 'Jan 15, 1997',
    message: 'Cool site!! Love the lamb!!! Added you to my webring 🐑',
    location: 'Cyberspace, USA',
  },
  {
    name: 'SurfDude99',
    date: 'Feb 02, 1997',
    message: 'Radical page dude! The music is AWESOME. Bookmarked!!',
    location: 'San Francisco, CA',
  },
  {
    name: 'PrincessSparkle',
    date: 'Mar 20, 1997',
    message: 'OMG this is the best page on the whole internet!!! ★★★★★',
    location: 'Tokyo, Japan',
  },
  {
    name: 'DarkWizard2000',
    date: 'Apr 11, 1997',
    message: 'Stumbled here from AltaVista. No regrets. The lamb speaks to me.',
    location: 'London, UK',
  },
  {
    name: 'L0llip0pQu33n',
    date: 'May 30, 1997',
    message: 'this page is SO cute!!! how do u make the stars move like that?? teach me!!',
    location: 'Portland, OR',
  },
  {
    name: 'Captain_Modem',
    date: 'Jul 04, 1997',
    message: 'Took 5 minutes to load on my 28.8k but WORTH IT. God bless America.',
    location: 'Houston, TX',
  },
]

export default function GuestBook() {
  return (
    <section className="section-box guestbook-section">
      <h2 className="section-title">~ Guestbook ~</h2>
      <p className="retro-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Sign my guestbook! (Not really, this is purely decorative 😄)
      </p>
      <div className="guestbook-entries">
        {ENTRIES.map((entry, i) => (
          <div key={i} className="guestbook-entry">
            <div className="entry-header">
              <span className="entry-name">{entry.name}</span>
              <span className="entry-date">{entry.date}</span>
            </div>
            <p className="entry-message">{entry.message}</p>
            <p className="entry-location">📍 {entry.location}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
