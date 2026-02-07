import React, { useState } from 'react';
import axios from 'axios';
import Landing from './components/Landing';
import VerificationForm from './components/VerificationForm';
import ResultDisplay from './components/ResultDisplay';
import Dashboard from './components/Dashboard';
import MessageBanner from './components/MessageBanner';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

function App() {
    const [view, setView] = useState('landing');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleVerification = async (text) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND}/api/verify`, { text });
            setVerificationResult(response.data);
            showMessage('success', '✅ Analysis complete!');
        } catch (error) {
            console.error('Verification error:', error);
            showMessage('error', '❌ ' + (error.response?.data?.error || 'Failed to verify text. Please try again.'));
            setVerificationResult({ error: 'Failed to verify' });
        } finally {
            setLoading(false);
        }
    };

    if (view === 'landing') {
        return <Landing onGetStarted={() => setView('verify')} />;
    }

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                            <h3>Hermes</h3>
                        </div>
                        <div className="flex gap-sm">
                            <button
                                onClick={() => setView('verify')}
                                className={`tab ${view === 'verify' ? 'active' : ''}`}
                            >
                                Verify
                            </button>
                            <button
                                onClick={() => setView('dashboard')}
                                className={`tab ${view === 'dashboard' ? 'active' : ''}`}
                            >
                                Dashboard
                            </button>
                            <button onClick={() => setView('landing')} className="btn btn-secondary">
                                Home
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {message && <MessageBanner message={message} onClose={() => setMessage(null)} />}

            <main style={{ padding: '3rem 0', minHeight: 'calc(100vh - 200px)' }}>
                <div className="container">
                    {view === 'verify' && (
                        <div>
                            <div className="text-center mb-xl">
                                <h2 className="mb-md">Verify Information Accuracy</h2>
                                <p className="text-secondary" style={{ maxWidth: '700px', margin: '0 auto' }}>
                                    Submit text content to analyze for potential misinformation using advanced AI verification systems.
                                </p>
                            </div>

                            <div className="grid grid-2">
                                <VerificationForm onSubmit={handleVerification} loading={loading} />
                                <ResultDisplay result={verificationResult} loading={loading} />
                            </div>
                        </div>
                    )}

                    {view === 'dashboard' && (
                        <div>
                            <div className="text-center mb-xl">
                                <h2 className="mb-md">Misinformation Dashboard</h2>
                                <p className="text-secondary">
                                    Track detected misinformation by category and view community engagement.
                                </p>
                            </div>
                            <Dashboard />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center' }}>
                <div className="container">
                    <p className="text-secondary text-sm">
                        © 2026 Hermes. AI-Powered Misinformation Detection.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
