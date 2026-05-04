// components/KPICard.tsx
import React from 'react';

type Props = { title: string; value: string; change: string; trend: "up" | "down" };

export default function KPICard({ title, value, change, trend }: Props) {
    return (
        <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                </div>
                <div className={`p-2 rounded-lg ${trend === "up" ? "bg-emerald-50" : "bg-rose-50"}`}>
                    {trend === "up" ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                        </svg>
                    )}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
                <span className={`text-sm font-semibold ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                    {change}
                </span>
                <span className="text-sm text-slate-400 font-medium">vs last period</span>
            </div>

            {/* Accent line */}
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:w-full w-8 ${trend === "up" ? "bg-emerald-500" : "bg-rose-500"}`}></div>
        </div>
    );
}