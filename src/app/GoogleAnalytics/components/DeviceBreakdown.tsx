"use client";

/**
 * DeviceBreakdown Component
 * Displays a pie chart representing the distribution of active users across different device categories.
 */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DeviceData {
    name: string;
    value: number;
}

interface DeviceBreakdownProps {
    data: DeviceData[];
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

export default function DeviceBreakdown({ data }: DeviceBreakdownProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Device Breakdown</h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="flex-1 h-[400px] w-full p-6">
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                    {data.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-sm font-medium text-slate-600 capitalize">{item.name}</span>
                            <span className="text-sm font-bold text-slate-900 ml-auto">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
