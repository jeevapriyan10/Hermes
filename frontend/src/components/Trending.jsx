import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, ThumbsUp, AlertTriangle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function Trending() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('24h');
    const [sortBy, setSortBy] = useState('upvotes');

    useEffect(() => {
        fetchTrending();
    }, [period, sortBy]);

    const fetchTrending = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/trending?period=${period}&sortBy=${sortBy}&limit=50`);
            setItems(response.data.items || []);
        } catch (error) {
            console.error('Failed to fetch trending:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (itemId) => {
        try {
            await axios.post(`${API_BASE}/upvote`, { itemId });
            // Update local state
            setItems(items.map(item =>
                item._id === itemId ? { ...item, upvotes: (item.upvotes || 0) + 1 } : item
            ));
        } catch (error) {
            console.error('Upvote failed:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-lg">
                <div className="flex items-center gap-sm">
                    <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
                    <h2>Trending Misinformation</h2>
                </div>
                <div className="flex items-center gap-sm">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px' }}
                    >
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="all">All time</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px' }}
                    >
                        <option value="upvotes">Most upvoted</option>
                        <option value="recent">Most recent</option>
                        <option value="confidence">Highest confidence</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '3rem 0' }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(30, 64, 175, 0.2)',
                        borderTopColor: 'var(--primary)',
                        margin: '0 auto 1rem'
                    }} />
                    <p className="text-secondary">Loading trending...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="info-box text-center">
                    <p>No trending misinformation found for this period.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {items.map((item, index) => (
                        <div key={item._id} className="card" style={{ background: 'var(--surface)', margin: 0 }}>
                            <div className="flex items-start justify-between gap-md mb-sm">
                                <div className="flex items-center gap-sm">
                                    <span className="badge badge-review" style={{ fontSize: '0.75rem' }}>
                                        #{index + 1}
                                    </span>
                                    <span className="badge badge-declined text-capitalize">
                                        {item.category || 'general'}
                                    </span>
                                </div>
                                <span className="text-xs text-secondary flex items-center gap-xs">
                                    <Clock size={12} />
                                    {formatDate(item.timestamp)}
                                </span>
                            </div>

                            <p className="mb-sm" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <strong>"{item.text}"</strong>
                            </p>

                            <div className="info-box mb-sm">
                                <p className="text-sm">{item.explanation}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-sm">
                                    <span className="badge badge-review">
                                        <AlertTriangle size={12} />
                                        {Math.round(item.confidence * 100)}% confidence
                                    </span>
                                    {item.variations > 0 && (
                                        <span className="badge badge-info">
                                            {item.variations} variations
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleUpvote(item._id)}
                                    className="btn btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                                >
                                    <ThumbsUp size={14} />
                                    {item.upvotes || 0}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
