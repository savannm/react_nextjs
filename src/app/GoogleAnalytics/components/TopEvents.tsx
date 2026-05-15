"use client";

import React from 'react';

interface TopEventsProps {
    data: any[];
}

export default function TopEvents({ data }: TopEventsProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Top Events</h3>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400">
                                    {index + 1}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{item.event}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{item.count.toLocaleString()}</span>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">No event data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
