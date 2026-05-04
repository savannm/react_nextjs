import 'server-only';
import { google } from "googleapis";

async function getAccessToken() {
    const client_id = process.env.GOOGLE_ANALYTICS_CLIENT;
    const client_secret = process.env.GOOGLE_ANALYTICS_SECRET;
    const refresh_token = process.env.GOOGLE_ANALYTICS_REFRESH_TOKEN;

    if (!client_id || !client_secret || !refresh_token) {
        throw new Error('Missing Google Analytics authentication credentials');
    }

    const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
    oauth2Client.setCredentials({ refresh_token });

    const { token } = await oauth2Client.getAccessToken();
    if (!token) throw new Error('Failed to get access token');
    return token;
}

export async function getOverviewData(startDate: string = '30daysAgo', endDate: string = 'today') {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
        throw new Error('GA_PROPERTY_ID is not defined');
    }

    try {
        const accessToken = await getAccessToken();

        const response = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    dateRanges: [{ startDate, endDate }],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'sessions' },
                        { name: 'screenPageViews' },
                        { name: 'totalUsers' },
                        { name: 'engagementRate' },
                    ],
                    dimensions: [{ name: 'date' }],
                    orderBys: [{ dimension: { dimensionName: 'date' } }],
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch from GA API');
        }

        const data = await response.json();

        // Format data for Recharts
        const chartData = data.rows?.map((row: any) => ({
            date: row.dimensionValues?.[0]?.value ?
                `${row.dimensionValues[0].value.substring(4, 6)}/${row.dimensionValues[0].value.substring(6, 8)}` : '',
            users: parseInt(row.metricValues?.[0]?.value || '0'),
            sessions: parseInt(row.metricValues?.[1]?.value || '0'),
            pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
        })) || [];

        // Aggregated totals
        const totals = {
            activeUsers: data.totals?.[0]?.metricValues?.[0]?.value || '0',
            sessions: data.totals?.[0]?.metricValues?.[1]?.value || '0',
            pageViews: data.totals?.[0]?.metricValues?.[2]?.value || '0',
            totalUsers: data.totals?.[0]?.metricValues?.[3]?.value || '0',
            engagementRate: (parseFloat(data.totals?.[0]?.metricValues?.[4]?.value || '0') * 100).toFixed(1) + '%',
        };

        return { chartData, totals };
    } catch (error: any) {
        console.error('Error in getOverviewData:', error);
        throw error;
    }
}