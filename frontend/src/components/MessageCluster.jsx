import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';

export default function MessageCluster({ cluster }) {
    const [expanded, setExpanded] = useState(false);

    if (!cluster || !cluster.variations || cluster.variations === 0) {
        return null;
    }

    return (
        <div className="card" style={{ background: 'var(--surface)', margin: '0.5rem 0', border: '2px solid var(--primary)' }}>
            {/* Cluster Header */}
            <div className="flex items-center justify-between mb-sm">
                <span className="badge badge-info">
                    <Copy size={12} />
                    {cluster.variations} Similar Messages
                </span>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded ? 'Hide' : 'Show'} Variations
                </button>
            </div>

            {/* Template */}
            {cluster.messageTemplate && (
                <div className="info-box mb-sm" style={{ background: '#EFF6FF', borderColor: 'var(--primary)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                        Common Template:
                    </p>
                    <p className="text-sm" style={{ marginTop: '0.25rem' }}>
                        "{cluster.messageTemplate}"
                    </p>
                </div>
            )}

            {/* Main Message */}
            <p className="mb-sm" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                <strong>"{cluster.text}"</strong>
            </p>

            {/* Variations (expandable) */}
            {expanded && cluster.allVariations && cluster.allVariations.length > 0 && (
                <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)'
                }}>
                    <p className="text-sm font-medium mb-sm">All Variations:</p>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {cluster.allVariations.map((variation, idx) => (
                            <div
                                key={idx}
                                className="info-box"
                                style={{ padding: '0.75rem', fontSize: '0.85rem' }}
                            >
                                <div className="flex items-start justify-between gap-sm">
                                    <p style={{ flex: 1 }}>"{variation.text}"</p>
                                    <span className="text-xs text-secondary">
                                        {new Date(variation.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
