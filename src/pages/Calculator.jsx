import React, { useState } from 'react';
import { Calculator, Shovel, Sprout, ArrowRight, ArrowLeft } from 'lucide-react';

const SUSTAINABLE_MIXES = {
    universal: {
        name: "Sustrato Universal",
        description: "Ideal para la mayoría de hortalizas de fruto y aromáticas en maceta.",
        ratios: [
            { id: 'tierra', name: 'Tierra Negra', ratio: 0.50, color: '#5D4037' },
            { id: 'compost', name: 'Compost Maduro', ratio: 0.30, color: '#3E2723' },
            { id: 'perlita', name: 'Perlita', ratio: 0.20, color: '#ECEFF1' }
        ],
        cost_per_liter: 150 // Estimado ARS
    },
    semillero: {
        name: "Mezcla Liviana (Semilleros)",
        description: "Muy suelta y aireada para facilitar la germinación.",
        ratios: [
            { id: 'turba', name: 'Turba / Coco', ratio: 0.40, color: '#8D6E63' },
            { id: 'compost', name: 'Compost Tamizado', ratio: 0.40, color: '#5D4037' },
            { id: 'perlita', name: 'Perlita/Vermiculita', ratio: 0.20, color: '#ECEFF1' }
        ],
        cost_per_liter: 200 // Estimado ARS
    },
    suculentas: {
        name: "Cactus y Suculentas",
        description: "Drenaje máximo para evitar pudrición.",
        ratios: [
            { id: 'tierra', name: 'Tierra', ratio: 0.30, color: '#5D4037' },
            { id: 'arena', name: 'Arena Gruesa', ratio: 0.40, color: '#FFCC80' },
            { id: 'perlita', name: 'Perlita', ratio: 0.30, color: '#ECEFF1' }
        ],
        cost_per_liter: 120 // Estimado ARS
    }
};

const SubstrateCalculator = () => {
    const [volume, setVolume] = useState(20);
    const [selectedMix, setSelectedMix] = useState('universal');

    // Dimension calculator state
    const [shape, setShape] = useState('rectangular'); // rectangular, cylindrical
    const [dims, setDims] = useState({ length: 60, width: 20, height: 15, diameter: 30 });

    const calculateVolumeFromDims = () => {
        let v_liters = 0;
        if (shape === 'rectangular') {
            v_liters = (dims.length * dims.width * dims.height) / 1000;
        } else {
            const radius = dims.diameter / 2;
            v_liters = (Math.PI * Math.pow(radius, 2) * dims.height) / 1000;
        }
        setVolume(Math.round(v_liters * 10) / 10);
    };

    const mix = SUSTAINABLE_MIXES[selectedMix];
    const totalCost = Math.round(volume * mix.cost_per_liter);

    return (
        <section className="section-padding" style={{ background: '#fff', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--color-primary)' }}>
                    <ArrowLeft size={20} /> Volver al inicio
                </a>

                <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'start' }}>

                    {/* Input Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                            <div className="card-icon-bg" style={{ marginBottom: 0, background: '#e6f0eb', color: 'var(--color-primary)' }}>
                                <Calculator size={28} />
                            </div>
                            <h1 style={{ margin: 0, fontSize: '2rem' }}>Calculadora de Sustrato</h1>
                        </div>
                        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
                            Averiguá exactamente cuánta tierra, compost y perlita necesitás para tus macetas o canteros.
                        </p>

                        <div className="card" style={{ padding: '30px', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>1. ¿Qué vas a llenar?</h3>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
                                <button
                                    onClick={() => setShape('rectangular')}
                                    className={`btn ${shape === 'rectangular' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, padding: '10px' }}
                                >
                                    Maceta / Cajón
                                </button>
                                <button
                                    onClick={() => setShape('cylindrical')}
                                    className={`btn ${shape === 'cylindrical' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1, padding: '10px' }}
                                >
                                    Maceta Redonda
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {shape === 'rectangular' ? (
                                    <>
                                        <label>
                                            Largo (cm)
                                            <input type="number" value={dims.length} onChange={e => setDims({ ...dims, length: Number(e.target.value) })} style={inputStyle} />
                                        </label>
                                        <label>
                                            Ancho (cm)
                                            <input type="number" value={dims.width} onChange={e => setDims({ ...dims, width: Number(e.target.value) })} style={inputStyle} />
                                        </label>
                                    </>
                                ) : (
                                    <label style={{ gridColumn: 'span 2' }}>
                                        Diámetro (cm)
                                        <input type="number" value={dims.diameter} onChange={e => setDims({ ...dims, diameter: Number(e.target.value) })} style={inputStyle} />
                                    </label>
                                )}
                                <label style={{ gridColumn: 'span 2' }}>
                                    Profundidad (cm)
                                    <input type="number" value={dims.height} onChange={e => setDims({ ...dims, height: Number(e.target.value) })} style={inputStyle} />
                                </label>
                            </div>

                            <button onClick={calculateVolumeFromDims} className="btn" style={{ width: '100%', marginTop: '1.5rem', background: '#333', color: 'white' }}>
                                Calcular Volumen
                            </button>

                            <div style={{ marginTop: '1.5rem', padding: '15px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Volumen Total:</span>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>{volume} Litros</div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '30px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>2. Elegí tu Mezcla</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {Object.keys(SUSTAINABLE_MIXES).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedMix(key)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '15px',
                                            borderRadius: '10px',
                                            border: selectedMix === key ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                            background: selectedMix === key ? '#e6f0eb' : 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <strong style={{ display: 'block', color: '#2d4f3e' }}>{SUSTAINABLE_MIXES[key].name}</strong>
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{SUSTAINABLE_MIXES[key].description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div style={{ position: 'sticky', top: '20px' }}>
                        <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                            <div style={{ padding: '30px', background: 'var(--color-primary)', color: 'white' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Tu Receta</h2>
                                <p style={{ opacity: 0.9 }}>Para llenar {volume} litros de {mix.name}</p>
                            </div>

                            <div style={{ padding: '30px' }}>
                                {/* Visualization */}
                                <div style={{ height: '40px', display: 'flex', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem' }}>
                                    {mix.ratios.map(item => (
                                        <div key={item.id} style={{ width: `${item.ratio * 100}%`, background: item.color }} title={item.name}></div>
                                    ))}
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                    {mix.ratios.map(item => (
                                        <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                                                <span style={{ fontSize: '1.1rem' }}>{item.name}</span>
                                            </div>
                                            <strong style={{ fontSize: '1.3rem' }}>{(volume * item.ratio).toFixed(1)} L</strong>
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ background: '#fcebd9', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '5px' }}>Costo Estimado</span>
                                    <strong style={{ fontSize: '2rem', color: 'var(--color-secondary)' }}>${totalCost.toLocaleString()} ARS</strong>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0 0 0' }}>Promedio en viveros de Argentina</p>
                                </div>
                            </div>
                            <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'center', background: '#fafafa' }}>
                                <a href="/recetas" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                                    <Shovel size={18} /> Ver cómo preparar esta mezcla
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginTop: '5px',
    fontSize: '1rem',
    fontFamily: 'inherit'
};

export default SubstrateCalculator;
