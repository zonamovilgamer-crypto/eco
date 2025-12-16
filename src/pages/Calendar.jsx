import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Sun, Sprout, Leaf, CloudRain, Thermometer } from 'lucide-react';

const ZONES = [
    { id: 'pampeana', name: 'Región Pampeana' },
    { id: 'noa', name: 'Noroeste (NOA)' },
    { id: 'cuyo', name: 'Cuyo' },
    { id: 'patagonia', name: 'Patagonia' },
    { id: 'nea', name: 'Noreste (NEA)' }
];

const ZONE_COORDS = {
    pampeana: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
    noa: { lat: -24.7821, lng: -65.4232 },      // Salta
    cuyo: { lat: -32.8908, lng: -68.8358 },     // Mendoza
    patagonia: { lat: -41.1335, lng: -71.3103 },// Bariloche
    nea: { lat: -27.4692, lng: -58.8316 }       // Corrientes
};

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Mock Data for the demo (incomplete but functional structure)
const CALENDAR_DATA = {
    pampeana: {
        items: [
            { month: 0, indoor: ['Lechuga', 'Acelga'], outdoor: ['Zapallo', 'Maíz', 'Poroto', 'Tomate (Tardío)'], harvest: ['Tomate', 'Pimiento'] }, // Enero
            { month: 11, indoor: ['Tomate', 'Pimiento', 'Berenjena'], outdoor: ['Zapallo', 'Melón', 'Sandía'], harvest: ['Haba', 'Arveja'] } // Diciembre ~ example for Spring/Summer
        ]
    }
    // In a real app, this would be a full database or API response
};

const getTasksForZoneAndMonth = (zoneId, monthIndex) => {
    // Fallback simple logic generator for demo purposes so it always shows something
    // Spring/Summer (Sep-Feb): 8-1
    // Autumn/Winter (Mar-Aug): 2-7
    const isWarmSeason = monthIndex >= 8 || monthIndex <= 2;

    if (isWarmSeason) {
        return {
            indoor: ['Lechuga', 'Acelga', 'Rúcula'],
            outdoor: ['Tomate', 'Pimiento', 'Berenjena', 'Zapallo', 'Maíz', 'Albahaca'],
            harvest: ['Acelga', 'Rabanito', 'Lechuga']
        };
    } else {
        return {
            indoor: ['Tomate (invierno)', 'Pimiento (invierno)'],
            outdoor: ['Haba', 'Arveja', 'Ajo', 'Cebolla', 'Espinaca', 'Zanahoria'],
            harvest: ['Zapallo', 'Batata', 'Calabaza']
        };
    }
};

const WeatherWidget = ({ zoneId }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const coords = ZONE_COORDS[zoneId];
        if (!coords) return;

        const fetchWeather = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`);
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error("Error fetching weather:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [zoneId]);

    if (loading) return <div style={{ fontSize: '0.9rem', color: '#666' }}>Cargando clima...</div>;
    if (!weather) return null;

    const currentTemp = Math.round(weather.current_weather.temperature);
    const maxTemp = Math.round(weather.daily.temperature_2m_max[0]);
    const minTemp = Math.round(weather.daily.temperature_2m_min[0]);

    // Simple advice logic
    let advice = "Buen día para estar en la huerta.";
    if (currentTemp > 30) advice = "¡Calor extremo! Regá abundante y protegé del sol directo.";
    else if (currentTemp < 5) advice = "Riesgo de heladas. Cubrí tus cultivos esta noche.";
    else if (currentTemp >= 20 && currentTemp <= 30) advice = "Clima ideal para trasplantes y siembra.";

    return (
        <div style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)', padding: '20px', borderRadius: '15px', border: '1px solid #b2ebf2', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
                <CloudRain size={32} color="#006978" />
                <div style={{ fontSize: '0.8rem', color: '#006978', fontWeight: 'bold', marginTop: '5px' }}>CLIMA HOY</div>
            </div>
            <div style={{ borderLeft: '1px solid #b2ebf2', paddingLeft: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#006064' }}>{currentTemp}°</span>
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>Max: {maxTemp}° / Min: {minTemp}°</span>
                </div>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem', color: '#333', fontStyle: 'italic' }}>
                    Tip: {advice}
                </p>
            </div>
        </div>
    );
};

const CalendarPage = () => {
    const [selectedZone, setSelectedZone] = useState('pampeana');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11

    const tasks = getTasksForZoneAndMonth(selectedZone, selectedMonth);

    return (
        <section className="section-padding" style={{ background: '#fff', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-primary)' }}>
                            <ArrowLeft size={20} /> Volver al inicio
                        </a>
                        <h1>Calendario de Siembra 2025</h1>
                        <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '1rem' }}>
                            Planificá tu huerta mes a mes según tu ubicación geográfica.
                        </p>
                    </div>
                </div>

                <div className="grid grid-2" style={{ gap: '30px', alignItems: 'start', marginBottom: '4rem' }}>
                    {/* Controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8faf9', padding: '30px', borderRadius: '20px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>Configuración</h3>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                                <MapPin size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                Tu Región
                            </label>
                            <select
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                            >
                                {ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                                <CalendarIcon size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                Mes
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                            >
                                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Weather Widget Component */}
                    <div>
                        <WeatherWidget zoneId={selectedZone} />
                    </div>
                </div>

                {/* Results Grid */}
                <div>
                    <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        En {MONTHS[selectedMonth]} sembramos:
                    </h2>

                    <div className="grid grid-3">
                        {/* Outdoor Direct */}
                        <div className="card" style={{ borderTop: '5px solid #d97d54' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#fcebd9', padding: '10px', borderRadius: '50%', color: '#d97d54' }}>
                                    <Sun size={24} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Siembra Directa</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>Directo en la tierra o maceta final. Riego frecuente.</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {tasks.outdoor.map(crop => (
                                    <span key={crop} style={{ background: '#fff', border: '1px solid #eee', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', color: '#444', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Indoor / Seedbed */}
                        <div className="card" style={{ borderTop: '5px solid #2d4f3e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#e6f0eb', padding: '10px', borderRadius: '50%', color: '#2d4f3e' }}>
                                    <Sprout size={24} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Almácigo</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>Sembrar en bandejas protegidas del sol fuerte o heladas.</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {tasks.indoor.map(crop => (
                                    <span key={crop} style={{ background: '#fff', border: '1px solid #eee', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', color: '#444', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Harvest */}
                        <div className="card" style={{ borderTop: '5px solid #f4d35e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#fff9c4', padding: '10px', borderRadius: '50%', color: '#b78d05' }}>
                                    <Leaf size={24} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Cosecha</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>Lo que ya debería estar listo para recolectar.</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {tasks.harvest.map(crop => (
                                    <span key={crop} style={{ background: '#fff', border: '1px solid #eee', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', color: '#444', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        {crop}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CalendarPage;
