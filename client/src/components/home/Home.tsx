import { useState, useEffect } from "react";
import { SavedInterview as SavedInterviewType } from "../../types/interview";
import { getInterviews } from "../../services/interviewServiceApi";
import SavedInterview from "./SavedInterview";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";

const TOKEN_KEY = 'token';

const Home = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState<SavedInterviewType[]>([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            const token = localStorage.getItem(TOKEN_KEY) || "";
            const interviews = await getInterviews(token);
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
                        <SavedInterview key={interview.id} interview={interview} setInterviews={setInterviews}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;