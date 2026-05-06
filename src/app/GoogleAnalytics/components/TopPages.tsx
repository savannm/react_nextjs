"use client";

/**
 * TopPages Component
 * Renders a table of the most visited page paths, showing views and unique users.
 */
import React from 'react';

interface PageData {
    path: string;
    views: number;
    users: number;
}

interface TopPagesProps {
    data: PageData[];
}

export default function TopPages({ data }: TopPagesProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Top Pages</h3>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last 30 Days</span>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Path</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Views</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Users</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Map through the page data and render table rows */}
                        {data.map((page, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-700 truncate max-w-[200px]" title={page.path}>
                                        {page.path}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-semibold text-slate-900">{page.views.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm text-slate-500">{page.users.toLocaleString()}</span>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                                    No page data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto text-center">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View All Pages →
                </button>
            </div>
        </div>
    );
}
