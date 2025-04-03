import { BarChart, Bar, XAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, YAxis } from "recharts";

interface BarCardProps {
  title: string,
  data: { name: string, value: number }[]
}

const BarCard: React.FC<BarCardProps> = ({ title, data }) => {
  const defaultColors = ["#007bff", "#6610f2", "#e83e8c", "#ffc107", "#28a745"];
  return (
    <div className="bg-white rounded-md shadow p-3">
      <div className="font-normal text-md mb-4">{title}</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}  >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis domain={[0, 100]} />
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${entry}`} fill={defaultColors[index % defaultColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarCard;
