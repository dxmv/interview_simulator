import { SavedInterview as SavedInterviewType } from "../../types/interview";
import { Trash2, Star, ChevronRight } from 'lucide-react';
import { format } from "date-fns";
import { useState } from "react";
import InterviewModal from "../interview/InterviewModal";

const SavedInterview = ({ interview }: { interview: SavedInterviewType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const deleteInterview = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/interview/${interview.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete interview');
            // Trigger refresh of parent component
            window.location.reload();
        } catch (error) {
            console.error('Error deleting interview:', error);
        }
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 8) return 'text-green-600';
        if (grade >= 6) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-2xl font-semibold ${getGradeColor(interview.grade)}`}>
                                {interview.grade}/10
                            </span>
                            {interview.grade >= 8 && <Star className="text-yellow-400 fill-yellow-400" size={20} />}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                            {format(new Date(interview.date), 'MMM d, yyyy - h:mm a')}
                        </p>
                        
                        <p className="text-gray-800">
                            {interview.summary}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={deleteInterview}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                            aria-label="Delete interview"
                        >
                            <Trash2 size={20} />
                        </button>
                        
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                            aria-label="View details"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <InterviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                messages={interview.messages}
            />
        </>
    );
};

export default SavedInterview;