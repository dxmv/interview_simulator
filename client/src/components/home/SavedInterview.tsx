import { SavedInterview as SavedInterviewType } from "../../types/interview";

const SavedInterview = ({interview}: {interview: SavedInterviewType}) => {

    const deleteInterview = async () => {
        await deleteInterview(interview.id);
    }

    return <div>{interview.summary} - {interview.grade} <button onClick={deleteInterview}>Delete</button></div>
}

export default SavedInterview;