import { useEffect, useState } from 'react';

/**
 * Module-level (in-memory) cache shared by every component in the SPA session.
 *
 * Why this exists:
 * Several pages (Home, About, Profile, Contact) independently request the same
 * backend endpoints (e.g. /content/home, /content/about, /contact/info) every
 * time they mount. Since this is a single-page app, navigating between routes
 * does NOT reload the page - so there is no reason to hit the network again
 * for data we already fetched a moment ago. This cache removes that duplicate
 * network round trip, which is the main source of the 1-3s blank state when
 * clicking between pages.
 *
 * Behavior:
 * - First request for a key: fetches over the network (unavoidable - nothing
 *   to show yet), caches the result.
 * - Any later mount (same key, same session): renders the cached data
 *   immediately, no network wait, no spinner.
 * - Concurrent requests for the same key (e.g. Home and About both mounting
 *   at once and both wanting "/content/home") are de-duplicated - only one
 *   network request is made and both callers share the result.
 * - Data considered "fresh" for STALE_AFTER_MS. After that, cached data is
 *   still shown instantly, but a background refetch is kicked off silently
 *   (stale-while-revalidate) to pick up any admin-side content edits without
 *   ever blocking the UI with a loading state.
 */

const cache = new Map(); // key -> { data, timestamp }
const inFlight = new Map(); // key -> Promise

const STALE_AFTER_MS = 60 * 1000; // 60s - portfolio content rarely changes

function isStale(entry) {
    return !entry || Date.now() - entry.timestamp > STALE_AFTER_MS;
}

function fetchAndCache(key, fetchFn) {
    if (inFlight.has(key)) {
        return inFlight.get(key);
    }

    const promise = fetchFn()
        .then((res) => {
            const data = res.data;
            cache.set(key, { data, timestamp: Date.now() });
            inFlight.delete(key);
            return data;
        })
        .catch((err) => {
            inFlight.delete(key);
            throw err;
        });

    inFlight.set(key, promise);
    return promise;
}

/**
 * @param {string} key - unique cache key, typically the API path (e.g. '/content/home')
 * @param {() => Promise} fetchFn - function that performs the axios request, e.g. () => api.get('/content/home')
 * @returns {{ data: any, error: any, loading: boolean }}
 */
export function useApiData(key, fetchFn) {
    const existing = cache.get(key);
    const [data, setData] = useState(existing?.data ?? null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(!existing);

    useEffect(() => {
        let cancelled = false;
        const entry = cache.get(key);

        if (entry) {
            // Cached data available - show it immediately, no loading state.
            setData(entry.data);
            setLoading(false);

            if (isStale(entry)) {
                // Refresh quietly in the background; do not toggle loading.
                fetchAndCache(key, fetchFn)
                    .then((freshData) => {
                        if (!cancelled) setData(freshData);
                    })
                    .catch(() => {
                        // Keep showing the last known good data if a background
                        // revalidation fails; the error is not user-facing here.
                    });
            }
            return () => {
                cancelled = true;
            };
        }

        // No cache yet for this key - this is a genuine first load, a network
        // request is unavoidable.
        setLoading(true);
        fetchAndCache(key, fetchFn)
            .then((freshData) => {
                if (!cancelled) {
                    setData(freshData);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return { data, error, loading };
}

/**
 * Clears one cache entry (or the whole cache when no key is given).
 * Exposed in case admin-side edits ever need to force public pages to
 * refetch immediately instead of waiting out STALE_AFTER_MS.
 */
export function invalidateApiCache(key) {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
}
