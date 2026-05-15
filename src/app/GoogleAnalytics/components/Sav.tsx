"use client";

interface BounceData {
    path: string;
    totalBounceRate: number;
}

interface BounceDataProps {
    data: BounceData[];
}

export default function BounceRate({ data }: BounceDataProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <div className="p-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Bounce Rate by Page</h3>
            </div>
            <div className="p-4">
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 truncate max-w-[180px]" title={item.path}>
                                {item.path}
                            </span>
                            <span className={`text-sm font-bold ${item.totalBounceRate > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {item.totalBounceRate}%
                            </span>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">No bounce data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

