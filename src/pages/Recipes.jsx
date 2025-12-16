import React, { useState, useEffect } from 'react';
import { ArrowLeft, Beaker, Leaf, AlertTriangle, Youtube, ShoppingCart, ExternalLink } from 'lucide-react';

const RecipesPage = () => {
    const [substrates, setSubstrates] = useState([]);
    const [remedies, setRemedies] = useState([]);
    const [fertilizers, setFertilizers] = useState([]);
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        // Fetch recipes from public/data/recetas.json
        // Note: In Vite dev, public/data is served at root /data
        fetch('/data/recetas.json')
            .then(res => res.json())
            .then(data => {
                setSubstrates(data.recetas_sustratos || []);
                setRemedies(data.recetas_remedios || []);
                setFertilizers(data.recetas_fertilizantes || []);
                setGuides(data.guias_tecnicas || []);
            })
            .catch(err => console.error("Error loading recipes:", err));
    }, []);

    // Helper component for Market Section
    const MarketSection = ({ items }) => (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#555' }}>
                <ShoppingCart size={14} /> Insumos (Precios Ref. ARS)
            </h5>
            <div style={{ display: 'grid', gap: '8px' }}>
                {items.map((item, i) => (
                    <a key={i} href={item.link_search} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', textDecoration: 'none', background: '#f8f9fa', padding: '6px 10px', borderRadius: '6px', alignItems: 'center' }}
                        className="market-link"
                    >
                        <span>{item.item}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <strong style={{ color: '#2d4f3e' }}>${item.price_avg}</strong>
                            <ExternalLink size={10} />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );

    return (
        <section className="section-padding" style={{ background: '#fff', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem' }}>
                    <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-primary)' }}>
                        <ArrowLeft size={20} /> Volver al inicio
                    </a>
                    <h1>Recetario de la Huerta</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                        Fórmulas probadas, videos tutoriales y lista de precios para empezar hoy.
                    </p>
                </div>

                {/* Substrates Section */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <div className="card-icon-bg" style={{ marginBottom: 0, background: '#fcebd9', color: 'var(--color-secondary)' }}>
                            <Leaf size={28} />
                        </div>
                        <h2 style={{ margin: 0 }}>Sustratos y Suelos</h2>
                    </div>

                    <div className="grid grid-2">
                        {substrates.map((recipe, idx) => (
                            <div key={idx} className="card" style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.3rem' }}>{recipe.nombre}</h3>
                                    <span style={{
                                        background: '#e6f0eb',
                                        color: 'var(--color-primary)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>
                                        ~${recipe.costo_estimado_ars}
                                    </span>
                                </div>
                                <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', opacity: 0.8 }}>Use: {recipe.uso}</p>

                                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Ingredientes / Proporción</h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {recipe.ingredientes_para_10L.map((ing, i) => (
                                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                                                <span>{ing.item}</span>
                                                <strong>{ing.cantidad} {ing.unidad}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Preparación</h4>
                                <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>{recipe.preparacion}</p>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {recipe.video_id && !recipe.video_id.includes('example') && (
                                        <a href={`https://www.youtube.com/watch?v=${recipe.video_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Youtube size={18} /> Ver Tutorial
                                        </a>
                                    )}
                                </div>

                                {recipe.insumos_ml && <MarketSection items={recipe.insumos_ml} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fertilizers Section */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <div className="card-icon-bg" style={{ marginBottom: 0, background: '#e0f2f1', color: '#00695c' }}>
                            <Leaf size={28} />
                        </div>
                        <h2 style={{ margin: 0 }}>Nutrición y Fertilizantes</h2>
                    </div>

                    <div className="grid grid-2">
                        {fertilizers.map((fert, idx) => (
                            <div key={idx} className="card" style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{fert.nombre}</h3>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', color: '#00695c', background: '#b2dfdb', padding: '4px 8px', borderRadius: '4px' }}>{fert.tipo}</span>
                                </div>

                                <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>{fert.preparacion}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.9rem', background: '#fafafa', padding: '15px', borderRadius: '8px' }}>
                                    <div>
                                        <strong>Ingredientes:</strong>
                                        <ul style={{ paddingLeft: '20px', marginTop: '5px', margin: 0 }}>
                                            {fert.ingredientes.map((ing, i) => <li key={i}>{ing}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Dosis:</strong> {fert.dosis}</p>
                                        <p style={{ margin: 0 }}><strong>Aplicación:</strong> {fert.aplicacion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guides Section */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <div className="card-icon-bg" style={{ marginBottom: 0, background: '#f3e5f5', color: '#7b1fa2' }}>
                            <Youtube size={28} /> {/* Using Youtube icon for now as a generic 'guide/media' icon */}
                        </div>
                        <div>
                            <h2 style={{ margin: 0 }}>Guías Técnicas y Trucos</h2>
                            <p style={{ margin: 0, color: '#666' }}>Técnicas de manejo para una huerta eficiente.</p>
                        </div>
                    </div>

                    <div className="grid grid-2">
                        {guides.map((guide, idx) => (
                            <div key={idx} className="card" style={{ padding: '30px', borderTop: '4px solid #7b1fa2' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{guide.titulo}</h3>
                                <span style={{ fontSize: '0.8rem', color: '#9c27b0', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '1.5rem' }}>{guide.categoria}</span>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Materiales / Herramientas</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {guide.materiales.map((m, i) => (
                                            <li key={i} style={{ background: '#f3e5f5', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', color: '#4a148c' }}>{m}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Paso a Paso</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#444', lineHeight: '1.6' }}>
                                        {guide.pasos.map((paso, i) => (
                                            <li key={i} style={{ marginBottom: '8px' }}>{paso}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Remedies Section */}
                <div style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <div className="card-icon-bg" style={{ marginBottom: 0, background: '#fff9c4', color: '#b78d05' }}>
                            <Beaker size={28} />
                        </div>
                        <h2 style={{ margin: 0 }}>Botiquín Natural</h2>
                    </div>

                    <div className="grid grid-2">
                        {remedies.map((remedio, idx) => (
                            <div key={idx} className="card" style={{ padding: '30px', borderLeft: '5px solid var(--color-accent)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{remedio.nombre}</h3>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', color: '#888' }}>{remedio.tipo}</span>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <strong>Ingredientes:</strong>
                                    <ul style={{ paddingLeft: '20px', marginTop: '5px', color: '#555' }}>
                                        {remedio.ingredientes.map((ing, i) => <li key={i}>{ing}</li>)}
                                    </ul>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p><strong>Dosis:</strong> {remedio.dosis}</p>
                                    <p><strong>Aplicación:</strong> {remedio.aplicacion}</p>
                                </div>

                                <div style={{ background: '#fff5f5', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <AlertTriangle size={20} color="#e53e3e" style={{ marginTop: '2px' }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#c53030' }}>
                                        <strong>Seguridad:</strong> {remedio.seguridad} <br />
                                        {remedio.compatibilidad && <span style={{ fontSize: '0.85rem' }}>{remedio.compatibilidad}</span>}
                                    </p>
                                </div>

                                {remedio.video_id && !remedio.video_id.includes('example') && (
                                    <a href={`https://www.youtube.com/watch?v=${remedio.video_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                                        <Youtube size={18} /> Ver Tutorial
                                    </a>
                                )}

                                {remedio.insumos_ml && <MarketSection items={remedio.insumos_ml} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecipesPage;
