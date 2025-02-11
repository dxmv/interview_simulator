import { useState,useEffect } from "react";
import { SavedInterview as SavedInterviewType } from "../../types/interview";
import { getInterviews } from "../../services/interviewServiceApi";
import SavedInterview from "./SavedInterview";
import { getToken } from "../../auth/local_storage";
import { useNavigate } from "react-router-dom";
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

    return <div>{interviews.map(interview => <SavedInterview key={interview.id} interview={interview} />)}<button onClick={() => navigate('/interview')}>Start Interview</button></div>
}

export default Home;