import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, AlertTriangle, ThumbsUp, Calendar, BarChart } from 'lucide-react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND}/api/dashboard`);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (itemId) => {
        try {
            await axios.post(`${BACKEND}/api/upvote`, { id: itemId });
            fetchDashboard();
        } catch (error) {
            console.error('Upvote failed:', error);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="card">
                <div className="text-center" style={{ padding: '3rem 0' }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(30, 64, 175, 0.2)',
                        borderTopColor: 'var(--primary)',
                        margin: '0 auto 1rem'
                    }} />
                    <p className="text-secondary">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const items = data?.items || [];
    const stats = data?.stats || {};

    return (
        <div>
            {/* Stats Overview */}
            <div className="grid grid-4 mb-xl">
                <div className="stat-card">
                    <div className="stat-value">{stats.total || 0}</div>
                    <div className="stat-label">Total Detections</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.totalUpvotes || 0}</div>
                    <div className="stat-label">Community Votes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{items.length}</div>
                    <div className="stat-label">Recent Items</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {new Set(items.map(i => i.category)).size}
                    </div>
                    <div className="stat-label">Categories</div>
                </div>
            </div>

            {/* Feed */}
            <div className="card">
                <div className="flex items-center justify-between mb-lg">
                    <div className="flex items-center gap-sm">
                        <BarChart size={24} style={{ color: 'var(--primary)' }} />
                        <h2>Recent Detections</h2>
                    </div>
                    <span className="text-sm text-secondary">{items.length} items</span>
                </div>

                {items.length === 0 ? (
                    <div className="info-box text-center">
                        <p>No misinformation detected yet. Submit content to get started!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {items.map((item) => (
                            <div key={item._id} className="card" style={{ background: 'var(--surface)', margin: 0 }}>
                                <div className="flex items-start justify-between gap-md mb-sm">
                                    <span className="badge badge-declined text-capitalize">
                                        {item.category || 'general'}
                                    </span>
                                    <span className="text-xs text-secondary flex items-center gap-xs">
                                        <Calendar size={12} />
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
        </div>
    );
}
