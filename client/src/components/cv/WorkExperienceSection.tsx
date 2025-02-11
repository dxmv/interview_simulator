import { WorkExperience } from "../../types/cv_types";
import EditableText from "../reusable/EditableText";

interface WorkExperienceSectionProps {
    workExperience: WorkExperience[];
    onUpdateWork: (index: number, field: keyof WorkExperience, value: string) => void;
    onUpdateResponsibility: (workIndex: number, respIndex: number, value: string) => void;
}

const WorkExperienceSection = ({ workExperience, onUpdateWork, onUpdateResponsibility }: WorkExperienceSectionProps) => {
    return (
        <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Work Experience</h2>
            {workExperience.map((work, index) => (
                <div key={index} className="mb-4">
                    <h3 className="font-semibold">
                        <EditableText
                            value={work.role}
                            onSave={(value) => onUpdateWork(index, 'role', value)}
                        />
                        {" at "}
                        <EditableText
                            value={work.company}
                            onSave={(value) => onUpdateWork(index, 'company', value)}
                        />
                    </h3>
                    <p className="text-gray-600">
                        <EditableText
                            value={work.duration}
                            onSave={(value) => onUpdateWork(index, 'duration', value)}
                        />
                    </p>
                    <ul className="list-disc ml-6 mt-2">
                        {work.key_responsibilities.map((resp, respIndex) => (
                            <li key={respIndex}>
                                <EditableText
                                    value={resp}
                                    onSave={(value) => onUpdateResponsibility(index, respIndex, value)}
                                    multiline
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
};

export default WorkExperienceSection; 