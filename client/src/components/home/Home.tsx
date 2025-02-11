import { useState,useEffect } from "react";
import { SavedInterview as SavedInterviewType } from "../../types/interview";
import { getInterviews } from "../../services/interviewServiceApi";
import SavedInterview from "./SavedInterview";
import { getToken } from "../../auth/local_storage";
const Home = () => {

    const [interviews, setInterviews] = useState<SavedInterviewType[]>([]);


    useEffect(() => {
        const fetchInterviews = async () => {
            const interviews = await getInterviews(getToken() || "");
            console.log(interviews);
            setInterviews(interviews);
        }
        fetchInterviews();
    }, []);

    return <div>{interviews.map(interview => <SavedInterview key={interview.id} interview={interview} />)}</div>
}

export default Home;