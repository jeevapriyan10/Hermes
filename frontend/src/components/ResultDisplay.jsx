import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ResultDisplay({ result, loading }) {
    if (loading) {
        return (
            <div className="card">
                <h3 className="mb-md">Analysis Result</h3>
                <div className="text-center" style={{ padding: '3rem 0' }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(30, 64, 175, 0.2)',
                        borderTopColor: 'var(--primary)',
                        margin: '0 auto 1rem'
                    }} />
                    <p className="text-secondary">Analyzing text...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="card">
                <h3 className="mb-md">Analysis Result</h3>
                <div className="info-box">
                    <p>Submit text to see the verification results here.</p>
                </div>
            </div>
        );
    }

    if (result.error) {
        return (
            <div className="card">
                <h3 className="mb-md">Analysis Result</h3>
                <div className="alert alert-error">
                    <p>{result.error}</p>
                </div>
            </div>
        );
    }

    const isMisinformation = result.is_misinformation || result.verdict === 'misinformation';
    const confidence = Math.round((result.confidence || 0) * 100);

    return (
        <div className="card">
            <h3 className="mb-md">Analysis Result</h3>

            {/* Verdict */}
            <div className="mb-lg">
                <div className="flex items-center justify-between mb-sm">
                    <span className="text-sm font-medium">Verdict</span>
                    {isMisinformation ? (
                        <span className="badge badge-declined">
                            <AlertTriangle size={12} /> Misinformation
                        </span>
                    ) : (
                        <span className="badge badge-approved">
                            <CheckCircle size={12} /> Reliable
                        </span>
                    )}
                </div>
            </div>

            {/* Confidence */}
            <div className="mb-lg">
                <div className="flex items-center justify-between mb-sm">
                    <span className="text-sm font-medium">Confidence</span>
                    <span className="text-sm font-semibold text-primary">{confidence}%</span>
                </div>
                <div style={{
                    height: '8px',
                    background: 'var(--surface)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${confidence}%`,
                        height: '100%',
                        background: isMisinformation ? 'var(--error)' : 'var(--success)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Category */}
            <div className="mb-lg">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <span className="badge badge-review text-capitalize">
                        {result.category || 'general'}
                    </span>
                </div>
            </div>

            {/* Explanation */}
            {result.explanation && (
                <div className="mb-lg">
                    <p className="text-sm font-medium mb-sm">Explanation</p>
                    <div className="info-box">
                        <p className="text-sm">{result.explanation}</p>
                    </div>
                </div>
            )}

            {/* Info about dashboard */}
            {isMisinformation && (
                <div className="alert alert-info">
                    <p className="text-sm"> This detection has been added to the community dashboard where you can upvote it!</p>
                </div>
            )}
        </div>
    );
}
