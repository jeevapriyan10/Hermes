import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export default function MessageBanner({ message, onClose }) {
    if (!message) return null;

    const { type, text } = message;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    const alertClass = `alert alert-${type}`;

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '90%',
            maxWidth: '600px',
        }}>
            <div className={alertClass} style={{ position: 'relative' }}>
                <div className="flex items-center gap-sm">
                    {getIcon()}
                    <p style={{ flex: 1, margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
