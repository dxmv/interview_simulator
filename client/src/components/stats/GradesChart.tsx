import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SavedInterview } from '../../types/interview';

interface GradesChartProps {
    interviews: SavedInterview[];
}

const GradesChart = ({ interviews }: GradesChartProps) => {
    if (interviews.length === 0) return null;

    // Prepare data for the chart
    const chartData = interviews
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(interview => ({
            date: new Date(interview.date).toLocaleDateString(),
            grade: interview.grade
        }));

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Grade History</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            domain={[0, 10]} 
                            ticks={[0, 2, 4, 6, 8, 10]}
                        />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="grade" 
                            stroke="#4F46E5" 
                            strokeWidth={2}
                            dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GradesChart; 