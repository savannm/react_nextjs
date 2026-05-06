// Architecture: Server Component fetches data (REST) -> Client Component renders charts (Recharts).

import { getOverviewData, getDeviceData, getPageData, getGeoData, getSavBounce } from '@/lib/analytics';
import AnalyticsDashboard from './components/Dashboard';


export const metadata = {
    title: 'Google Analytics Dashboard',
};

/**
 * Main Analytics Dashboard Page.
 * This is a Server Component that fetches data in parallel on the server
 * before passing it down to client-side visualization components.
 */
export default async function DashboardPage() {
    try {
        // Fetch all required analytics data from analytics.ts
        const [overview, devices, pages, geo, sav] = await Promise.all([
            getOverviewData(),
            getDeviceData(),
            getPageData(),
            getGeoData(),
            getSavBounce(),
        ]);

        // Render the main dashboard shell with the fetched data
        return (
            <>
                <div>
                    <AnalyticsDashboard
                        data={overview}
                        deviceData={devices}
                        pageData={pages}
                        geoData={geo}
                        BounceData={sav}
                    />
                </div>

            </>)


    } catch (error: any) {
        // Error state: Display a user-friendly setup guide if GA credentials are missing or invalid
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Configuration Required</h2>
                    <p className="text-slate-500 mb-8">
                        Please ensure your <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-medium">.env.local</code> file contains the correct Google Analytics credentials.
                    </p>
                    <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm font-mono text-slate-600 space-y-1">
                        <div>GA_PROPERTY_ID=...</div>
                        <div>GOOGLE_ANALYTICS_CLIENT=...</div>
                        <div>GOOGLE_ANALYTICS_SECRET=...</div>
                        <div>GOOGLE_ANALYTICS_REFRESH_TOKEN=...</div>
                    </div>
                    <p className="mt-6 text-xs text-slate-400">
                        Error: {error.message || 'Failed to fetch analytics data'}
                    </p>
                </div>
            </div>
        );
    }
}


