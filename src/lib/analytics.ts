/**READ MEE!
 * This module provides server-side functions to interact with the Google Analytics Data API (GA4).
 * It uses the REST API for better compatibility in serverless environments.
 * END POINTS: POST https://analyticsdata.googleapis.com/v1beta/{property=properties/*}:runReport
*MORE RESOURCE HERE: https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties
 * 
 * 
 */
import 'server-only';
import { google } from "googleapis";

/**
 * Generates an OAuth2 access token using client credentials and a refresh token.
 * This token is required for authenticating REST requests to the Google Analytics Data API.
 */
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

/**
 * Fetches overview metrics (users, sessions, pageviews) grouped by date.
 * Also retrieves totals for the specified date range.
 */
export async function getOverviewData(startDate: string = '30daysAgo', endDate: string = 'today') {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
        throw new Error('GA_PROPERTY_ID is not defined');
    }

    try {
        const accessToken = await getAccessToken();

        // Perform a POST request to the runReport endpoint
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

        // Transform the raw API response into a format suitable for the chart (Recharts)
        const chartData = data.rows?.map((row: any) => ({
            date: row.dimensionValues?.[0]?.value ?
                `${row.dimensionValues[0].value.substring(4, 6)}/${row.dimensionValues[0].value.substring(6, 8)}` : '',
            users: parseInt(row.metricValues?.[0]?.value || '0'),
            sessions: parseInt(row.metricValues?.[1]?.value || '0'),
            pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
        })) || [];

        // Extract and format totals for KPI cards
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

/**
 * Fetches user distribution by device category (mobile, desktop, tablet).
 */
export async function getDeviceData(startDate: string = '30daysAgo', endDate: string = 'today') {
    const propertyId = process.env.GA_PROPERTY_ID;
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
                metrics: [{ name: 'activeUsers' }],
                dimensions: [{ name: 'deviceCategory' }],
            }),
        }
    );

    const data = await response.json();
    return data.rows?.map((row: any) => ({
        name: row.dimensionValues?.[0]?.value,
        value: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];
}

/**
 * Fetches the top 5 pages by screen page views.
 */
export async function getPageData(startDate: string = '30daysAgo', endDate: string = 'today') {
    const propertyId = process.env.GA_PROPERTY_ID;
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
                metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
                dimensions: [{ name: 'pagePath' }],
                limit: 5,
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            }),
        }
    );

    const data = await response.json();
    return data.rows?.map((row: any) => ({
        path: row.dimensionValues?.[0]?.value,
        views: parseInt(row.metricValues?.[0]?.value || '0'),
        users: parseInt(row.metricValues?.[1]?.value || '0'),
    })) || [];
}

/**
 * Fetches the top 5 countries by active users.
 */
export async function getGeoData(startDate: string = '30daysAgo', endDate: string = 'today') {
    const propertyId = process.env.GA_PROPERTY_ID;
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
                metrics: [{ name: 'activeUsers' }],
                dimensions: [{ name: 'country' }],
                limit: 5,
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
            }),
        }
    );

    const data = await response.json();
    return data.rows?.map((row: any) => ({
        country: row.dimensionValues?.[0]?.value,
        users: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];


}


/**
 * Sav test 
 */
export async function getSavBounce(startDate: string = '7daysAgo', endDate: string = 'today') {
    const propertyId = process.env.GA_PROPERTY_ID;
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
                metrics: [{ name: 'bounceRate' }], //https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions
                dimensions: [{ name: 'pagePath' }], //https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics
                limit: 5,
                // orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            }),
        }
    );

    const data = await response.json();
    // console.log("google api results are:", data);
    return data.rows?.map((row: any) => ({
        //takes result value, transforms structure for recharts json format. json structure row > metricValues/DimensionValues
        totalBounceRate: Math.round(row.metricValues[0]?.value * 100 || 0) / 100
    })) || [];
}

