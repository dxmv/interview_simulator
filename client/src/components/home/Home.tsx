import { useState,useEffect } from "react";
import { SavedInterview } from "../../types/interview";
import { getInterviews } from "../../services/interviewServiceApi";

const Home = () => {

    const [interviews, setInterviews] = useState<SavedInterview[]>([]);


    useEffect(() => {
        const fetchInterviews = async () => {
            const interviews = await getInterviews();
            console.log(interviews);
            setInterviews(interviews);
        }
        fetchInterviews();
    }, []);

    return <div>{interviews.map(interview => interview.summary)}</div>
}

export default Home;