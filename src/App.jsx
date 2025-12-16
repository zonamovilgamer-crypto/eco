import React, { useState, useEffect } from 'react';
import { Sprout, CloudSun, Droplets, ArrowRight, Menu, X, Calculator } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import sitemapData from '../sitemap.json';
import RecipesPage from './pages/Recipes';
import CalendarPage from './pages/Calendar';
import BlogPost from './pages/BlogPost';
import SubstrateCalculator from './pages/Calculator';

// Wrapper for Home Components
const Home = () => (
    <>
        <Hero />
        <InspirationGallery />
        <Features />
        <BlogSection />
        <GerminationTable />
    </>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="header-glass">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '90px' }}>
                <Link to="/" style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
                    <Sprout size={36} fill="var(--color-secondary)" strokeWidth={1.5} />
                    Tu Huertita
                </Link>

                <nav className="desktop-nav" style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/" className="nav-link">HOME</Link>
                    <Link to="/calendario" className="nav-link">CALENDARIO</Link>
                    <Link to="/calculadora" className="nav-link">CALCULADORA</Link>
                    <Link to="/recetas" className="nav-link">RECETARIO</Link>
                    <Link to="/blog/vermicompost" className="nav-link">BLOG</Link>

                    <a href="#" className="btn btn-primary" style={{ marginLeft: '1rem', padding: '12px 28px', fontSize: '1rem' }}>
                        Tienda Oficial
                    </a>
                </nav>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                    className="mobile-toggle"
                >
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>
            <style>{`
          @media(max-width: 900px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
          }
        `}</style>
        </header>
    );
};

