import { useState, useEffect } from 'react';
import { getInterviews } from '../../services/interviewServiceApi';
import { SavedInterview } from '../../types/interview';
import StatsSection from './StatsSection';

const StatsPage = () => {
    const [interviews, setInterviews] = useState<SavedInterview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const fetchedInterviews = await getInterviews(token);
                setInterviews(fetchedInterviews);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch interviews');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Interview Statistics</h1>
            <StatsSection interviews={interviews} />
        </div>
    );
};

export default StatsPage;