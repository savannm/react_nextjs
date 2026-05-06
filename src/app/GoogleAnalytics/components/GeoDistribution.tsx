"use client";

/**
 * GeoDistribution Component
 * Displays a list of top countries with progress bars indicating the relative number of active users.
 */

import React from 'react';

interface GeoData {
    country: string;
    users: number;
}

interface GeoDistributionProps {
    data: GeoData[];
}

export default function GeoDistribution({ data }: GeoDistributionProps) {
    const maxUsers = Math.max(...data.map(d => d.users), 1);
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Geographic Distribution</h3>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="p-6 space-y-6 flex-1">
                {data.map((item, index) => (
                    <div key={item.country} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">{item.country}</span>
                            <span className="text-sm font-bold text-slate-900">{item.users.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(item.users / maxUsers) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <p className="text-sm italic">No geographic data available</p>
                    </div>
                )}
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
                <p className="text-xs text-center text-slate-500">
                    Top 5 countries by active users
                </p>
            </div>
        </div>
    );
}
