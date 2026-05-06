"use client";

/**
 * AnalyticsDashboard Component
 * This is the main client-side shell for the analytics dashboard.
 * it receives pre-fetched data from the server and renders various
 * visualization components using Recharts.
 */
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import KPICard from './KPICard';
import TopPages from './TopPages';
import DeviceBreakdown from './DeviceBreakdown';
import GeoDistribution from './GeoDistribution';
import BounceRate from './Sav';

interface AnalyticsDashboardProps {
    data: {
        chartData: any[];
        totals: {
            activeUsers: string;
            sessions: string;
            pageViews: string;
            totalUsers: string;
            engagementRate: string;
        };
    };
    deviceData: any[];
    pageData: any[];
    geoData: any[];
    BounceData: any[];
}

export default function AnalyticsDashboard({ data, deviceData, pageData, geoData, BounceData }: AnalyticsDashboardProps) {
    const { chartData, totals } = data;

    return (
        <div className="min-h-screen bg-[#f8fafc] !p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
                    <p className="text-slate-500 mt-1">Real-time performance metrics for your property.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">7D</button>
                    <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-md shadow-sm">30D</button>
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">90D</button>
                </div>
            </div>

            {/* 
                KPI Cards Section 
                Displays high-level metrics at a glance.
                Currently commented out as requested in previous iterations,
                but ready to be toggled on.
            */}
            {/* KPI Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard
                    title="Active Users"
                    value={totals.activeUsers}
                    change="+12.5%"
                    trend="up"
                />
                <KPICard
                    title="Sessions"
                    value={totals.sessions}
                    change="+8.2%"
                    trend="up"
                />
                <KPICard
                    title="Page Views"
                    value={totals.pageViews}
                    change="-2.4%"
                    trend="down"
                />
                <KPICard
                    title="Total Users"
                    value={totals.totalUsers}
                    change="+5.7%"
                    trend="up"
                />
                <KPICard
                    title="Engagement Rate"
                    value={totals.engagementRate}
                    change="+1.2%"
                    trend="up"
                />
            </div> */}

            {/* Main Charts Section: Traffic Trends and Page Views */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Trend: Area Chart showing Users vs Sessions over time */}
                <div className="lg:col-span-2 bg-white rounded-2xl !p-3 border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">Traffic Trend</h3>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-slate-600">Users</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                <span className="text-slate-600">Sessions</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full p-6 pt-10">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sessions"
                                    stroke="#e2e8f0"
                                    strokeWidth={2}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Page Views by Day: Bar Chart for daily volume comparison */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm !p-3 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800">Page Views by Day</h3>
                    </div>
                    <div className="h-[400px] w-full p-6 pt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="pageViews"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 
                Detailed Data Components:
                - TopPages: List of most visited URLs
                - DeviceBreakdown: Pie chart of user devices
                - GeoDistribution: Geographic distribution of users
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full !pt-8 gap-8">
                <BounceRate data={BounceData} />
                <TopPages data={pageData} />
                <DeviceBreakdown data={deviceData} />
                <GeoDistribution data={geoData} />
            </div>

            {/* Glassmorphic Background Accents */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        </div>
    );
}
