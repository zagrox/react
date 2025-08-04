import React, { useState, useEffect, useCallback, ReactNode, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from '../shared/components/AuthForm';
import Logout from '../shared/components/Logout';

const ELASTIC_EMAIL_API_BASE = 'https://api.elasticemail.com/v2';
const ELASTIC_EMAIL_API_V4_BASE = 'https://api.elasticemail.com/v4';
const DIRECTUS_URL = 'https://user.advering.ltd';

// --- Icon Components ---
const Icon = ({ path, className = '' }: { path: string; className?: string }) => (
  <svg className={`icon ${className}`} width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d={path} />
  </svg>
);

const ICONS = {
    DASHBOARD: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    ACCOUNT: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    BOUNCED: "M9 10l-5 5 5 5M20 4v7a4 4 0 01-4 4H4",
    CALENDAR: "M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    CAMPAIGNS: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    CHEVRON_DOWN: "M6 9l6 6 6-6",
    CLICK: "M9 11.3l3.71 2.7-1.42 1.42a.5.5 0 01-.71 0l-1.58-1.58a1 1 0 00-1.42 0l-1.42 1.42a1 1 0 000 1.42l4.24 4.24a.5.5 0 00.71 0l7.07-7.07",
    COMPLAINT: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10zM12 9v2m0 4h.01",
    CONTACTS: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    CREDIT_CARD: "M22 8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8zM6 14h4v-2H6v2z",
    DEFAULT: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    DELETE: "M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
    DOMAINS: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20",
    EMAIL_LIST: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    EYE: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    EYE_OFF: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
    KEY: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    LOGOUT: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    MAIL: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    MENU: "M3 12h18M3 6h18M3 18h18",
    PENCIL: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    PLUS: "M12 5v14m-7-7h14",
    PRICE_TAG: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7H7.01",
    PUZZLE: "M20.5 11H19v-2.14a2.5 2.5 0 0 0-2.5-2.5H14V4.5a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 6 4.5V6H3.5a2.5 2.5 0 0 0-2.5 2.5V11H2.5a2.5 2.5 0 0 1 0 5H1v2.14a2.5 2.5 0 0 0 2.5 2.5H6V23.5a2.5 2.5 0 0 0 2.5 2.5h3A2.5 2.5 0 0 0 14 23.5V22h2.5a2.5 2.5 0 0 0 2.5-2.5V17h1.5a2.5 2.5 0 0 1 0-5z",
    SEND_EMAIL: "m22 2-7 20-4-9-9-4 20-7Zm0 0L11 13 2 9l20-7Z",
    SERVER: "M23 12H1m22-6H1m0 12H1M6 6v12M18 6v12",
    STATS: "M2.9 12.9a9 9 0 0 1 12.7 0l4.4 4.4m-18.4 0 4.4-4.4a9 9 0 0 1 12.7 0M12 3v1m0 16v1M3 12h1m16 0h1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1.7-.7-.7",
    TRENDING_UP: "M23 6l-9.5 9.5-5-5L1 18",
    USER_PLUS: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM20 8v6M23 11h-6",
    VERIFY: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
    CHECK: "M20 6L9 17l-5-5",
    X_CIRCLE: "M10 10l4 4m0-4l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    LOADING_SPINNER: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
};

// --- API Helper for v2 ---
const apiFetch = async (endpoint: string, apiKey: string, options: { method?: 'GET' | 'POST', params?: Record<string, any> } = {}) => {
  const { method = 'GET', params = {} } = options;
  
  const allParams = new URLSearchParams({
    apikey: apiKey,
    ...params
  });

  const url = `${ELASTIC_EMAIL_API_BASE}${endpoint}`;
  let response;

  if (method === 'POST') {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: allParams
    });
  } else { // GET
    response = await fetch(`${url}?${allParams.toString()}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data.data;
};

// --- API Helper for v4 ---
const apiFetchV4 = async (endpoint: string, apiKey: string, options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE', params?: Record<string, any>, body?: any } = {}) => {
    const { method = 'GET', params = {}, body = null } = options;
    const queryParams = new URLSearchParams(params).toString();
    const url = `${ELASTIC_EMAIL_API_V4_BASE}${endpoint}${queryParams ? `?${queryParams}` : ''}`;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'X-ElasticEmail-ApiKey': apiKey,
        }
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.Error || 'An unknown API error occurred.';
        } catch (e) {
            // response was not json, use default message
        }
        throw new Error(errorMessage);
    }
    
    if (response.status === 204) { // Handle No Content for DELETE
        return {};
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

// --- Directus API Helpers ---
const directusFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${DIRECTUS_URL}${endpoint}`;
    const token = localStorage.getItem('directus_token');
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.errors?.[0]?.message || 'An unknown Directus API error occurred.';
        throw new Error(errorMessage);
    }
    return data.data;
};

const directusLogin = (body: any) => directusFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) });
const directusRegister = (body: any) => directusFetch('/users', { method: 'POST', body: JSON.stringify(body) });
const directusFetchMe = () => directusFetch('/users/me');
const directusUpdateMe = (body: any) => directusFetch('/users/me', { method: 'PATCH', body: JSON.stringify(body) });
const directusLogout = (refreshToken: string) => directusFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) });


