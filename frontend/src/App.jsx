import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

const navItems = [
  ['Home', '/'],
  ['Courses', '/courses'],
  ['About Us', '/about'],
  ['Gallery', '/gallery'],
  ['Achievements', '/achievements'],
  ['Timetable', '/timetable'],
  ['Admission', '/admission'],
  ['Contact', '/contact'],
];

function csrfToken() {
  return document.cookie.split('; ').find((part) => part.startsWith('csrftoken='))?.split('=').slice(1).join('=') || '';
}

async function sendForm(url, values) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken() },
    body: JSON.stringify(values),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : 'Please check the form and try again.');
  return result;
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/public/', { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error('Unable to load academy information.');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <main className="load-state">
        <h1>Greentrack Martial Arts</h1>
        <p>{error}</p>
        <button className="btn-dojo-primary" onClick={() => location.reload()}>Try again</button>
      </main>
    );
  }
  if (!data) {
    return (
      <main className="load-state">
        <span className="loader" />
        <p>Loading the dojo…</p>
      </main>
    );
  }
  return <Site data={data} />;
}

function Site({ data }) {
  const settings = data.settings || {};
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerClass = [
    isHome ? 'gt-header-hero' : 'gt-header-sticky',
    scrolled ? 'gt-header-scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="site" style={{ '--red': settings.action_color || '#E51E2A', '--gold': settings.accent_color || '#E6A23C' }}>
      <header id="gtMainHeader" className={headerClass}>
        <nav className={`nav wrap ${isHome ? 'gt-navbar-hero' : 'gt-navbar-inner'}`} aria-label="Main navigation">
          <Link className="brand" to="/">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.academy_name || 'Greentrack'} />
            ) : (
              <span className="brand-mark">GT</span>
            )}
            <span>
              {settings.academy_name || 'Greentrack Martial Arts'}
              <small>MARTIAL ARTS ACADEMY</small>
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map(([label, href]) => (
              <NavLink key={href} to={href} end={href === '/'}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="nav-cta-slot">
            {isHome && !scrolled ? (
              <Link className="gt-nav-admission-badge" to="/admission">
                <span>Admissions Open</span>
              </Link>
            ) : (
              <Link className="btn-dojo-nav nav-cta" to="/admission">
                <span>Join Now</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/courses" element={<Courses data={data} />} />
          <Route path="/courses/:slug" element={<CourseDetail data={data} />} />
          <Route path="/about" element={<About data={data} />} />
          <Route path="/gallery" element={<Gallery data={data} />} />
          <Route path="/achievements" element={<Achievements data={data} />} />
          <Route path="/timetable" element={<Timetable data={data} />} />
          <Route path="/admission" element={<Admission data={data} />} />
          <Route path="/contact" element={<Contact data={data} />} />
          <Route
            path="/privacy"
            element={
              <SimplePage
                title="Privacy"
                text={settings.privacy_notice || 'We use your information only to respond to your enquiry or manage admission.'}
              />
            }
          />
          <Route
            path="*"
            element={<SimplePage title="Page not found" text="This page may have moved. Use the navigation to find your way back." />}
          />
        </Routes>
      </main>

      <Footer data={data} />

      {settings.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp}?text=Hello%20Greentrack%20Martial%20Arts%2C%20I%20would%20like%20to%20book%20a%20trial%20class.`}
          target="_blank"
          rel="noopener noreferrer"
          className="gt-floating-wa"
          aria-label="Chat on WhatsApp"
        >
          <span className="gt-wa-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44zM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.88 9.88 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.89-9.89 9.89zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
            </svg>
          </span>
          <span>WhatsApp Us</span>
        </a>
      )}
    </div>
  );
}

function Hero({ data }) {
  const settings = data.settings || {};
  return (
    <section className="gt-hero">
      <img
        src="/static/images/hero-dojo-bg.jpg?v=20261127l"
        alt={`${settings.academy_name || 'Greentrack'} — Traditional Dojo`}
        className="gt-hero-bg"
      />
      <div className="gt-hero-overlay" />

      <div className="gt-hero-samurai-wrap" aria-hidden="true">
        <img
          src="/static/images/hero-sensei-kick.png?v=20261127l"
          alt=""
          className="gt-hero-samurai"
        />
      </div>

      <div className="gt-wind-layer" aria-hidden="true">
        <span className="gt-wind-streak gt-wind-1" />
        <span className="gt-wind-streak gt-wind-2" />
        <span className="gt-wind-streak gt-wind-3" />
        <span className="gt-wind-streak gt-wind-4" />
        <span className="gt-wind-clash" />
      </div>

      <div className="wrap gt-hero-content">
        <div className="gt-hero-col">
          <h1 className="gt-kensei-title">
            <span className="gt-kensei-top gt-anim-left-1">MASTER THE MIND</span>
            <span className="gt-kensei-red gt-anim-left-2">COMMAND THE BODY</span>
          </h1>

          <div className="gt-kensei-meta gt-anim-left-3">
            <div>
              <div className="gt-hero-styles-tag">
                KARATE &bull; KICKBOXING &bull; SELF-DEFENCE
              </div>
              <p className="gt-kensei-caption">
                THE MARTIAL ARTS<br />ACADEMY &bull; KOZHIKODE
              </p>
            </div>
            <div className="gt-kensei-divider" />
            <div>
              <p className="gt-kensei-caption gt-kensei-caption-bright">
                DISCIPLINE, SELF-DEFENCE<br />FOR KIDS, TEENS &amp; ADULTS
              </p>
            </div>
          </div>

          <div className="gt-hero-cta-row gt-anim-left-4">
            <Link to="/admission" className="btn-dojo-primary">
              <span>Join Now</span>
              <span className="btn-arrow" aria-hidden="true">&rarr;</span>
            </Link>
            <Link to="/admission" className="btn-dojo-secondary">
              <span>Book a Free Trial Class</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="gt-hero-proof-strip">
        <div className="wrap gt-proof-grid">
          <div className="gt-proof-item">
            <span className="gt-proof-num">10+</span>
            <span className="gt-proof-label">Years of Coaching Excellence</span>
          </div>
          <div className="gt-proof-item">
            <span className="gt-proof-num">500+</span>
            <span className="gt-proof-label">Students Trained</span>
          </div>
          <div className="gt-proof-item">
            <span className="gt-proof-num">4</span>
            <span className="gt-proof-label">Core Disciplines</span>
          </div>
          <div className="gt-proof-item">
            <span className="gt-proof-num">100+</span>
            <span className="gt-proof-label">State &amp; National Medals</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScrollDisciplineStory({ courses }) {
  const pillars = useMemo(() => {
    const pick = (kw, fallback) =>
      courses.find((c) => `${c.name} ${c.discipline}`.toLowerCase().includes(kw)) || fallback;
    return [
      {
        key: 'karate',
        big: 'KARATE',
        tag: 'TRADITIONAL SHOTOKAN',
        desc: 'Crisp linear strikes, deep stances, kata precision, and structured belt grading from white to black belt.',
        elements: ['Kata & Form Mastery', 'Kumite Sparring', 'Belt Grading Pathway'],
        meta: ['Ages 5–Adults', 'All Belt Levels', 'Evening Batches'],
        course: pick('karate', courses[0]),
      },
      {
        key: 'kungfu',
        big: 'KUNG FU',
        tag: 'FLUID POWER & AGILITY',
        desc: 'Flowing traditional forms, dynamic footwork, flexibility, and coordinated striking rooted in classical technique.',
        elements: ['Traditional Forms', 'Flexibility & Stances', 'Speed & Reflexes'],
        meta: ['Ages 8–Adults', 'All Levels', 'Areekkad Dojo'],
        course: pick('kung', courses[2] || courses[0]),
      },
      {
        key: 'boxing',
        big: 'BOXING',
        tag: 'FOOTWORK & CONDITIONING',
        desc: 'Technical jab-cross combinations, defensive guard, heavy-bag power, and high-tempo athletic conditioning.',
        elements: ['Jab-Cross Combos', 'Heavy Bag & Pad Work', 'Ring Footwork'],
        meta: ['Ages 14–Adults', 'Beginner to Pro', 'High Conditioning'],
        course: pick('box', courses[1] || courses[0]),
      },
      {
        key: 'defence',
        big: 'SELF-DEFENCE',
        tag: 'REAL-WORLD CONFIDENCE',
        desc: 'Practical situational awareness, escapes, and calm under pressure for kids, teens, and adults.',
        elements: ['Grip & Hold Escapes', 'Situational Awareness', 'Close-Range Defence'],
        meta: ['Teens & Adults', 'Practical Focus', 'Certified Coaches'],
        course: pick('defence', courses[3] || courses[0]),
      },
    ];
  }, [courses]);

  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let rafId = 0;
    const updateFromScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const idx = Math.min(pillars.length - 1, Math.floor(progress * pillars.length));
      setActiveIdx(idx);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pillars.length]);

  const jumpToIndex = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const targetTop = window.scrollY + el.getBoundingClientRect().top + (idx / pillars.length) * scrollable + 8;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  return (
    <section className="gt-scroll-track" ref={trackRef}>
      <div className="gt-scroll-sticky-view">
        <div className="wrap gt-scroll-single-grid">
          <div className="gt-scroll-list-panel">
            <p className="eyebrow" style={{ color: '#E6A23C', marginBottom: '1rem' }}>
              SCROLL TO EXPLORE &bull; 0{activeIdx + 1} / 0{pillars.length}
            </p>
            <div className="gt-scroll-list-stack">
              {pillars.map((item, idx) => {
                const isActive = activeIdx === idx;
                const itemSkills = (item.course?.skills && item.course.skills.length)
                  ? item.course.skills.slice(0, 3)
                  : item.elements;
                return (
                  <div
                    key={item.key}
                    onClick={() => jumpToIndex(idx)}
                    className={`gt-scroll-list-item ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="gt-scroll-num">0{idx + 1}</span>
                    <div className="gt-scroll-item-body">
                      <h2 className="gt-scroll-list-title">{item.big}</h2>
                      <div className="gt-scroll-expand">
                        <div className="gt-scroll-expand-inner">
                          <p className="gt-scroll-list-desc">{item.desc}</p>
                          <div className="gt-scroll-elements">
                            {itemSkills.map((el) => (
                              <span key={el} className="gt-scroll-skill-chip">{el}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="gt-scroll-right-panel">
            <div className="gt-scroll-visual-stack">
              {pillars.map((item, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={item.key}
                    className={`gt-scroll-visual-card ${isActive ? 'is-active' : ''}`}
                    aria-hidden={!isActive}
                  >
                    {item.course?.image && (
                      <img src={item.course.image} alt={item.big} className="gt-scroll-visual-img" />
                    )}
                    <div className="gt-scroll-visual-overlay" />
                    <div className="gt-scroll-visual-body">
                      <div className="gt-scroll-meta-row" style={{ marginBottom: '0.75rem' }}>
                        <span className="gt-badge-discipline" style={{ position: 'static', display: 'inline-block' }}>
                          {item.tag}
                        </span>
                        {item.meta.map((m) => (
                          <span key={m} className="gt-scroll-meta-pill">{m}</span>
                        ))}
                      </div>
                      <h3>{item.course?.name || item.big}</h3>
                      <p>{item.course?.summary || item.desc}</p>
                      {item.course && (
                        <Link className="btn-dojo-primary" to={`/courses/${item.course.slug}`}>
                          <span>Explore {item.big}</span>
                          <span className="btn-arrow">&rarr;</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DisciplineRotatingCards({ courses }) {
  const [flipped, setFlipped] = useState({});
  const cards = courses.slice(0, 4);
  if (!cards.length) return null;

  return (
    <section className="gt-section gt-section-light">
      <div className="wrap">
        <SectionHead
          kicker="INTERACTIVE DOJO CARDS"
          title="Hover or Tap to Flip Each Discipline"
          link="/courses"
          linkText="All Programmes"
        />
        <div className="gt-flip-grid">
          {cards.map((course) => {
            const isFlipped = !!flipped[course.id];
            return (
              <div
                key={course.id}
                className={`gt-flip-card ${isFlipped ? 'is-flipped' : ''}`}
                onClick={() => setFlipped((prev) => ({ ...prev, [course.id]: !prev[course.id] }))}
              >
                <div className="gt-flip-inner">
                  <div className="gt-flip-front">
                    {course.image && <img src={course.image} alt={course.name} />}
                    <div className="gt-flip-front-overlay" />
                    <span className="gt-badge-discipline">{course.discipline}</span>
                    <div className="gt-flip-front-body">
                      <small>{course.age_group}</small>
                      <h3>{course.name}</h3>
                      <span className="gt-flip-hint">Hover / Tap to Flip &circlearrowright;</span>
                    </div>
                  </div>
                  <div className="gt-flip-back">
                    <span className="eyebrow" style={{ color: '#E6A23C' }}>{course.discipline}</span>
                    <h3>{course.name}</h3>
                    <p>{course.summary}</p>
                    <ul className="gt-flip-skills">
                      {(course.skills || []).slice(0, 3).map((sk) => (
                        <li key={sk}>{sk}</li>
                      ))}
                    </ul>
                    <div className="gt-flip-back-foot">
                      <span>{course.fee ? `${course.currency}${course.fee} ${course.fee_period}` : course.level}</span>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="btn-dojo-primary"
                        style={{ padding: '9px 16px', fontSize: '0.8rem' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Details</span>
                        <span className="btn-arrow">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home({ data }) {
  const featured = data.courses.filter((c) => c.featured).slice(0, 3);
  const courses = featured.length ? featured : data.courses.slice(0, 3);
  const headCoach = data.instructors?.[0];
  const topAchievements = (data.achievements || []).slice(0, 3);

  return (
    <>
      <Hero data={data} />

      <section className="gt-section">
        <div className="wrap">
          <SectionHead kicker="TRAINING PROGRAMMES" title="Core Training Disciplines" link="/courses" linkText="View All Courses" />
          <div className="card-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <ScrollDisciplineStory courses={data.courses || []} />

      <DisciplineRotatingCards courses={data.courses || []} />

      {headCoach && (
        <section className="statement">
          <div className="wrap gt-coach-spotlight">
            {headCoach.photo && (
              <div className="gt-coach-spotlight-img">
                <img src={headCoach.photo} alt={headCoach.name} />
              </div>
            )}
            <div className="statement-inner">
              <p className="eyebrow" style={{ color: '#E6A23C' }}>MEET OUR HEAD COACH</p>
              <h2>{headCoach.name}</h2>
              <p style={{ color: '#E6A23C', fontWeight: 600, margin: '0.5rem 0 1rem' }}>
                {headCoach.role} &bull; {headCoach.rank} &bull; {headCoach.experience}
              </p>
              <p>{headCoach.biography}</p>
              <Link className="text-link" to="/about">Meet Full Instructor Team <span>&rarr;</span></Link>
            </div>
          </div>
        </section>
      )}

      {topAchievements.length > 0 && (
        <section className="gt-section">
          <div className="wrap">
            <SectionHead kicker="AWARDS & RECOGNITION" title="Academy Achievements" link="/achievements" linkText="All Achievements" />
            <div className="card-grid">
              {topAchievements.map((a) => (
                <article className="course-card" key={`${a.title}-${a.date}`}>
                  {a.image && (
                    <div className="course-image-wrap">
                      <img className="course-image" src={a.image} alt={a.title} />
                      <span className="gt-badge-discipline">{a.award}</span>
                    </div>
                  )}
                  <div className="course-body">
                    <div className="course-meta">
                      <span>{new Date(a.date).getFullYear()}</span>
                      <span>{a.event}</span>
                    </div>
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="gt-section gt-section-light">
        <div className="wrap">
          <SectionHead kicker="ON THE MAT" title="A glimpse inside the dojo." link="/gallery" linkText="View the gallery" />
          <GalleryStrip items={data.gallery.slice(0, 3)} />
        </div>
      </section>

      <section className="gt-cta-band">
        <div className="wrap trial-inner">
          <div>
            <p className="eyebrow" style={{ color: '#E6A23C' }}>BEGIN WITH CONFIDENCE</p>
            <h2>Start Your Training Journey Today</h2>
          </div>
          <div className="gt-hero-cta-row">
            <Link className="btn-dojo-primary" to="/admission">
              <span>Apply Online</span>
              <span className="btn-arrow">&rarr;</span>
            </Link>
            {data.settings?.whatsapp && (
              <a
                className="btn-dojo-secondary"
                href={`https://wa.me/${data.settings.whatsapp}?text=Hello%20Greentrack%20Martial%20Arts`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>WhatsApp Enquiry</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ kicker, title, link, linkText }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {linkText} <span>&rarr;</span>
        </Link>
      )}
    </div>
  );
}

function PageIntro({ kicker, title, text }) {
  return (
    <section className="page-intro">
      <div className="wrap">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}

function CourseCard({ course }) {
  return (
    <article className="course-card">
      {course.image && (
        <div className="course-image-wrap">
          <img className="course-image" src={course.image} alt={course.name} />
          <span className="gt-badge-discipline">{course.discipline}</span>
        </div>
      )}
      <div className="course-body">
        <div className="course-meta">
          <span>{course.age_group}</span>
          <span>{course.level}</span>
        </div>
        <h3>{course.name}</h3>
        <p>{course.summary}</p>
        <div className="course-foot">
          <span>{course.fee ? `${course.currency}${course.fee} ${course.fee_period}` : course.level}</span>
          <Link to={`/courses/${course.slug}`} aria-label={`Explore ${course.name}`}>
            Explore <b>&rarr;</b>
          </Link>
        </div>
      </div>
    </article>
  );
}

function Courses({ data }) {
  const [term, setTerm] = useState('');
  const filtered = data.courses.filter((c) => `${c.name} ${c.discipline} ${c.age_group}`.toLowerCase().includes(term.toLowerCase()));
  return (
    <>
      <PageIntro kicker="TRAIN WITH PURPOSE" title="Find your discipline." text="From a first class to your next grade, find a programme that fits your goals." />
      <section className="gt-section">
        <div className="wrap">
          <label className="search-label">
            Search programmes
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Try karate, kids, boxing…" />
          </label>
          <div className="card-grid">
            {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          {!filtered.length && <p>No courses match that search.</p>}
        </div>
      </section>
    </>
  );
}

function CourseDetail({ data }) {
  const { slug } = useParams();
  const c = data.courses.find((item) => item.slug === slug);
  if (!c) return <SimplePage title="Programme not found" text="Explore all current courses and find a different class." />;
  return (
    <>
      <PageIntro kicker={c.discipline} title={c.name} text={c.summary} />
      <section className="gt-section">
        <div className="wrap detail-grid">
          <div>
            <p className="body-copy">{c.description}</p>
            <h2>Skills you will build</h2>
            <ul className="skill-list">
              {c.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
          <aside className="detail-card">
            <p className="eyebrow">PROGRAMME DETAILS</p>
            <p><b>Age group</b><span>{c.age_group}</span></p>
            <p><b>Level</b><span>{c.level}</span></p>
            <p><b>Schedule</b><span>{c.frequency} &middot; {c.duration}</span></p>
            {c.fee && <p><b>Tuition</b><span>{c.currency}{c.fee} {c.fee_period}</span></p>}
            <Link className="btn-dojo-primary" style={{ width: '100%', marginTop: '12px' }} to={`/admission?course=${c.id}`}>
              <span>Book a trial</span>
              <span className="btn-arrow">&rarr;</span>
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

function About({ data }) {
  return (
    <>
      <PageIntro kicker="OUR DOJO" title="Tradition with a purpose." text="A welcoming place to learn, grow and find your own strength." />
      <section className="gt-section">
        <div className="wrap two-column">
          <div>
            <p className="eyebrow">OUR STORY</p>
            <p className="body-copy">{data.settings?.story}</p>
            <h2>How we train</h2>
            <p className="body-copy">{data.settings?.philosophy}</p>
          </div>
          <div className="coach-list">
            <p className="eyebrow">THE COACHING TEAM</p>
            {data.instructors.map((i) => (
              <article className="coach" key={i.name}>
                {i.photo && <img src={i.photo} alt={i.name} />}
                <div>
                  <h3>{i.name}</h3>
                  <p>{i.role} &middot; {i.rank}</p>
                  <small>{i.experience} &middot; {i.disciplines}</small>
                  <p>{i.biography}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function GalleryStrip({ items }) {
  return (
    <div className="gallery-grid">
      {items.map((item, i) => (
        <article className={`gallery-tile tile-${i}`} key={item.title + i}>
          {item.image && <img src={item.image} alt={item.caption || item.title} />}
          <div>
            <small>{item.category}</small>
            <h3>{item.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}

function Gallery({ data }) {
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...data.categories.map((c) => c.name)], [data.categories]);
  const items = category === 'All' ? data.gallery : data.gallery.filter((g) => g.category === category);
  return (
    <>
      <PageIntro kicker="LIFE AT GREENTRACK" title="The dojo, in motion." text="Training days, milestones and moments from our community." />
      <section className="gt-section">
        <div className="wrap">
          <div className="filters">
            {categories.map((name) => (
              <button className={category === name ? 'filter active' : 'filter'} key={name} onClick={() => setCategory(name)}>
                {name}
              </button>
            ))}
          </div>
          <GalleryStrip items={items} />
          {!items.length && <p>New moments from the mat are coming soon.</p>}
        </div>
      </section>
    </>
  );
}

function Achievements({ data }) {
  return (
    <>
      <PageIntro kicker="MOMENTS THAT MATTER" title="Progress worth celebrating." text="Every grade and every breakthrough tells a story of commitment." />
      <section className="gt-section">
        <div className="wrap">
          <div className="achievement-list">
            {data.achievements.map((a) => (
              <article className="achievement" key={`${a.title}-${a.date}`}>
                {a.image && <img src={a.image} alt={a.title} />}
                <div>
                  <p className="eyebrow">{new Date(a.date).getFullYear()} &middot; {a.event}</p>
                  <h2>{a.title}</h2>
                  <p>{a.description}</p>
                  {a.person && <b>{a.person}</b>}
                </div>
                <span className="award">{a.award}</span>
              </article>
            ))}
          </div>
          {!data.achievements.length && <p>Our next milestones are on the way.</p>}
        </div>
      </section>
    </>
  );
}

function Timetable({ data }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <>
      <PageIntro kicker="PLAN YOUR WEEK" title="Class timetable." text="Find a time that works for you. Every class includes coaching for your level." />
      <section className="gt-section">
        <div className="wrap">
          <div className="schedule-grid">
            {days.map((day) => (
              <article className="day-card" key={day}>
                <h2>{day}</h2>
                {data.sessions
                  .filter((s) => s.weekday === day)
                  .map((s) => (
                    <div className="session" key={`${day}-${s.start}-${s.course}`}>
                      <small>{s.start}–{s.end}</small>
                      <b>{s.course}</b>
                      <span>{s.age_group || s.instructor}</span>
                    </div>
                  ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FormMessage({ message, error }) {
  if (!message && !error) return null;
  return <p className={error ? 'form-message error' : 'form-message'} role="status">{error || message}</p>;
}

function Admission({ data }) {
  const params = new URLSearchParams(location.search);
  const defaultCourse = params.get('course') || '';
  const defaultEmail = params.get('email') || '';
  const [form, setForm] = useState({
    student_name: '',
    date_of_birth: '',
    guardian_name: '',
    phone: '',
    email: defaultEmail,
    course: defaultCourse,
    preferred_time: '',
    experience: 'None / Complete Beginner',
    message: '',
    consent_given: false,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await sendForm('/api/applications/', form);
      setMessage(`Thanks. Your application reference is ${result.reference}. Our team will be in touch.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro kicker="START HERE" title="Book your first class." text="Tell us a little about the student and we’ll help you find the right class." />
      <section className="gt-section">
        <div className="wrap form-layout">
          <form className="form-card" onSubmit={submit}>
            <div className="form-grid">
              <Field label="Student name"><input name="student_name" value={form.student_name} onChange={change} required /></Field>
              <Field label="Date of birth"><input type="date" name="date_of_birth" value={form.date_of_birth} onChange={change} required /></Field>
              <Field label="Parent or guardian (if under 18)"><input name="guardian_name" value={form.guardian_name} onChange={change} /></Field>
              <Field label="Phone"><input name="phone" type="tel" value={form.phone} onChange={change} required /></Field>
              <Field label="Email (optional)"><input name="email" type="email" value={form.email} onChange={change} /></Field>
              <Field label="Programme">
                <select name="course" value={form.course} onChange={change} required>
                  <option value="">Choose a course</option>
                  {data.courses.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Preferred days or time"><input name="preferred_time" value={form.preferred_time} onChange={change} /></Field>
              <Field label="Previous experience">
                <select name="experience" value={form.experience} onChange={change}>
                  {['None / Complete Beginner', 'Less than 1 Year', '1–3 Years', '3+ Years / Graded Belt'].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Anything else?" wide><textarea name="message" rows="4" value={form.message} onChange={change} /></Field>
            </div>
            <label className="consent">
              <input type="checkbox" name="consent_given" checked={form.consent_given} onChange={change} required />
              I agree that Greentrack may contact me about this application.
            </label>
            <FormMessage message={message} error={error} />
            <button className="btn-dojo-primary" disabled={busy}>
              <span>{busy ? 'Sending…' : 'Send application'}</span>
              <span className="btn-arrow">&rarr;</span>
            </button>
          </form>

          <aside className="form-aside">
            <p className="eyebrow">WHAT HAPPENS NEXT</p>
            <h2>We’ll take it from here.</h2>
            <p>Our team will contact you to answer questions and arrange a trial class that fits your schedule.</p>
            <a className="text-link" href={`https://wa.me/${data.settings?.whatsapp}`}>Prefer WhatsApp? <span>&rarr;</span></a>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({ label, wide, children }) {
  return (
    <label className={`field ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Contact({ data }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await sendForm('/api/enquiries/', form);
      setMessage('Your message has reached our team. We’ll reply shortly.');
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro kicker="COME SAY HELLO" title="Let’s talk training." text="Questions about classes, schedules or getting started? We’re happy to help." />
      <section className="gt-section">
        <div className="wrap contact-layout">
          <div className="contact-details">
            <p><b>Call the dojo</b><a href={`tel:${data.settings?.phone}`}>{data.settings?.phone}</a></p>
            <p><b>Email</b><a href={`mailto:${data.settings?.email}`}>{data.settings?.email}</a></p>
            <p><b>Visit us</b><span>{data.settings?.address}</span></p>
            <p><b>Hours</b><span>{data.settings?.opening_hours}</span></p>
            {data.settings?.map_url && (
              <a className="text-link" href={data.settings.map_url} target="_blank" rel="noreferrer">
                Get directions <span>&rarr;</span>
              </a>
            )}
          </div>
          <form className="form-card" onSubmit={submit}>
            <div className="form-grid">
              <Field label="Your name"><input name="name" value={form.name} onChange={change} required /></Field>
              <Field label="Phone"><input name="phone" type="tel" value={form.phone} onChange={change} required /></Field>
              <Field label="Email (optional)"><input name="email" type="email" value={form.email} onChange={change} /></Field>
              <Field label="Subject"><input name="subject" value={form.subject} onChange={change} required /></Field>
              <Field label="Message" wide><textarea name="message" rows="5" value={form.message} onChange={change} required /></Field>
            </div>
            <FormMessage message={message} error={error} />
            <button className="btn-dojo-primary" disabled={busy}>
              <span>{busy ? 'Sending…' : 'Send message'}</span>
              <span className="btn-arrow">&rarr;</span>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function SimplePage({ title, text }) {
  return (
    <section className="page-intro">
      <div className="wrap">
        <p className="eyebrow">GREENTRACK MARTIAL ARTS</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <Link className="btn-dojo-primary" to="/" style={{ marginTop: '18px' }}>
          <span>Back to home</span>
          <span className="btn-arrow">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

function Footer({ data }) {
  const s = data.settings || {};
  const [trialEmail, setTrialEmail] = useState('');
  const navigate = useNavigate();

  function handleTrialSubmit(e) {
    e.preventDefault();
    const query = trialEmail.trim() ? `?email=${encodeURIComponent(trialEmail.trim())}` : '';
    navigate(`/admission${query}`);
  }

  const instaHandle = (() => {
    const raw = (s.instagram_url || '').replace(/\/+$/, '').split('/').pop();
    return raw && raw !== 'instagram.com' ? (raw.startsWith('@') ? raw : `@${raw}`) : '@greentrackmartialarts';
  })();
  const ytName = (() => {
    const raw = (s.youtube_url || '').replace(/\/+$/, '').split('/').pop();
    return raw && raw !== 'youtube.com' ? raw : 'Greentrack Martial Arts';
  })();
  const wpDisplay = s.phone || (s.whatsapp ? `+${s.whatsapp}` : '+91 98765 43210');
  const wpHref = `https://wa.me/${s.whatsapp || '919876543210'}?text=Hello%20Greentrack%20Martial%20Arts`;
  const mailDisplay = s.email || 'admissions@greentrackmartialarts.in';

  return (
    <footer className="gt-liquid-footer">
      <div className="gt-footer-ambient" aria-hidden="true">
        <span className="gt-footer-orb gt-footer-orb-1" />
        <span className="gt-footer-orb gt-footer-orb-2" />
      </div>

      <div className="gt-footer-glass-shell">
        <div className="wrap">
          <div className="gt-footer-top-grid">
            <div className="gt-footer-brand-col">
              <div className="gt-footer-brand-row">
                {s.logo ? (
                  <img src={s.logo} alt={s.academy_name || 'Greentrack'} className="gt-footer-logo-img" />
                ) : (
                  <span className="brand-mark gt-footer-brand-mark">GT</span>
                )}
                <span className="gt-footer-brand-name">{s.academy_name || 'GREENTRACK MARTIAL ARTS'}</span>
              </div>
              <h3 className="gt-footer-headline">Master the mind.<br />Command the body.</h3>
              <form onSubmit={handleTrialSubmit} className="gt-footer-pill-form">
                <input
                  type="email"
                  value={trialEmail}
                  onChange={(e) => setTrialEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email for trial enquiry"
                  className="gt-footer-pill-input"
                />
                <button type="submit" className="gt-footer-pill-btn">Book Trial</button>
              </form>
              <p className="gt-footer-micro">Free introductory trial &bull; {s.opening_hours || '6:30 PM onwards'}</p>
            </div>

            <div className="gt-footer-nav-card">
              <div className="gt-footer-contact-grid">
                <a
                  href={s.instagram_url || 'https://instagram.com/greentrackmartialarts'}
                  target="_blank"
                  rel="noreferrer"
                  className="gt-footer-contact-item"
                >
                  <span className="gt-contact-icon gt-icon-insta" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </span>
                  <span className="gt-contact-text">
                    <small>Instagram</small>
                    <strong>{instaHandle}</strong>
                  </span>
                </a>

                <a
                  href={s.youtube_url || 'https://youtube.com/@greentrackmartialarts'}
                  target="_blank"
                  rel="noreferrer"
                  className="gt-footer-contact-item"
                >
                  <span className="gt-contact-icon gt-icon-yt" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                    </svg>
                  </span>
                  <span className="gt-contact-text">
                    <small>YouTube</small>
                    <strong>{ytName}</strong>
                  </span>
                </a>

                <a
                  href={wpHref}
                  target="_blank"
                  rel="noreferrer"
                  className="gt-footer-contact-item"
                >
                  <span className="gt-contact-icon gt-icon-wp" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44zM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.88 9.88 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.89-9.89 9.89zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
                    </svg>
                  </span>
                  <span className="gt-contact-text">
                    <small>WhatsApp</small>
                    <strong>{wpDisplay}</strong>
                  </span>
                </a>

                <a
                  href={`mailto:${mailDisplay}`}
                  className="gt-footer-contact-item"
                >
                  <span className="gt-contact-icon gt-icon-mail" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <span className="gt-contact-text">
                    <small>Email</small>
                    <strong>{mailDisplay}</strong>
                  </span>
                </a>

                <a
                  href={s.map_url || 'https://www.google.com/maps/place/GREEN+TRACK+Kung-fu+Of+Karate/@11.2130988,75.8022759,17z'}
                  target="_blank"
                  rel="noreferrer"
                  className="gt-footer-contact-item gt-footer-location-wide"
                >
                  <span className="gt-contact-icon gt-icon-pin" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="gt-contact-text">
                    <small>Dojo Location (Open in Google Maps)</small>
                    <strong>{s.address || 'Near Arts College, Olavanna Road, Areekkad, Kozhikode, Kerala - 673027'}</strong>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="gt-footer-bottom-row">
            <div className="gt-footer-status-left">
              <span>&copy; {new Date().getFullYear()} {s.academy_name || 'Greentrack Martial Arts'}</span>
              <span className="gt-system-status">
                <span className="gt-green-dot" /> Admissions Open
              </span>
            </div>
          </div>
        </div>

        <div className="gt-footer-glass-wordmark" aria-hidden="true">GREEN TRACK</div>
      </div>
    </footer>
  );
}

export default App;
