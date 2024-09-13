import { useState, useEffect } from 'react';
import { getRemoteConfigValues } from '../lib/firebase';

export function useRemoteConfig() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getRemoteConfigValues()
        .then((values) => {
            setConfig(values);
            setLoading(false);
        })
        .catch((err) => {
            setError(err);
            setLoading(false);
        });
    }, []);

    return { config, loading, error };
}