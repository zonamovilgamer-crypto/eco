import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    // Si ya hay contenido (prerenderizado), usar hydrate
    ReactDOM.hydrateRoot(rootElement,
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // Si no hay contenido, renderizar normalmente
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