const Hero = () => (
    <section className="section-padding" style={{ paddingBottom: '4rem' }}>
        <div className="container grid grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div>
                <div style={{ display: 'inline-block', background: '#e6f0eb', padding: '8px 16px', borderRadius: '50px', color: '#2d4f3e', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                    🌿 ARGENTINA CULTIVA 2025
                </div>
                <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
                    Tu Huertita en Argentina Empieza Acá.
                </h1>
                <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', maxWidth: '520px' }}>
                    Guías simples, calendario local y kits listos para sembrar. Conectá con la naturaleza sin salir de la ciudad.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/calendario" className="btn btn-primary">
                        <Sprout size={20} />
                        Ver Calendario
                    </Link>
                    <Link to="/calculadora" className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
                        <Calculator size={20} />Calculadora
                    </Link>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex' }}>
                        {[1, 2, 3].map(i => (
                            <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i + 20}.jpg`} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid white', marginLeft: i > 0 ? '-15px' : 0 }} />
                        ))}
                    </div>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>
                        <strong>+2.500 huerteros</strong> se sumaron esta semana.
                    </p>
                </div>
            </div>

            <div className="hero-image-frame">
                <img src="/images/hero_garden.png"
                    alt="Hermosa huerta orgánica casera al atardecer"
                    style={{ objectFit: 'cover', height: '600px' }}
                />
            </div>
        </div>
    </section>
);

const InspirationGallery = () => (
    <section className="section-padding">
        <div className="container">
            <div className="text-center" style={{ maxWidth: '700px', margin: '0 auto 60px auto' }}>
                <h2>Inspiración Natural</h2>
                <p style={{ fontSize: '1.2rem' }}>Descubrí lo que podés lograr con un poco de tierra y amor.</p>
            </div>

            <div className="gallery-grid">
                <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600" className="gallery-img" alt="Compost casero saludable" />
                <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600" className="gallery-img" alt="Plantas en macetas" />
                <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600" className="gallery-img" alt="Herramientas de jardin" />
                <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600" className="gallery-img" alt="Plantines creciendo" />
            </div>
        </div>
    </section>
);

const GerminationTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/germinacion.csv')
            .then(response => response.text())
            .then(csvText => {
                const lines = csvText.split('\n').filter(line => line.trim() !== '');
                const parsedData = lines.slice(1).map(line => {
                    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    if (values.length < 5) return null;
                    return {
                        name: values[0],
                        scientific: values[1],
                        temp: values[2],
                        days: values[3],
                        depth: values[4],
                        light: values[5],
                        notes: values[6]?.replace(/^"|"$/g, ''),
                        source: values[7]
                    };
                }).filter(item => item !== null);
                setData(parsedData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading CSV", err);
                setLoading(false);
            });
    }, []);

    return (
        <section className="section-padding" style={{ background: '#fff' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2>Tabla de Germinación</h2>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>Datos técnicos validados por INTA ProHuerta.</p>
                    </div>
                    <a href="/germinacion.csv" download className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                        <ArrowRight size={18} /> Descargar CSV
                    </a>
                </div>

                {loading ? (
                    <div className="text-center">Cargando datos...</div>
                ) : (
                    <div className="table-wrapper">
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '150px' }}>Hortaliza</th>
                                        <th>T° Óptima</th>
                                        <th>Días Emerg.</th>
                                        <th>Profundidad</th>
                                        <th>Luz</th>
                                        <th style={{ minWidth: '200px' }}>Notas Clave</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(0, 10).map((row, i) => ( // Showing only top 10 for cleaner demo
                                        <tr key={i}>
                                            <td>
                                                <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem', display: 'block' }}>{row.name}</strong>
                                                <span style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', display: 'block' }}>{row.scientific}</span>
                                            </td>
                                            <td>{row.temp}°C</td>
                                            <td>{row.days}</td>
                                            <td>{row.depth}</td>
                                            <td>
                                                <span style={{
                                                    background: row.light?.includes('Sol') ? '#fff9c4' : '#e0f7fa',
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    color: row.light?.includes('Sol') ? '#b78d05' : '#006978',
                                                    display: 'inline-block',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {row.light}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.95rem', lineHeight: '1.4', color: '#444' }}>{row.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {data.length > 10 && (
                            <div className="text-center" style={{ padding: '20px', background: '#fafafa', borderTop: '1px solid #eee' }}>
                                <span style={{ color: '#888', fontStyle: 'italic' }}>Mostrando los primeros 10 resultados de {data.length}.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

const BlogSection = () => {
    const blogPosts = [
        {
            slug: 'vermicompost',
            title: 'Vermicompost Casero en 6 Pasos',
            excerpt: 'Aprendé a hacer humus de lombriz en casa con tus residuos orgánicos.',
            category: 'Fertilizantes',
            readTime: '15 min',
            image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400'
        },
        {
            slug: 'huerta-balcon',
            title: 'Huerta en Balcón para Espacios Pequeños',
            excerpt: 'Transformá tu balcón en una huerta productiva con esta guía completa.',
            category: 'Huerta Urbana',
            readTime: '20 min',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400'
        },
        {
            slug: 'compost-departamento',
            title: 'Compostaje en Departamento Sin Olores',
            excerpt: 'Métodos comprobados para compostar en espacios pequeños: bokashi y vermicompost.',
            category: 'Sustentabilidad',
            readTime: '18 min',
            image: 'https://images.unsplash.com/photo-1588615419955-46f04909874e?auto=format&fit=crop&q=80&w=400'
        },
        {
            slug: 'banco-semillas',
            title: 'Banco de Semillas Casero',
            excerpt: 'Guarda y multiplica tus variedades. Nunca más compres semillas.',
            category: 'Autosuficiencia',
            readTime: '17 min',
            image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=400'
        }
    ];

    return (
        <section className="section-padding" style={{ background: '#fff' }}>
            <div className="container">
                <div className="text-center" style={{ maxWidth: '700px', margin: '0 auto 60px auto' }}>
                    <h2>Blog de la Huerta</h2>
                    <p style={{ fontSize: '1.2rem' }}>Guías prácticas y consejos para tu huerta orgánica</p>
                </div>

                <div className="grid grid-2" style={{ gap: '2rem' }}>
                    {blogPosts.map((post, idx) => (
                        <Link
                            key={idx}
                            to={`/blog/${post.slug}`}
                            className="card"
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px -10px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '12px 12px 0 0',
                                    marginBottom: '1.5rem'
                                }}
                            />
                            <div style={{ padding: '0 1.5rem 1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{
                                        background: '#e6f0eb',
                                        color: 'var(--color-primary)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        {post.category}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#888' }}>{post.readTime}</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>{post.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>{post.excerpt}</p>
                                <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--color-primary)', fontWeight: '600' }}>
                                    Leer más <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Features = () => (
    <section className="section-padding">
        <div className="container">
            <div className="grid grid-3">
                <div className="card">
                    <div className="card-icon-bg">
                        <CloudSun size={32} />
                    </div>
                    <h3>Calendario Local</h3>
                    <p>
                        Ajustado a las regiones de Argentina. Sabé exactamente qué sembrar en la Pampa Húmeda, NOA, Cuyo o Patagonia.
                    </p>
                    <Link to="/calendario" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Ver regiones <ArrowRight size={16} /></Link>
                </div>
                <div className="card">
                    <div className="card-icon-bg" style={{ background: '#fcebd9', color: 'var(--color-secondary)' }}>
                        <Droplets size={32} />
                    </div>
                    <h3>Recetas y Calculadora</h3>
                    <p>
                        Calculá cuánto sustrato necesitás para tus macetas y aprendé a prepararlo vos mismo.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '1rem' }}>
                        <Link to="/recetas" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Recetario <ArrowRight size={16} /></Link>
                        <Link to="/calculadora" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Calculadora <ArrowRight size={16} /></Link>
                    </div>

                </div>
                <div className="card">
                    <div className="card-icon-bg" style={{ background: '#fff9c4', color: '#b78d05' }}>
                        <Sprout size={32} />
                    </div>
                    <h3>Kits de Cultivo</h3>
                    <p>
                        Todo lo que necesitás para empezar: semillas orgánicas, macetas biodegradables y manuales.
                    </p>
                    <a href="#" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Ir a la tienda <ArrowRight size={16} /></a>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer style={{ background: 'var(--color-primary)', color: 'white', padding: '6rem 0 3rem' }}>
        <div className="container">
            <div className="grid grid-2" style={{ gap: '4rem' }}>
                <div>
                    <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2rem' }}>Tu Huertita</h3>
                    <p style={{ maxWidth: '400px', opacity: 0.8, color: '#e6f0eb' }}>
                        Promoviendo la soberanía alimentaria y la biodiversidad en los hogares argentinos. Sumate a la comunidad verde más grande del país.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--color-accent)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Explorar</h4>
                        <ul style={{ listStyle: 'none', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><Link to="/" style={{ color: 'white', fontWeight: 400 }}>Home</Link></li>
                            <li><Link to="/recetas" style={{ color: 'white', fontWeight: 400 }}>Recetario</Link></li>
                            <li><Link to="/calculadora" style={{ color: 'white', fontWeight: 400 }}>Calculadora</Link></li>
                            <li><Link to="/calendario" style={{ color: 'white', fontWeight: 400 }}>Calendario</Link></li>
                            <li><a href="#" style={{ color: 'white', fontWeight: 400 }}>Tienda</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--color-accent)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Ayuda</h4>
                        <ul style={{ listStyle: 'none', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><a href="#" style={{ color: 'white', fontWeight: 400 }}>Contacto</a></li>
                            <li><a href="#" style={{ color: 'white', fontWeight: 400 }}>Envíos</a></li>
                            <li><a href="#" style={{ color: 'white', fontWeight: 400 }}>FAQ</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', opacity: 0.6, textAlign: 'center' }}>
                © 2025 Tu Huertita. Hecho con 🌿 en Buenos Aires.
            </div>
        </div>
    </footer>
);

function App() {
    return (
        <Router>
            <div className="blob-bg">
                <div className="blob-1"></div>
                <div className="blob-2"></div>
            </div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recetas" element={<RecipesPage />} />
                <Route path="/calendario" element={<CalendarPage />} />
                <Route path="/calculadora" element={<SubstrateCalculator />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
            <Footer />
        </Router>
    )
}

export default App;
