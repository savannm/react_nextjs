"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficSourceProps {
    data: any[];
}

export default function TrafficSource({ data }: TrafficSourceProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Traffic Sources</h3>
            </div>
            <div className="flex-1 min-h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="source" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            width={100}
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
                            dataKey="users" 
                            fill="#0ea5e9" 
                            radius={[0, 4, 4, 0]} 
                            barSize={20} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
