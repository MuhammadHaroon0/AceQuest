// import { Legend } from '@headlessui/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
interface LineCardProps {
    title: string,
    data: { name: string, uv: number }[]
}


const LineCard: React.FC<LineCardProps> = ({ title, data }) => {

    return (
        <div className="bg-white text-black rounded-lg shadow p-3 w-full">
            <h3 className="font-normal text-md mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={100}>
                <LineChart data={data} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" width={40} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

}

export default LineCard