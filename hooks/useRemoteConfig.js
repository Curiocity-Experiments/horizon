// hooks/useRemoteConfig.js

// TODO: Implement caching mechanism for remote config to reduce API calls
// TODO: Add error retry logic for better resilience
import { useState, useEffect } from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from '../lib/firebase';

export function useRemoteConfig() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchConfig() {
            // TODO: Implement timeout for fetch operation to prevent long-running requests
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
                // TODO: Implement more sophisticated error handling and reporting
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