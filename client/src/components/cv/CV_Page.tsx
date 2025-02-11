import { useState, useEffect } from "react";
import { CVAnalysis } from "../../types/cv_types";
import { getCvAnalysis } from "../../services/cvServiceApi";
import EditableText from "../reusable/EditableText";

/**
 * Displays the cv information 
 * User can change the cv information
 * User can update the cv, upload a new one
 */
const CV_Page = () => {
    const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);

    useEffect(() => {
        const fetchCVAnalysis = async () => {
            const analysis = await getCvAnalysis();
            setCvAnalysis(analysis);
        }
        fetchCVAnalysis();
    }, []);
    
    if (!cvAnalysis) {
        return <div>Loading...</div>;
    }

    const handleUpdatePersonalInfo = (field: keyof typeof cvAnalysis.personal_info, value: string) => {
        if (!cvAnalysis) return;
        setCvAnalysis({
            ...cvAnalysis,
            personal_info: {
                ...cvAnalysis.personal_info,
                [field]: value
            }
        });
        // TODO: Add API call to save changes
    };

    const handleUpdateProject = (index: number, field: keyof typeof cvAnalysis.projects[0], value: string) => {
        if (!cvAnalysis) return;
        const newProjects = [...cvAnalysis.projects];
        newProjects[index] = {
            ...newProjects[index],
            [field]: value
        };
        setCvAnalysis({
            ...cvAnalysis,
            projects: newProjects
        });
        // TODO: Add API call to save changes
    };

    const handleUpdateWorkExperience = (index: number, field: keyof typeof cvAnalysis.work_experience[0], value: string) => {
        if (!cvAnalysis) return;
        const newWorkExperience = [...cvAnalysis.work_experience];
        newWorkExperience[index] = {
            ...newWorkExperience[index],
            [field]: value
        };
        setCvAnalysis({
            ...cvAnalysis,
            work_experience: newWorkExperience
        });
        // TODO: Add API call to save changes
    };

    const handleUpdateResponsibility = (workIndex: number, respIndex: number, value: string) => {
        if (!cvAnalysis) return;
        const newWorkExperience = [...cvAnalysis.work_experience];
        const newResponsibilities = [...newWorkExperience[workIndex].key_responsibilities];
        newResponsibilities[respIndex] = value;
        newWorkExperience[workIndex] = {
            ...newWorkExperience[workIndex],
            key_responsibilities: newResponsibilities
        };
        setCvAnalysis({
            ...cvAnalysis,
            work_experience: newWorkExperience
        });
        // TODO: Add API call to save changes
    };

    console.log(cvAnalysis);

    return (
        <div className="p-4">
            {/* Personal Info */}
            <section className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Personal Information</h1>
                <EditableText
                    value={cvAnalysis.personal_info.name}
                    onSave={(value) => handleUpdatePersonalInfo('name', value)}
                />
            </section>

            {/* Technical Skills */}
            <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">Technical Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {cvAnalysis.skills.technical && cvAnalysis.skills.technical.map((skill, index) => (
                        <span key={index} className="bg-gray-100 px-3 py-1 rounded">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {/* Work Experience */}
            <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">Work Experience</h2>
                {cvAnalysis.work_experience.map((work, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold">
                            <EditableText
                                value={work.role}
                                onSave={(value) => handleUpdateWorkExperience(index, 'role', value)}
                            />
                            {" at "}
                            <EditableText
                                value={work.company}
                                onSave={(value) => handleUpdateWorkExperience(index, 'company', value)}
                            />
                        </h3>
                        <p className="text-gray-600">
                            <EditableText
                                value={work.duration}
                                onSave={(value) => handleUpdateWorkExperience(index, 'duration', value)}
                            />
                        </p>
                        <ul className="list-disc ml-6 mt-2">
                            {work.key_responsibilities.map((resp, respIndex) => (
                                <li key={respIndex}>
                                    <EditableText
                                        value={resp}
                                        onSave={(value) => handleUpdateResponsibility(index, respIndex, value)}
                                        multiline
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">Education</h2>
                {cvAnalysis.education && cvAnalysis.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p>{edu.institution} {edu.year && `(${edu.year})`}</p>
                    </div>
                ))}
            </section>

            {/* Projects */}
            <section className="mb-6">
                <h2 className="text-xl font-bold mb-3">Projects</h2>
                {cvAnalysis.projects && cvAnalysis.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold">
                            <EditableText
                                value={project.name}
                                onSave={(value) => handleUpdateProject(index, 'name', value)}
                            />
                        </h3>
                        <EditableText
                            value={project.description}
                            onSave={(value) => handleUpdateProject(index, 'description', value)}
                            multiline
                            className="mb-2"
                        />
                    </div>
                ))}
            </section>

            {/* Metadata */}
            <section className="text-sm text-gray-500 mb-6">
                <p>Last updated: {new Date(cvAnalysis.updated_at).toLocaleDateString()}</p>
            </section>

            {/* Update cv button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Update CV</button>
        </div>
    );
}

export default CV_Page;