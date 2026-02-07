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
            // Refresh data after upvote
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
                    <p className="text-secondary">Loading feed...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-warning">
                <p>{error}</p>
                <button onClick={fetchDashboard} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    Retry
                </button>
            </div>
        );
    }

    if (!data || !data.items || data.items.length === 0) {
        return (
            <div className="card">
                <div className="info-box">
                    <p>No misinformation detected yet. Be the first to verify content!</p>
                </div>
            </div>
        );
    }

    const { items, stats } = data;

    return (
        <div>
            {/* Stats Overview */}
            <div className="grid grid-2 mb-xl">
                <div className="stat-card">
                    <AlertTriangle size={32} color="var(--error)" style={{ margin: '0 auto 0.5rem' }} />
                    <div className="stat-value">{stats.total || 0}</div>
                    <div className="stat-label">Total Detections</div>
                </div>
                <div className="stat-card">
                    <ThumbsUp size={32} color="var(--success)" style={{ margin: '0 auto 0.5rem' }} />
                    <div className="stat-value">{stats.totalUpvotes || 0}</div>
                    <div className="stat-label">Community Upvotes</div>
                </div>
            </div>

            {/* Social Feed Header */}
            <div className="flex items-center justify-between mb-lg">
                <h3 className="flex items-center gap-sm">
                    <TrendingUp size={24} />
                    Misinformation Feed
                </h3>
                <span className="text-sm text-secondary">{items.length} detections</span>
            </div>

            {/* Feed Items */}
            <div className="grid gap-lg">
                {items.map((item) => (
                    <div key={item._id} className="card" style={{ borderLeft: '4px solid var(--error)' }}>
                        {/* Item Header */}
                        <div className="flex items-center justify-between mb-md">
                            <div className="flex items-center gap-sm">
                                <span className="badge badge-declined">
                                    <AlertTriangle size={12} /> Misinformation
                                </span>
                                <span className="badge badge-review text-capitalize">
                                    {item.category || 'general'}
                                </span>
                            </div>
                            <span className="text-xs text-secondary flex items-center gap-xs">
                                <Calendar size={12} />
                                {formatDate(item.timestamp)}
                            </span>
                        </div>

                        {/* Detected Text */}
                        <div className="mb-md">
                            <p className="text-sm font-medium mb-xs">Detected Content:</p>
                            <div className="info-box">
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                                    {item.text}
                                </p>
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="mb-md">
                            <p className="text-sm font-medium mb-xs">Analysis:</p>
                            <p className="text-sm text-secondary">{item.explanation}</p>
                        </div>

                        {/* Confidence Bar */}
                        <div className="mb-md">
                            <div className="flex items-center justify-between mb-xs">
                                <span className="text-xs font-medium">AI Confidence</span>
                                <span className="text-xs font-semibold text-error">
                                    {Math.round((item.confidence || 0) * 100)}%
                                </span>
                            </div>
                            <div style={{
                                height: '6px',
                                background: 'var(--surface)',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${Math.round((item.confidence || 0) * 100)}%`,
                                    height: '100%',
                                    background: 'var(--error)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>

                        {/* Upvote Section */}
                        <div className="flex items-center justify-between" style={{
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--border)'
                        }}>
                            <button
                                onClick={() => handleUpvote(item._id)}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                            >
                                <ThumbsUp size={14} />
                                Upvote ({item.upvotes || 0})
                            </button>
                            <span className="text-xs text-secondary">
                                Help validate this detection
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
