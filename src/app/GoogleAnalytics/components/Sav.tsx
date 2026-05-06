"use client";


interface BounceData {
    totalBounceRate: number
}
interface BounceDataProps {
    data: BounceData[];
}


export default function BounceRate({ data }: BounceDataProps) {
    console.log(data)
    return (
        <div className="bg-white text-[#444] rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full !p-3">
            <h2 className="color-black" >Total Bounce Rate</h2>
            {data.map((item, index) => (
                <p key={index}>{item.totalBounceRate}%</p>
            ))}

        </div>
    );

}

