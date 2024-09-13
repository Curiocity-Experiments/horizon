import { useState, useEffect } from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from '../lib/firebase';

export function useRemoteConfig() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const remoteConfig = await getRemoteConfig();
                if (remoteConfig) {
                    await fetchAndActivate(remoteConfig);
                    const configValues = {};
                    // Add the remote config keys you want to fetch
                    // For example:
                    // configValues.someKey = (await getValue(remoteConfig, 'someKey')).asString();
                    setConfig(configValues);
                }
                setLoading(false);
            } catch (err) {
                console.error('Remote Config Error:', err);
                setError(err);
                setLoading(false);
            }
        }

        if (typeof window !== 'undefined') {
            fetchConfig();
        } else {
            setLoading(false);
        }
    }, []);

    return { config, loading, error };
}