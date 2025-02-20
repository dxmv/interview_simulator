import { SavedInterview } from "../../types/interview";
import GradesChart from "./GradesChart";

interface StatsSectionProps {
    interviews: SavedInterview[];
}

const StatsSection = ({ interviews }: StatsSectionProps) => {
    if (interviews.length === 0) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg">
                <p>No interviews completed yet.</p>
            </div>
        );
    }

    const grades = interviews.map(interview => interview.grade);
    const averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length;
    const minGrade = Math.min(...grades);
    const maxGrade = Math.max(...grades);
    
    // Sort interviews by date for trend analysis
    const sortedInterviews = [...interviews].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate if improving (comparing last 2 interviews if available)
    const isImproving = sortedInterviews.length >= 2 && 
        sortedInterviews[sortedInterviews.length - 1].grade > 
        sortedInterviews[sortedInterviews.length - 2].grade;

    // Get the most recent interview
    const lastInterview = sortedInterviews[sortedInterviews.length - 1];
    const lastInterviewDate = new Date(lastInterview.date).toLocaleDateString();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Average grade */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Average Grade</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {averageGrade.toFixed(1)}
                    </p>
                </div>

                {/* Best grade */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Best Grade</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {maxGrade.toFixed(1)}
                    </p>
                </div>

                {/* Worst grade */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Worst Grade</h3>
                    <p className="text-3xl font-bold text-red-600">
                        {minGrade.toFixed(1)}
                    </p>
                </div>
            </div>

            {/* Add the grades chart */}
            <GradesChart interviews={[{
                date: "2024-01-01",
                messages: [],
                summary: "",
                id: 1,
                grade: 5
            }, {
                date: "2024-01-02",
                messages: [],
                summary: "",
                id: 2,
                grade: 6
            }]} />
        </div>
    );
};

export default StatsSection; 