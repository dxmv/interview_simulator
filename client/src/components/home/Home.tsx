import { useState, useEffect } from "react";
import { SavedInterview as SavedInterviewType } from "../../types/interview";
import { getInterviews } from "../../services/interviewServiceApi";
import SavedInterview from "./SavedInterview";
import { getToken } from "../../auth/local_storage";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
const Home = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState<SavedInterviewType[]>([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            const interviews = await getInterviews(getToken() || "");
            console.log(interviews);
            setInterviews(interviews);
        }
        fetchInterviews();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Your previous interviews</h1>
                <Separator className="w-full"/>
                <div className="grid gap-4">
                    {interviews.map(interview => (
                        <SavedInterview key={interview.id} interview={interview} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;