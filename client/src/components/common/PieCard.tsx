import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
interface PieCardProps {
    title: string,
    data: { name: string, value: number }[]
}
const PieCard: React.FC<PieCardProps> = ({ title, data }) => {
    // Data for pie charts


    const COLORS = ["#007bff", "#8bc4f2", "#3bc4b5"];


    return (
        < div className="flex p-3 items-center justify-between bg-white rounded-2xl shadow w-full" >

            <div className="w-full flex flex-col text-black">
                <h3 className="font-normal text-md mb-4">{title}</h3>
                <div className="w-24">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={25}
                                outerRadius={45}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry: { name: string }, index) => (
                                    <Cell id={entry.name} key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {data.map((entry: { name: string, value: number }, index: number) => (
                    <Legend title={entry.name} color={COLORS[index % COLORS.length]} />

                ))}
            </div>
        </ div >
    );
};

interface legendProps {
    title: string,
    color: string
}

const Legend: React.FC<legendProps> = ({ title, color }) => {
    return (

        <div className="flex items-center bg-background p-2">
            <div
                className="w-3 h-3 "
                style={{ backgroundColor: color }}
            ></div>
            <span className="ml-2 text-sm">{title}</span>
        </div>
    )
}

export default PieCard;
