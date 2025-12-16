import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                // Mapeo de slugs a archivos
                const postFiles = {
                    'vermicompost': () => import('../../content/post-vermicompost.md?raw'),
                    'huerta-balcon': () => import('../../content/post-huerta-balcon.md?raw'),
                    'compost-departamento': () => import('../../content/post-compost-departamento.md?raw'),
                    'banco-semillas': () => import('../../content/post-banco-semillas.md?raw'),
                };

                if (!postFiles[slug]) {
                    setError('Post no encontrado');
                    setLoading(false);
                    return;
                }

                const module = await postFiles[slug]();
                const postContent = module.default;

                // Robust frontmatter parser handling \r\n or \n
                const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/;
                const match = postContent.match(frontmatterRegex);

                if (match) {
                    const yaml = match[1];
                    const metaObj = {};
                    yaml.split(/[\r\n]+/).forEach(line => {
                        const parts = line.split(':');
                        if (parts.length >= 2) {
                            const key = parts[0].trim();
                            const val = parts.slice(1).join(':').trim().replace(/^\"|\"$/g, '');
                            metaObj[key] = val;
                        }
                    });
                    setMeta(metaObj);

                    // Remove frontmatter
                    let cleanContent = postContent.replace(frontmatterRegex, '').trim();

                    // Remove the first H1 (# Title) if it roughly matches the meta title
                    cleanContent = cleanContent.replace(/^#\s+.+[\r\n]+/, '');

                    setContent(cleanContent);
                } else {
                    setContent(postContent);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error loading post:', err);
                setError('Error al cargar el post');
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <section className="section-padding" style={{ background: '#fff', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center', paddingTop: '100px' }}>
                    <h2>Cargando...</h2>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section-padding" style={{ background: '#fff', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center', paddingTop: '100px' }}>
                    <h2>{error}</h2>
                    <Link to="/" style={{ marginTop: '20px', display: 'inline-block' }}>Volver al inicio</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="section-padding" style={{ background: '#fff', minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* SEO: Meta tags dinámicos por post */}
            <Helmet>
                <title>{meta.seo_title || meta.title || 'Tu Huertita - Blog'}</title>
                <meta name="description" content={meta.description || 'Guías prácticas de huerta orgánica'} />
                <meta name="keywords" content={meta.keywords || 'huerta organica, argentina'} />

                {/* Canonical URL */}
                <link rel="canonical" href={`https://tuhuertita.ar/blog/${slug}`} />

                {/* Open Graph */}
                <meta property="og:title" content={meta.title || 'Tu Huertita'} />
                <meta property="og:description" content={meta.description || ''} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://tuhuertita.ar/blog/${slug}`} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title || 'Tu Huertita'} />
                <meta name="twitter:description" content={meta.description || ''} />

                {/* Schema.org Article */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": meta.title || '',
                        "description": meta.description || '',
                        "author": {
                            "@type": "Organization",
                            "name": meta.author || "Tu Huertita"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Tu Huertita",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://tuhuertita.ar/vite.svg"
                            }
                        },
                        "datePublished": meta.date || "2025-01-15",
                        "dateModified": meta.date || "2025-01-15",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://tuhuertita.ar/blog/${slug}`
                        },
                        "articleSection": meta.cat || "Huerta Orgánica",
                        "keywords": meta.keywords || "huerta organica"
                    })}
                </script>
            </Helmet>

            <div className="container" style={{ maxWidth: '800px' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--color-primary)' }}>
                    <ArrowLeft size={20} /> Volver al Blog
                </Link>

                {meta.title && (
                    <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <span style={{
                            background: '#e6f0eb',
                            color: 'var(--color-primary)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '1rem',
                            display: 'inline-block'
                        }}>
                            {meta.cat || 'Guía Práctica'}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{meta.title}</h1>
                        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1.5rem' }}>{meta.description}</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#888', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> 15 min lectura</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Tag size={16} /> {meta.cat || 'Huerta'}</span>
                        </div>
                    </div>
                )}

                <div className="blog-content">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
                </div>

                <style>{`
                    .blog-content { font-size: 1.15rem; line-height: 1.8; color: #333; }
                    .blog-content h2 { font-size: 1.8rem; margin: 2.5rem 0 1.5rem; color: var(--color-primary); }
                    .blog-content h3 { font-size: 1.4rem; margin: 2rem 0 1rem; }
                    .blog-content ul, .blog-content ol { padding-left: 20px; margin-bottom: 2rem; }
                    .blog-content li { margin-bottom: 10px; }
                    .blog-content strong { color: var(--color-secondary); }
                    .blog-content blockquote { border-left: 5px solid var(--color-accent); padding-left: 20px; font-style: italic; color: #666; background: #fff9c4; padding: 20px; border-radius: 0 10px 10px 0; margin-bottom: 2rem; }
                    .blog-content p { margin-bottom: 1.5rem; }
                    .blog-content a { color: var(--color-primary); text-decoration: underline; font-weight: bold; }
                    .blog-content iframe { border-radius: 12px; margin: 2rem auto; display: block; max-width: 100%; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.2); }
                    .blog-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
                    .blog-content table th, .blog-content table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    .blog-content table th { background: var(--color-primary); color: white; font-weight: 700; }
                    .blog-content table tr:nth-child(even) { background: #f9f9f9; }
                    .blog-content code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
                    .blog-content pre { background: #f4f4f4; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 2rem 0; }
                    .blog-content pre code { background: none; padding: 0; }
                `}</style>
            </div>
        </section>
    );
};

export default BlogPost;
