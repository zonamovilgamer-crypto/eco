import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import postContent from '../../content/post-vermicompost.md?raw&v=3';

const BlogPost = () => {
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});

    useEffect(() => {
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
                    const val = parts.slice(1).join(':').trim().replace(/^"|"$/g, '');
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
    }, []);

    return (
        <section className="section-padding" style={{ background: '#fff', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--color-primary)' }}>
                    <ArrowLeft size={20} /> Volver al Blog
                </a>

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
                            Guía Práctica
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
                `}</style>
            </div>
        </section>
    );
};

export default BlogPost;