// --- Custom Hook for API calls (v2) ---
const useApi = (endpoint: string, apiKey: string | null, params: Record<string, any> = {}, options: { enabled?: boolean } = {}) => {
    const { enabled = true } = options;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<{ message: string, endpoint: string } | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const paramsString = JSON.stringify(params);

    const refetch = useCallback(() => setRefetchIndex(i => i + 1), []);

    useEffect(() => {
        if (!enabled || !apiKey || !endpoint) {
            setLoading(false);
            if (!enabled) setData(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFetch(endpoint, apiKey, { params: JSON.parse(paramsString) });
                setData(result);
            } catch (err: any) {
                setError({ message: err.message, endpoint });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, apiKey, paramsString, enabled, refetchIndex]);

    return { data, loading, error, refetch };
};

// --- Custom Hook for API calls (v4) ---
const useApiV4 = (endpoint: string, apiKey: string | null, params: Record<string, any> = {}, options: { enabled?: boolean } = {}) => {
    const { enabled = true } = options;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<{ message: string, endpoint: string } | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);
    
    const paramsString = JSON.stringify(params);
    const refetch = useCallback(() => setRefetchIndex(i => i + 1), []);

    useEffect(() => {
        if (!enabled || !apiKey || !endpoint) {
            setLoading(false);
            if (!enabled) setData(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFetchV4(endpoint, apiKey, { params: JSON.parse(paramsString) });
                setData(result);
            } catch (err: any) {
                setError({ message: err.message, endpoint });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, apiKey, paramsString, enabled, refetchIndex]);

    return { data, loading, error, refetch };
};


// --- App Context for Auth and Global State ---
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    elastic_email_api_key?: string;
    role: string;
}

interface AppContextType {
    user: User | null;
    token: string | null;
    authLoading: boolean;
    isAuthenticated: boolean;
    apiKey: string | null;
    accountData: any | null;
    loadingAccount: boolean;
    login: (credentials: any) => Promise<void>;
    register: (details: any) => Promise<void>;
    logout: () => void;
    updateUserApiKey: (key: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('directus_token'));
    const [authLoading, setAuthLoading] = useState(true);

    const logout = useCallback(() => {
        const refreshToken = localStorage.getItem('directus_refresh_token');
        if (refreshToken) {
            directusLogout(refreshToken).catch(console.error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('directus_token');
        localStorage.removeItem('directus_refresh_token');
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const userData = await directusFetchMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Session check failed:", error);
                    logout();
                }
            }
            setAuthLoading(false);
        };
        checkAuth();
    }, [token, logout]);

    const handleAuthSuccess = (authData: { access_token: string, refresh_token: string }) => {
        localStorage.setItem('directus_token', authData.access_token);
        localStorage.setItem('directus_refresh_token', authData.refresh_token);
        setToken(authData.access_token);
    };

    const login = async (credentials: any) => {
        const authData = await directusLogin(credentials);
        handleAuthSuccess(authData);
    };

    const register = async (details: any) => {
        // NOTE: This assumes new users are created with a default role that allows login.
        // You must configure this role in your Directus project settings.
        // A common approach is to have a 'public' role with create permissions on the 'users' collection.
        await directusRegister(details);
        const authData = await directusLogin({ email: details.email, password: details.password });
        handleAuthSuccess(authData);
    };

    const updateUserApiKey = async (key: string) => {
        const updatedUser = await directusUpdateMe({ elastic_email_api_key: key });
        setUser(prev => prev ? { ...prev, elastic_email_api_key: updatedUser.elastic_email_api_key } : null);
    };

    const apiKey = user?.elastic_email_api_key ?? null;
    const { data: accountData, loading: loadingAccount } = useApi('/account/load', apiKey, {}, { enabled: !!apiKey });

    const value = {
        user,
        token,
        authLoading,
        isAuthenticated: !!user,
        apiKey,
        accountData,
        loadingAccount,
        login,
        register,
        logout,
        updateUserApiKey
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// --- Reusable Components ---
const Loader = () => <div className="loader"></div>;

const ActionStatus = ({ status, onDismiss }: { status: {type: 'success' | 'error', message: string} | null, onDismiss?: () => void }) => {
    useEffect(() => {
        if (status && status.type === 'success' && onDismiss) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [status, onDismiss]);

    if (!status?.message) return null;
    return (
        <div className={`action-status ${status.type}`}>
            {status.message}
            {onDismiss && <button onClick={onDismiss} className="dismiss-btn">&times;</button>}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};


const ErrorMessage = ({ error }: {error: {endpoint: string, message: string}}) => (
  <div className="error-message">
    <strong>API Error on <code>{error.endpoint}</code>:</strong> {error.message}
  </div>
);

const CenteredMessage = ({ children }: { children?: ReactNode }) => (
    <div className="centered-container" style={{height: '200px'}}>
        {children}
    </div>
);

const Badge = ({ text, type = 'default' }: {text: string, type?: string}) => (
    <span className={`badge badge-${type}`}>{text}</span>
);

const AccountDataCard = ({ iconPath, title, children }: { iconPath: string; title: string; children?: ReactNode }) => (
    <div className="card account-card">
        <div className="card-icon-wrapper">
            <Icon path={iconPath} />
        </div>
        <div className="card-details">
            <div className="card-title">{title}</div>
            <div className="card-content">{children}</div>
        </div>
    </div>
);

// --- Helper Functions ---
const getPastDateByDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}
const getPastDateByMonths = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
};
const formatDateForApiV4 = (date: Date) => {
    return date.toISOString().slice(0, 19);
};
const getPastDateByYears = (years: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
};
const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// --- View Components ---

const StatisticsView = () => {
    const { apiKey } = useAppContext();
    const [duration, setDuration] = useState('3months');

    const durationOptions: {[key: string]: {label: string, from: () => Date}} = {
        '7days': { label: 'Last 7 days', from: () => getPastDateByDays(7) },
        '14days': { label: 'Last 14 days', from: () => getPastDateByDays(14) },
        '30days': { label: 'Last 30 days', from: () => getPastDateByDays(30) },
        '3months': { label: 'Last 3 months', from: () => getPastDateByMonths(3) },
        '6months': { label: 'Last 6 months', from: () => getPastDateByMonths(6) },
        '1year': { label: 'Last year', from: () => getPastDateByYears(1) },
    };

    const apiParams = {
        from: formatDateForApiV4(durationOptions[duration].from()),
    };
    const { data: stats, loading, error } = useApiV4(`/statistics`, apiKey, apiParams, { enabled: !!apiKey });
    
    const filterControl = (
        <div className="view-controls">
            <label htmlFor="duration-select">Date Range:</label>
            <select id="duration-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                {Object.entries(durationOptions).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>
    );

    if (error) return (
        <>
            {filterControl}
            <ErrorMessage error={error} />
        </>
    );

    return (
        <>
            {filterControl}
            {loading ? (
                <CenteredMessage><Loader /></CenteredMessage>
            ) : (!stats || Object.keys(stats).length === 0) ? (
                <CenteredMessage>No statistics data found for the {durationOptions[duration].label.toLowerCase()}.</CenteredMessage>
            ) : (
                <div className="card-grid account-grid">
                    <AccountDataCard title="Total Emails" iconPath={ICONS.MAIL}>
                        {stats.EmailTotal?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Recipients" iconPath={ICONS.CONTACTS}>
                        {stats.Recipients?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Delivered" iconPath={ICONS.VERIFY}>
                        {stats.Delivered?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Opened" iconPath={ICONS.EYE}>
                        {stats.Opened?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Clicked" iconPath={ICONS.CLICK}>
                        {stats.Clicked?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Unsubscribed" iconPath={ICONS.LOGOUT}>
                        {stats.Unsubscribed?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                    <AccountDataCard title="Complaints" iconPath={ICONS.COMPLAINT}>
                        {stats.Complaints?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                     <AccountDataCard title="Bounced" iconPath={ICONS.BOUNCED}>
                        {stats.Bounced?.toLocaleString() ?? '0'}
                    </AccountDataCard>
                </div>
            )}
        </>
    );
};

const AccountView = () => {
    const { user, apiKey, accountData: data, loadingAccount: loading, updateUserApiKey } = useAppContext();
    const [newApiKey, setNewApiKey] = useState(apiKey || '');
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

    useEffect(() => {
        setNewApiKey(apiKey || '');
    }, [apiKey]);
    
    const handleSaveKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus(null);
        try {
            await updateUserApiKey(newApiKey);
            setStatus({ type: 'success', message: 'API Key updated successfully!' });
        } catch (err: any) {
            setStatus({ type: 'error', message: `Failed to update key: ${err.message}` });
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) return <CenteredMessage><Loader /></CenteredMessage>;
    if (!data || !user) return <CenteredMessage>No account data found.</CenteredMessage>;

    const getStatusType = (status: string) => {
        const cleanStatus = String(status || '').toLowerCase().replace(/\s/g, '');
        if (cleanStatus.includes('active')) return 'success';
        if (cleanStatus.includes('disabled') || cleanStatus.includes('abuse')) return 'danger';
        if (cleanStatus.includes('review') || cleanStatus.includes('verification')) return 'warning';
        return 'default';
    }

    const getReputationInfo = (reputation: number) => {
        const score = Number(reputation || 0);
        if (score >= 80) return { text: 'Excellent', className: 'good' };
        if (score >= 60) return { text: 'Good', className: 'good' };
        if (score >= 40) return { text: 'Average', className: 'medium' };
        if (score >= 20) return { text: 'Poor', className: 'bad' };
        return { text: 'Very Poor', className: 'bad' };
    };
    
    const accountStatus = data.status || 'Active';
    const statusType = getStatusType(accountStatus);
    const reputation = getReputationInfo(data.reputation);
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

    return (
        <div className="profile-view-container">
            <div className="profile-hero">
                <div className="profile-avatar">
                    <Icon path={ICONS.ACCOUNT} />
                </div>
                <div className="profile-info">
                    <h3>{fullName || 'User Profile'}</h3>
                    <p className="profile-email">{data.email}</p>
                    <div className="profile-meta">
                        <div className="meta-item">
                            <label>Public ID</label>
                            <span>{data.publicaccountid || 'N/A'}</span>
                        </div>
                        <div className="meta-item">
                            <label>Joined</label>
                            <span>{formatDateForDisplay(data.datecreated)}</span>
                        </div>
                        <div className="meta-item">
                            <label>Last Activity</label>
                            <span>{formatDateForDisplay(data.lastactivity)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ActionStatus status={status} onDismiss={() => setStatus(null)} />

            <div className="card-grid account-grid">
                <AccountDataCard title="Account Status" iconPath={ICONS.VERIFY}>
                    <Badge text={accountStatus} type={statusType} />
                </AccountDataCard>
                <AccountDataCard title="Reputation" iconPath={ICONS.TRENDING_UP}>
                    <span className={`reputation-score ${reputation.className}`}>{data.reputation ?? 0}%</span>
                    <span className="reputation-text">{reputation.text}</span>
                </AccountDataCard>
                <AccountDataCard title="Daily Send Limit" iconPath={ICONS.SEND_EMAIL}>
                    {(data.dailysendlimit ?? 0).toLocaleString()}
                </AccountDataCard>
            </div>
            
            <form className="form-container" onSubmit={handleSaveKey} style={{maxWidth: 'none', marginTop: '1rem'}}>
                 <div className="form-group full-width">
                    <label htmlFor="api-key-input">Your Elastic Email API Key</label>
                    <input id="api-key-input" type="password" value={newApiKey} onChange={e => setNewApiKey(e.target.value)} />
                    <small style={{display: 'block', marginTop: '0.5rem'}}>
                        Update your key here. It will be stored securely.
                    </small>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? <Loader /> : 'Save API Key'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const PURCHASE_WEBHOOK_URL = 'https://auto.zagrox.com/webhook-test/emailpack'; // As requested, URL is here for easy changes.

const creditPackages = [
    { credits: 10000, price: 500000 }, { credits: 20000, price: 950000 },
    { credits: 30000, price: 1350000 }, { credits: 40000, price: 1700000 },
    { credits: 50000, price: 2000000, popular: true }, { credits: 60000, price: 2340000 },
    { credits: 70000, price: 2660000 }, { credits: 80000, price: 2960000 },
    { credits: 100000, price: 3500000 }, { credits: 125000, price: 4250000 },
    { credits: 150000, price: 5000000 }, { credits: 200000, price: 6000000 },
];

const CreditHistoryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { apiKey } = useAppContext();
    const { data: history, loading, error } = useApi('/account/loademailcreditshistory', apiKey, {}, { enabled: isOpen });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Credit Purchase History">
            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}
            {!loading && !error && (
                <div className="table-container">
                    <table className="credit-history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history && Array.isArray(history.historyitems) && history.historyitems.length > 0 ? (
                                history.historyitems.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{formatDateForDisplay(item.historydate)}</td>
                                        <td>{item.notes}</td>
                                        <td className="credit-history-amount">
                                            +{item.amount?.toLocaleString() ?? '0'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No credit purchase history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};


const BuyCreditsView = () => {
    const { apiKey, user } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState<number | null>(null); // track which package is submitting
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const handlePurchase = async (pkg: {credits: number, price: number}) => {
        if (!user || !user.email) {
            setModalState({ isOpen: true, title: 'Error', message: 'User information is not available. Cannot proceed with purchase.' });
            return;
        }

        setIsSubmitting(pkg.credits);

        const params = new URLSearchParams({
            userapikey: apiKey!,
            useremail: user.email,
            amount: pkg.credits.toString(),
            totalprice: pkg.price.toString(),
        });
        
        const requestUrl = `${PURCHASE_WEBHOOK_URL}?${params.toString()}`;

        try {
            const response = await fetch(requestUrl, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Webhook failed with status: ${response.status}. ${errorText}`);
            }

            setModalState({
                isOpen: true,
                title: 'Purchase Initiated',
                message: `You have selected the ${pkg.credits.toLocaleString()} credit package. You will be redirected to complete your payment.`
            });

        } catch (error: any) {
            console.error('Purchase webhook error:', error);
            setModalState({
                isOpen: true,
                title: 'Purchase Failed',
                message: `There was an error processing your request. Please try again later. (Error: ${error.message})`
            });
        } finally {
            setIsSubmitting(null);
        }
    };
    
    const closeModal = () => setModalState({ isOpen: false, title: '', message: '' });

    return (
        <div className="buy-credits-view">
            <div className="view-header">
                <h3>Choose a Package</h3>
                <button className="btn" onClick={() => setIsHistoryOpen(true)}>
                    <Icon path={ICONS.CALENDAR} />
                    View History
                </button>
            </div>
            <CreditHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

            <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.title}>
                <p style={{whiteSpace: "pre-wrap"}}>{modalState.message}</p>
                 {modalState.title === 'Purchase Initiated' && (
                    <small style={{display: 'block', marginTop: '1rem', color: 'var(--subtle-text-color)'}}>
                        This is a test environment. No real payment will be processed.
                    </small>
                )}
            </Modal>
            <div className="packages-grid">
                {creditPackages.map((pkg) => (
                    <div key={pkg.credits} className={`card package-card ${pkg.popular ? 'popular' : ''}`}>
                        {pkg.popular && <div className="popular-badge">Most Popular</div>}
                        <div className="package-card-header">
                            <h3>{pkg.credits.toLocaleString()}</h3>
                            <span>Email Credits</span>
                        </div>
                        <div className="package-card-body">
                            <div className="package-price">
                                {pkg.price.toLocaleString()}
                                <span> IRT</span>
                            </div>
                        </div>
                        <div className="package-card-footer">
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePurchase(pkg)}
                                disabled={isSubmitting !== null}
                            >
                                {isSubmitting === pkg.credits ? <Loader /> : 'Purchase Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="webhook-info">
                <p>
                    <strong>Developer Note:</strong> To change the purchase webhook URL, edit the <code>PURCHASE_WEBHOOK_URL</code> constant at the top of the <code>BuyCreditsView</code> component in <code>index.tsx</code>.
                </p>
            </div>
        </div>
    );
};

const DashboardView = ({ setView }: { setView: (view: string) => void }) => {
    const { apiKey, accountData: user } = useAppContext();
    const { data: statsData, loading: statsLoading, error: statsError } = useApiV4(`/statistics`, apiKey, { from: formatDateForApiV4(getPastDateByDays(30)) });

    const navItems = [
        { name: 'Statistics', icon: ICONS.STATS, desc: 'View detailed sending statistics and analytics.', view: 'Statistics' },
        { name: 'Contacts', icon: ICONS.CONTACTS, desc: 'Manage your contacts, lists, and segments.', view: 'Contacts' },
        { name: 'Send Email', icon: ICONS.SEND_EMAIL, desc: 'Compose and send a new email campaign.', view: 'Send Email' },
        { name: 'Campaigns', icon: ICONS.CAMPAIGNS, desc: 'Review your past and ongoing email campaigns.', view: 'Campaigns' },
        { name: 'Domains', icon: ICONS.DOMAINS, desc: 'Manage and verify your sending domains.', view: 'Domains' },
        { name: 'SMTP', icon: ICONS.SERVER, desc: 'Get your SMTP credentials for integration.', view: 'SMTP' },
    ];
    
    if (!user) return <CenteredMessage><Loader /></CenteredMessage>;
    if (statsError) console.warn("Could not load dashboard stats:", statsError);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Welcome, {user?.firstname || 'User'}!</h2>
                    <p>Here's a quick overview of your MegaMail account. Ready to launch your next campaign?</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn" onClick={() => setView('Contacts')}><Icon path={ICONS.USER_PLUS} /> Manage Contacts</button>
                    <button className="btn btn-primary" onClick={() => setView('Send Email')}><Icon path={ICONS.SEND_EMAIL} /> Send an Email</button>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                 <AccountDataCard title="Sending Reputation" iconPath={ICONS.TRENDING_UP}>
                    {user?.reputation ? `${user.reputation}%` : 'N/A'}
                </AccountDataCard>
                <AccountDataCard title="Emails Sent (30d)" iconPath={ICONS.MAIL}>
                    {statsLoading ? '...' : (statsData?.EmailTotal?.toLocaleString() ?? '0')}
                </AccountDataCard>
                 <AccountDataCard title="Total Contacts" iconPath={ICONS.CONTACTS}>
                    {user?.contactcount?.toLocaleString() ?? '0'}
                </AccountDataCard>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h3>Explore Your Tools</h3>
                    <p>Access all of MegaMail's powerful features from one place.</p>
                </div>
                <div className="dashboard-nav-grid">
                    {navItems.map(item => (
                        <div key={item.name} className="card nav-card clickable" onClick={() => setView(item.view)}>
                            <Icon path={item.icon} className="nav-card-icon" />
                            <div className="nav-card-title">{item.name}</div>
                            <div className="nav-card-description">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-branding-footer">
                <p>MegaMail by <strong>ZAGROX</strong> & Powered by <strong>Mailzila.com</strong></p>
            </div>
        </div>
    );
};

// --- START OF IMPLEMENTED VIEWS ---

const ContactsView = () => {
    const { apiKey } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionStatus, setActionStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const CONTACTS_PER_PAGE = 20;

    const { data: contacts, loading, error, refetch } = useApiV4('/contacts', apiKey, { limit: CONTACTS_PER_PAGE, offset, search: searchQuery }, { enabled: !!apiKey });

    const handleAddContact = async (contactData: {Email: string, FirstName: string, LastName: string}) => {
        try {
            await apiFetchV4('/contacts', apiKey!, { method: 'POST', body: [contactData] });
            setActionStatus({ type: 'success', message: `Contact ${contactData.Email} added successfully!` });
            setIsModalOpen(false);
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to add contact: ${err.message}` });
        }
    };
    
    const handleDeleteContact = async (email: string) => {
        if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
        try {
            await apiFetchV4(`/contacts/${encodeURIComponent(email)}`, apiKey!, { method: 'DELETE' });
            setActionStatus({ type: 'success', message: `Contact ${email} deleted successfully!` });
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to delete contact: ${err.message}` });
        }
    };

    return (
        <div>
            <ActionStatus status={actionStatus} onDismiss={() => setActionStatus(null)} />
            <div className="view-header contacts-header">
                <div className="search-bar">
                    <input
                        type="search"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setOffset(0); // Reset to first page on search
                        }}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Icon path={ICONS.USER_PLUS} /> Add Contact
                </button>
            </div>

            <Modal title="Add New Contact" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddContactForm onSubmit={handleAddContact} />
            </Modal>

            {loading && !contacts && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}

            <div className="table-container">
                {loading && contacts && (
                    <div className="table-overlay-loader">
                        <Loader /> Loading...
                    </div>
                )}
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Status</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts?.length > 0 ? (
                            contacts.map((contact: any) => (
                                <tr key={contact.Email}>
                                    <td>{contact.Email}</td>
                                    <td>{contact.FirstName || '-'}</td>
                                    <td>{contact.LastName || '-'}</td>
                                    <td><Badge text={contact.Status} type={contact.Status === 'Active' ? 'success' : 'default'}/></td>
                                    <td>{formatDateForDisplay(contact.DateAdded)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteContact(contact.Email)} aria-label="Delete contact">
                                                <Icon path={ICONS.DELETE} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No contacts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {contacts && (
                <div className="pagination-controls">
                    <button onClick={() => setOffset(o => Math.max(0, o - CONTACTS_PER_PAGE))} disabled={offset === 0 || loading}>
                        Previous
                    </button>
                    <span>Page {offset / CONTACTS_PER_PAGE + 1}</span>
                    <button onClick={() => setOffset(o => o + CONTACTS_PER_PAGE)} disabled={contacts.length < CONTACTS_PER_PAGE || loading}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

const AddContactForm = ({ onSubmit }: { onSubmit: (data: {Email: string, FirstName: string, LastName: string}) => void }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ Email: email, FirstName: firstName, LastName: lastName });
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-grid">
                 <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                 <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
            </div>
            <button type="submit" className="btn btn-primary full-width">Add Contact</button>
        </form>
    );
};


const EmailListView = () => {
    const { apiKey } = useAppContext();
    const [actionStatus, setActionStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [newListName, setNewListName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: lists, loading, error, refetch } = useApiV4('/lists', apiKey, {}, { enabled: !!apiKey });

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName) return;
        setIsSubmitting(true);
        try {
            await apiFetchV4('/lists', apiKey!, { method: 'POST', body: { ListName: newListName } });
            setActionStatus({ type: 'success', message: `List "${newListName}" created.` });
            setNewListName('');
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to create list: ${err.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteList = async (listName: string) => {
        if (!window.confirm(`Are you sure you want to delete the list "${listName}"? This cannot be undone.`)) return;
        try {
            await apiFetchV4(`/lists/${encodeURIComponent(listName)}`, apiKey!, { method: 'DELETE' });
            setActionStatus({ type: 'success', message: `List "${listName}" deleted.` });
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to delete list: ${err.message}` });
        }
    };

    return (
        <div>
            <ActionStatus status={actionStatus} onDismiss={() => setActionStatus(null)} />
            <div className="view-header">
                <form className="create-list-form" onSubmit={handleCreateList}>
                    <input
                        type="text"
                        placeholder="New list name..."
                        value={newListName}
                        onChange={e => setNewListName(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!newListName || isSubmitting}>
                        {isSubmitting ? <Loader /> : <><Icon path={ICONS.PLUS}/> Create List</>}
                    </button>
                </form>
            </div>
            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}
            {!loading && lists?.length === 0 && <CenteredMessage>No email lists found. Create one above to get started.</CenteredMessage>}
            <div className="card-grid list-grid">
                {lists?.map((list: any) => (
                    <div key={list.ListName} className="card list-card">
                        <div className="list-card-header">
                            <h3>{list.ListName}</h3>
                        </div>
                        <div className="list-card-body">
                            <div className="list-card-stat">
                                <span>Contacts</span>
                                <strong>{list.Count?.toLocaleString() ?? '0'}</strong>
                            </div>
                        </div>
                        <div className="list-card-footer">
                             <span>Created: {formatDateForDisplay(list.DateAdded)}</span>
                            <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteList(list.ListName)} aria-label="Delete list">
                                <Icon path={ICONS.DELETE} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SegmentsView = () => {
    const { apiKey } = useAppContext();
    const [actionStatus, setActionStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { data: segments, loading, error, refetch } = useApiV4('/segments', apiKey, {}, { enabled: !!apiKey });

    const handleCreateSegment = async (segmentData: {Name: string, Rule: string}) => {
        try {
            await apiFetchV4('/segments', apiKey!, { method: 'POST', body: segmentData });
            setActionStatus({ type: 'success', message: `Segment "${segmentData.Name}" created.` });
            setIsModalOpen(false);
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to create segment: ${err.message}` });
        }
    };

    const handleDeleteSegment = async (segmentName: string) => {
        if (!window.confirm(`Are you sure you want to delete the segment "${segmentName}"?`)) return;
        try {
            await apiFetchV4(`/segments/${encodeURIComponent(segmentName)}`, apiKey!, { method: 'DELETE' });
            setActionStatus({ type: 'success', message: `Segment "${segmentName}" deleted.` });
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to delete segment: ${err.message}` });
        }
    };

    return (
        <div>
            <ActionStatus status={actionStatus} onDismiss={() => setActionStatus(null)} />
            <div className="view-header">
                <h3>Your Segments</h3>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Icon path={ICONS.PLUS} /> Create Segment
                </button>
            </div>

            <Modal title="Create New Segment" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateSegmentForm onSubmit={handleCreateSegment} />
            </Modal>

            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && <ErrorMessage error={error} />}
            {!loading && segments?.length === 0 && <CenteredMessage>No segments found. Create one to get started.</CenteredMessage>}
            <div className="card-grid">
                {segments?.map((segment: any) => (
                    <div key={segment.Name} className="card segment-card">
                        <div className="segment-card-header">
                            <h3>{segment.Name}</h3>
                            <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteSegment(segment.Name)} aria-label="Delete segment">
                                <Icon path={ICONS.DELETE} />
                            </button>
                        </div>
                        <div className="segment-card-body">
                             <label>Rule</label>
                             <div className="segment-rule">{segment.Rule}</div>
                        </div>
                        <div className="segment-card-footer">
                           <span>Contacts</span>
                           <strong>{segment.ContactsCount?.toLocaleString() ?? 'N/A'}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreateSegmentForm = ({ onSubmit }: { onSubmit: (data: {Name: string, Rule: string}) => void }) => {
    const [name, setName] = useState('');
    const [rule, setRule] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ Name: name, Rule: rule });
    };

    // A simple text area for the rule for now, as a full UI builder is very complex.
    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
                <label htmlFor="segmentName">Segment Name</label>
                <input id="segmentName" type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="segmentRule">Rule</label>
                <textarea id="segmentRule" value={rule} onChange={e => setRule(e.target.value)} required placeholder="Example: Country = 'Canada' AND ConsentTracked = 'true'"></textarea>
                 <small style={{marginTop: '0.5rem', display: 'block'}}>
                    Enter a rule using Elastic Email's segmentation query language.
                </small>
            </div>
            <button type="submit" className="btn btn-primary full-width">Create Segment</button>
        </form>
    );
}

const SendEmailView = () => {
    const { apiKey, user } = useAppContext();
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        from: user?.email || '',
        fromName: '',
        bodyHtml: '',
        target: 'all', // all, list, segment
        targetName: ''
    });

    const { data: lists } = useApiV4('/lists', apiKey);
    const { data: segments } = useApiV4('/segments', apiKey);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setSendStatus(null);
        
        const params: Record<string, any> = {
            subject: formData.subject,
            from: formData.from,
            fromName: formData.fromName,
            bodyHtml: formData.bodyHtml,
        };

        if(formData.target === 'all') {
            params.to = 'All Contacts';
        } else if (formData.target === 'list') {
            params.listName = formData.targetName;
        } else if (formData.target === 'segment') {
            params.segmentName = formData.targetName;
        }

        try {
            await apiFetch('/email/send', apiKey!, { method: 'POST', params });
            setSendStatus({ type: 'success', message: 'Email sent successfully!' });
        } catch (err: any) {
            setSendStatus({ type: 'error', message: `Failed to send email: ${err.message}` });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label htmlFor="subject">Subject</label>
                    <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="from">From Email</label>
                    <input id="from" name="from" type="email" value={formData.from} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="fromName">From Name</label>
                    <input id="fromName" name="fromName" type="text" value={formData.fromName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="target">Send To</label>
                    <select id="target" name="target" value={formData.target} onChange={handleChange}>
                        <option value="all">All Contacts</option>
                        <option value="list">A List</option>
                        <option value="segment">A Segment</option>
                    </select>
                </div>

                <div className="form-group">
                    {formData.target === 'list' && (
                        <>
                         <label htmlFor="targetName">Select List</label>
                         <select id="targetName" name="targetName" value={formData.targetName} onChange={handleChange} required>
                             <option value="">-- Choose a list --</option>
                             {lists?.map((l: any) => <option key={l.ListName} value={l.ListName}>{l.ListName}</option>)}
                         </select>
                        </>
                    )}
                    {formData.target === 'segment' && (
                        <>
                        <label htmlFor="targetName">Select Segment</label>
                        <select id="targetName" name="targetName" value={formData.targetName} onChange={handleChange} required>
                            <option value="">-- Choose a segment --</option>
                             {segments?.map((s: any) => <option key={s.Name} value={s.Name}>{s.Name}</option>)}
                        </select>
                        </>
                    )}
                </div>

                <div className="form-group full-width">
                    <label htmlFor="bodyHtml">Email Body (HTML)</label>
                    <textarea id="bodyHtml" name="bodyHtml" value={formData.bodyHtml} onChange={handleChange} required></textarea>
                </div>
                <div className="form-actions">
                    {sendStatus && <div className={`send-status-message ${sendStatus.type}`}>{sendStatus.message}</div>}
                    <button type="submit" className="btn btn-primary" disabled={isSending}>
                        {isSending ? <Loader /> : 'Send Email'}
                    </button>
                </div>
            </div>
        </form>
    );
};

const CampaignCardSkeleton = () => (
    <div className="campaign-card">
        <div className="campaign-card-header">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-badge"></div>
        </div>
        <div className="campaign-card-body">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
        </div>
        <div className="campaign-stats">
            <div>
                <span>Recipients</span>
                <div className="skeleton skeleton-stat"></div>
            </div>
            <div>
                <span>Opened</span>
                <div className="skeleton skeleton-stat"></div>
            </div>
            <div>
                <span>Clicked</span>
                <div className="skeleton skeleton-stat"></div>
            </div>
        </div>
        <div className="campaign-card-footer">
            <div className="skeleton skeleton-text" style={{width: '40%'}}></div>
        </div>
    </div>
);

const CampaignsView = () => {
    const { apiKey } = useAppContext();
    const { data: campaigns, loading, error } = useApiV4('/campaigns', apiKey, {}, { enabled: !!apiKey });
    
    const getBadgeTypeForStatus = (statusName: string | undefined) => {
        const lowerStatus = (statusName || '').toLowerCase();
        if (lowerStatus === 'sent') return 'success';
        if (lowerStatus === 'draft') return 'default';
        if (lowerStatus === 'processing' || lowerStatus === 'sending') return 'info';
        if (lowerStatus === 'cancelled') return 'warning';
        return 'default';
    }

    if (loading) {
        return (
            <div className="campaign-grid">
                {Array.from({ length: 6 }).map((_, index) => <CampaignCardSkeleton key={index} />)}
            </div>
        );
    }
    
    if (error) return <ErrorMessage error={error} />;
    
    if (!campaigns || campaigns.length === 0) {
        return <CenteredMessage>No campaigns found.</CenteredMessage>;
    }

    return (
        <div className="campaign-grid">
            {campaigns.map((campaign: any) => (
                <div key={campaign.Name} className="campaign-card">
                    <div className="campaign-card-header">
                        <h3>{campaign.Name}</h3>
                        <Badge text={campaign.Status?.Name ?? 'Unknown'} type={getBadgeTypeForStatus(campaign.Status?.Name)} />
                    </div>
                    <div className="campaign-card-body">
                        <p className="campaign-subject">
                            {campaign.Content?.[0]?.Subject || 'No Subject'}
                        </p>
                    </div>
                    <div className="campaign-stats">
                        <div>
                            <span>Recipients</span>
                            <strong>{campaign.Status?.Recipients?.toLocaleString() ?? '0'}</strong>
                        </div>
                        <div>
                            <span>Opened</span>
                            <strong>{campaign.Status?.Opened?.toLocaleString() ?? '0'}</strong>
                        </div>
                        <div>
                            <span>Clicked</span>
                            <strong>{campaign.Status?.Clicked?.toLocaleString() ?? '0'}</strong>
                        </div>
                    </div>
                    <div className="campaign-card-footer">
                       <span>Sent: {formatDateForDisplay(campaign.Content?.[0]?.DateAdded)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DNS_RECORDS_CONFIG = {
    SPF: {
        type: 'TXT',
        name: (domain: string) => domain,
        expectedValue: 'v=spf1 a mx include:mailzila.com ~all',
        check: (data: string) => data.includes('v=spf1') && data.includes('include:mailzila.com'),
        host: '@ or your domain',
    },
    DKIM: {
        type: 'TXT',
        name: (domain: string) => `api._domainkey.${domain}`,
        expectedValue: 'k=rsa;t=s;p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbmGbQMzYeMvxwtNQoXN0waGYaciuKx8mtMh5czguT4EZlJXuCt6V+l56mmt3t68FEX5JJ0q4ijG71BGoFRkl87uJi7LrQt1ZZmZCvrEII0YO4mp8sDLXC8g1aUAoi8TJgxq2MJqCaMyj5kAm3Fdy2tzftPCV/lbdiJqmBnWKjtwIDAQAB',
        check: (data: string) => data.includes('k=rsa;') && data.includes('p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbmGbQMzYeMvxwtNQoXN0waGYaciuKx8mtMh5czguT4EZlJXuCt6V+l56mmt3t68FEX5JJ0q4ijG71BGoFRkl87uJi7LrQt1ZZmZCvrEII0YO4mp8sDLXC8g1aUAoi8TJgxq2MJqCaMyj5kAm3Fdy2tzftPCV/lbdiJqmBnWKjtwIDAQAB'),
        host: 'api._domainkey',
    },
    Tracking: {
        type: 'CNAME',
        name: (domain: string) => `tracking.${domain}`,
        expectedValue: 'app.mailzila.com',
        check: (data: string) => data.includes('app.mailzila.com'),
        host: 'tracking',
    },
    DMARC: {
        type: 'TXT',
        name: (domain: string) => `_dmarc.${domain}`,
        expectedValue: 'v=DMARC1;p=none;pct=10;aspf=r;adkim=r;',
        check: (data: string) => data.includes('v=DMARC1'),
        host: '_dmarc',
    },
};

type VerificationStatus = 'idle' | 'checking' | 'verified' | 'failed';

const VerificationStatusIndicator = ({ status }: { status: VerificationStatus }) => {
    switch (status) {
        case 'checking':
            return <span className="verification-status status-checking"><Icon path={ICONS.LOADING_SPINNER} className="icon-spinner" /> Checking...</span>;
        case 'verified':
            return <span className="verification-status status-verified"><Icon path={ICONS.CHECK} className="icon-success" /> Verified</span>;
        case 'failed':
            return <span className="verification-status status-failed"><Icon path={ICONS.X_CIRCLE} className="icon-danger" /> Not Verified</span>;
        default:
            return null;
    }
};

const DomainVerificationChecker = ({ domainName }: { domainName: string }) => {
    const [statuses, setStatuses] = useState<Record<string, { status: VerificationStatus }>>(
      Object.keys(DNS_RECORDS_CONFIG).reduce((acc, key) => ({ ...acc, [key]: { status: 'idle' } }), {})
    );
    const [isChecking, setIsChecking] = useState(false);

    const checkAllDns = async () => {
        setIsChecking(true);
        setStatuses(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: { status: 'checking' } }), {}));

        for (const [key, config] of Object.entries(DNS_RECORDS_CONFIG)) {
            try {
                const response = await fetch(`https://dns.google/resolve?name=${config.name(domainName)}&type=${config.type}`);
                if (!response.ok) {
                    throw new Error(`DNS lookup failed with status ${response.status}`);
                }
                const result = await response.json();
                
                let isVerified = false;
                if (result.Status === 0 && result.Answer) {
                    const foundRecord = result.Answer.find((ans: any) => config.check(ans.data.replace(/"/g, '')));
                    if (foundRecord) {
                        isVerified = true;
                    }
                }
                setStatuses(prev => ({ ...prev, [key]: { status: isVerified ? 'verified' : 'failed' } }));

            } catch (error) {
                console.error(`Error checking ${key}:`, error);
                setStatuses(prev => ({ ...prev, [key]: { status: 'failed' } }));
            }
        }
        setIsChecking(false);
    };

    return (
        <div className="domain-verification-checker">
            <button className="btn check-all-btn" onClick={checkAllDns} disabled={isChecking}>
                {isChecking ? <Loader /> : <Icon path={ICONS.VERIFY} />}
                {isChecking ? 'Checking DNS...' : 'Check DNS Status'}
            </button>
            <div className="dns-records-list">
                {Object.entries(DNS_RECORDS_CONFIG).map(([key, config]) => (
                    <div className="dns-record-item" key={key}>
                        <div className="dns-record-item-header">
                            <h4>{key} Record</h4>
                            <VerificationStatusIndicator status={statuses[key]?.status} />
                        </div>
                        <div className="dns-record-details">
                            <div className="detail"><strong>Host:</strong> <code>{config.host}</code></div>
                            <div className="detail"><strong>Type:</strong> <code>{config.type}</code></div>
                            <div className="detail"><strong>Value:</strong> <code>{config.expectedValue}</code></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DomainsView = () => {
    const { apiKey } = useAppContext();
    const [actionStatus, setActionStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [newDomain, setNewDomain] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

    const { data, loading, error, refetch } = useApiV4('/domains', apiKey, {}, { enabled: !!apiKey });

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain) return;
        setIsSubmitting(true);
        try {
            await apiFetchV4('/domains', apiKey!, { method: 'POST', body: { Domain: newDomain } });
            setActionStatus({ type: 'success', message: `Domain "${newDomain}" added. Please add DNS records and verify.` });
            setNewDomain('');
            setExpandedDomain(null);
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to add domain: ${err.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteDomain = async (domainName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${domainName}"?`)) return;
        try {
            await apiFetchV4(`/domains/${encodeURIComponent(domainName)}`, apiKey!, { method: 'DELETE' });
            setActionStatus({ type: 'success', message: `Domain "${domainName}" deleted.` });
            setExpandedDomain(null);
            refetch();
        } catch (err: any) {
            setActionStatus({ type: 'error', message: `Failed to delete domain: ${err.message}` });
        }
    };
    
    const domainsList = Array.isArray(data) ? data : (data && Array.isArray(data.Data)) ? data.Data : [];
    const isNotFoundError = error && (error.message.includes('Not Found') || error.message.includes('not found'));
    const showNoDomainsMessage = !loading && !error && domainsList.length === 0;

    return (
        <div>
            <ActionStatus status={actionStatus} onDismiss={() => setActionStatus(null)} />
             <div className="view-header">
                <form className="add-domain-form" onSubmit={handleAddDomain}>
                    <input
                        type="text"
                        placeholder="example.com"
                        value={newDomain}
                        onChange={e => setNewDomain(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!newDomain || isSubmitting}>
                        {isSubmitting ? <Loader /> : <><Icon path={ICONS.PLUS}/> Add Domain</>}
                    </button>
                </form>
            </div>
            {loading && <CenteredMessage><Loader /></CenteredMessage>}
            {error && !isNotFoundError && <ErrorMessage error={error} />}
            {showNoDomainsMessage && <CenteredMessage>No domains found. Add one to start sending.</CenteredMessage>}
            
            {domainsList.length > 0 && <div className="card-grid domain-grid">
                {domainsList.map((domain: any) => {
                    const domainName = domain.Domain || domain.domain;
                    if (!domainName) return null;
                    
                    const isSpfVerified = String(domain.Spf || domain.spf).toLowerCase() === 'true';
                    const isDkimVerified = String(domain.Dkim || domain.dkim).toLowerCase() === 'true';
                    const isMxVerified = String(domain.MX || domain.mx).toLowerCase() === 'true';
                    const trackingStatus = domain.TrackingStatus || domain.trackingstatus;
                    const isTrackingVerified = String(trackingStatus).toLowerCase() === 'validated';
                    const isExpanded = expandedDomain === domainName;

                    return (
                        <div key={domainName} className="card domain-card">
                            <div className="domain-card-header">
                                <h3>{domainName}</h3>
                                <div className="action-buttons">
                                    <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteDomain(domainName)} aria-label={`Delete ${domainName}`}>
                                        <Icon path={ICONS.DELETE} />
                                    </button>
                                </div>
                            </div>
                            <div className="domain-card-body">
                                <div className="domain-card-statuses">
                                    <div><span>SPF</span> <Badge text={isSpfVerified ? 'Verified' : 'Missing'} type={isSpfVerified ? 'success' : 'warning'} /></div>
                                    <div><span>DKIM</span> <Badge text={isDkimVerified ? 'Verified' : 'Missing'} type={isDkimVerified ? 'success' : 'warning'} /></div>
                                    <div><span>Tracking</span> <Badge text={isTrackingVerified ? 'Verified' : 'Missing'} type={isTrackingVerified ? 'success' : 'warning'} /></div>
                                    <div><span>MX</span> <Badge text={isMxVerified ? 'Verified' : 'Missing'} type={isMxVerified ? 'success' : 'warning'} /></div>
                                </div>
                            </div>
                            <div className="domain-card-footer" onClick={() => setExpandedDomain(d => d === domainName ? null : domainName)} role="button" aria-expanded={isExpanded}>
                                <span>Show DNS & Verify</span>
                                <Icon path={ICONS.CHEVRON_DOWN} className={isExpanded ? 'expanded' : ''} />
                            </div>
                            {isExpanded && <DomainVerificationChecker domainName={domainName} />}
                        </div>
                    )
                })}
            </div>}
        </div>
    );
};


const SmtpView = () => {
    const { apiKey, user } = useAppContext();
    if (!user) return <CenteredMessage><Loader /></CenteredMessage>;

    const smtpDetails = {
        server: 'smtp.elasticemail.com',
        ports: '25, 2525, 587, 465 (SSL)'
    };

    return (
        <div className="card-grid smtp-grid">
            <div className="card smtp-card">
                <div className="smtp-card-header">
                    <h3>SMTP Credentials</h3>
                </div>
                <div className="smtp-card-body">
                    <div className="smtp-detail-item"><label>Server</label> <strong>{smtpDetails.server}</strong></div>
                    <div className="smtp-detail-item"><label>Ports</label> <strong>{smtpDetails.ports}</strong></div>
                    <div className="smtp-detail-item full-span"><label>Username</label> <strong className="monospace">{user.email}</strong></div>
                    <div className="smtp-detail-item full-span">
                        <label>Password</label>
                        <div className="secret-value-wrapper">
                            <input type="password" value={apiKey!} readOnly />
                            <button className="btn" onClick={() => navigator.clipboard.writeText(apiKey!)}>Copy</button>
                        </div>
                        <small style={{display: 'block', marginTop: '0.5rem'}}>Your password is your API Key.</small>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- END OF IMPLEMENTED VIEWS ---


// --- Main App & Auth Flow ---
const AuthView = () => {
    const { login, register } = useAppContext();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await login({ email: form.email, password: form.password });
            } else {
                await register({
                    email: form.email,
                    password: form.password,
                    first_name: form.first_name,
                    last_name: form.last_name,
                });
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError('');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="logo-font">MegaMail</h1>
                <p>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <>
                             <div className="form-group">
                                <input name="first_name" type="text" value={form.first_name} onChange={handleInputChange} placeholder="First Name" required disabled={isLoading} />
                            </div>
                             <div className="form-group">
                                <input name="last_name" type="text" value={form.last_name} onChange={handleInputChange} placeholder="Last Name" required disabled={isLoading} />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <input name="email" type="email" value={form.email} onChange={handleInputChange} placeholder="Email Address" required disabled={isLoading} />
                    </div>
                    <div className="form-group">
                        <input name="password" type="password" value={form.password} onChange={handleInputChange} placeholder="Password" required disabled={isLoading} />
                    </div>
                    
                    {error && <div className="action-status error">{error}</div>}
                    
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading && <Loader />}
                        <span>{isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}</span>
                    </button>
                </form>
                <button onClick={toggleMode} className="toggle-auth-btn">
                    {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
};

const ApiKeySetupView = () => {
    const { updateUserApiKey } = useAppContext();
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await apiFetch('/account/load', apiKey); // Verify key first
            await updateUserApiKey(apiKey);
        } catch (err: any) {
            setError(err.message || "Invalid API key or failed to save.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="logo-font">One More Step</h1>
                <p>Please provide your Elastic Email API key to continue.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Your Elastic Email API Key"
                            required
                            disabled={isLoading}
                        />
                    </div>
                     {error && <div className="action-status error">{error}</div>}
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading && <Loader />}
                        <span>{isLoading ? 'Verifying & Saving...' : 'Save and Continue'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};


const views: { [key: string]: React.ComponentType<any> } = {
    Dashboard: DashboardView,
    Statistics: StatisticsView,
    Account: AccountView,
    Contacts: ContactsView,
    'Email Lists': EmailListView,
    Segments: SegmentsView,
    'Send Email': SendEmailView,
    Campaigns: CampaignsView,
    Domains: DomainsView,
    SMTP: SmtpView,
    'Buy Credits': BuyCreditsView
};

const getIconForView = (viewName: string) => {
    const normalizedName = viewName.toUpperCase().replace(/\s+/g, '_');
    return (ICONS as Record<string, string>)[normalizedName] || ICONS.DEFAULT;
};

const AppContent = () => {
    const { authLoading, isAuthenticated, apiKey, loadingAccount } = useAppContext();
    const [view, setView] = useState('Dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [view]);

    if (authLoading) {
      return (
        <div className="auth-container">
          <Loader />
        </div>
      );
    }
    
    if (!isAuthenticated) {
        return <AuthView />;
    }
    
    if (!apiKey) {
        return <ApiKeySetupView />;
    }

    if (loadingAccount) {
         return (
            <div className="auth-container">
                <Loader />
            </div>
        );
    }

    const renderView = () => {
        const Component = views[view] || DashboardView;
        return <Component setView={setView} />;
    };

    return (
        <div className={`app-container ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <Sidebar view={view} setView={setView} />
            <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
            <main className="main-wrapper">
                <MobileHeader
                    viewTitle={view}
                    onMenuClick={() => setMobileMenuOpen(true)}
                />
                <div className="content">
                    <div className="content-header">
                        <h2>{view}</h2>
                    </div>
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

const Sidebar = ({ view, setView }: { view: string, setView: (view: string) => void }) => {
    const { logout } = useAppContext();
    const mainNavItems = ['Dashboard', 'Statistics', 'Contacts', 'Email Lists', 'Segments', 'Send Email', 'Campaigns', 'Domains', 'SMTP'];

    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-header logo-font">MegaMail</div>
                <nav className="nav">
                    {mainNavItems.map(name => (
                        <button key={name} onClick={() => setView(name)} className={`nav-btn ${view === name ? 'active' : ''}`}>
                            <Icon path={getIconForView(name)} />
                            <span>{name}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="sidebar-footer-nav">
                 <button onClick={() => setView('Account')} className={`nav-btn ${view === 'Account' ? 'active' : ''}`}>
                    <Icon path={ICONS.ACCOUNT} />
                    <span>User Profile</span>
                </button>
                <button onClick={() => setView('Buy Credits')} className={`nav-btn ${view === 'Buy Credits' ? 'active' : ''}`}>
                    <Icon path={ICONS.CREDIT_CARD} />
                    <span>Buy Credits</span>
                </button>
                <button onClick={() => logout()} className="nav-btn logout-btn">
                    <Icon path={ICONS.LOGOUT} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}

const MobileHeader = ({ viewTitle, onMenuClick }: { viewTitle: string, onMenuClick: () => void }) => {
    return (
        <header className="mobile-header">
            <button className="mobile-menu-toggle" onClick={onMenuClick} aria-label="Open menu">
                <Icon path={ICONS.MENU} />
            </button>
            <h1 className="mobile-header-title">{viewTitle}</h1>
            <div className="mobile-header-placeholder"></div>
        </header>
    );
}

const App = () => {
    const handleLogin = async (data) => {
        // Implement login logic using directus
    };

    const handleRegister = async (data) => {
        // Implement registration logic using directus
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AuthForm title="Login" submitButtonTitle="Login" onSubmit={handleLogin} linkText="Register" linkHref="/register" />} />
                <Route path="/register" element={<AuthForm title="Register" submitButtonTitle="Register" onSubmit={handleRegister} linkText="Login" linkHref="/login" />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
