import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function VerificationForm({ onSubmit, loading }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !loading) {
            onSubmit(text.trim());
        }
    };

    return (
        <div className="card">
            <h3 className="mb-md">Submit Text for Verification</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Text to Analyze</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste or type the content you want to verify for misinformation..."
                        required
                        disabled={loading}
                        maxLength={5000}
                        style={{ minHeight: '200px' }}
                    />
                    <p className="text-xs text-secondary" style={{ marginTop: '0.5rem' }}>
                        {text.length}/5000 characters
                    </p>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !text.trim()}
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <div className="spinner" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Verify Text
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
