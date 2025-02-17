import { useState, useEffect } from "react";
import { CVAnalysis } from "../../types/cv_types";
import { getCvAnalysis, updateCvAnalysis } from "../../services/cvServiceApi";
import PersonalInfoSection from "./PersonalInfoSection";
import SkillsSection from "./SkillsSection";
import WorkExperienceSection from "./WorkExperienceSection";
import ProjectsSection from "./ProjectsSection";
import { useCV } from "../../context/cv/CVContext";
import { CVupload } from "../cv-upload/CVupload";

/**
 * Displays the cv information 
 * User can change the cv information
 * User can update the cv, upload a new one
 */
const CV_Page = () => {
    const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
    const { hasUploadedCV, setHasUploadedCV } = useCV();

    useEffect(() => {
        const fetchCVAnalysis = async () => {
            try {
                if (!hasUploadedCV) {
                    return;
                }
                const analysis = await getCvAnalysis();
                setCvAnalysis(analysis);
                setHasUploadedCV(!!analysis);
            } catch (error) {
                console.error('Error fetching CV:', error);
                setHasUploadedCV(false);
            }
        }
        fetchCVAnalysis();
    }, [hasUploadedCV, setHasUploadedCV]);
    
    if (!hasUploadedCV || !cvAnalysis) {
        return (
            <CVupload 
                onUpload={(newAnalysis) => {
                    setHasUploadedCV(true);
                    setCvAnalysis(newAnalysis);
                }} 
                
            />
        );
    }

    /**
     * Updates the personal info of the cv
     * @param field the field to update
     * @param value the value to update the field to
     */
    const handleUpdatePersonalInfo = (field: keyof typeof cvAnalysis.personal_info, value: string) => {
        if (!cvAnalysis) return;
        setCvAnalysis({
            ...cvAnalysis,
            personal_info: {
                ...cvAnalysis.personal_info,
                [field]: value
            }
        });
    };

    /**
     * Updates the project of the cv
     * @param index the index of the project to update
     * @param field the field to update
     * @param value the value to update the field to
     */
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
    };

    /**
     * Updates the work experience of the cv
     * @param index the index of the work experience to update
     * @param field the field to update
     * @param value the value to update the field to
     */
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
    };

    /**
     * Updates the responsibility of the work experience
     * @param workIndex the index of the work experience to update
     * @param respIndex the index of the responsibility to update
     * @param value the value to update the responsibility to
     */
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
    };

    /**
     * Removes a skill from the cv
     * @param skillToRemove the skill to remove
     */
    const handleRemoveSkill = (skillToRemove: string) => {
        if (!cvAnalysis) return;
        const newSkills = cvAnalysis.skills.technical.filter(
            skill => skill !== skillToRemove
        );
        setCvAnalysis({
            ...cvAnalysis,
            skills: {
                ...cvAnalysis.skills,
                technical: newSkills
            }
        });
    };

    /**
     * Adds a skill to the cv
     */
    const handleAddSkill = (newSkill: string) => {
        if (!cvAnalysis || !newSkill.trim()) return;
        const newSkills = [...cvAnalysis.skills.technical, newSkill.trim()];
        setCvAnalysis({
            ...cvAnalysis,
            skills: {
                ...cvAnalysis.skills,
                technical: newSkills
            }
        });
    };

    /**
     * Submits the update cv
     */
    const handleSubmitUpdateCV = async () => {
        try {
            const updatedCV = await updateCvAnalysis(cvAnalysis);
            setCvAnalysis(updatedCV);
        } catch (error) {
            console.error('Error updating CV:', error);
        }
    }

    return (
        <div className="p-4">
            <PersonalInfoSection 
                personalInfo={cvAnalysis.personal_info}
                onUpdate={handleUpdatePersonalInfo}
            />

            <SkillsSection 
                skills={cvAnalysis.skills.technical}
                onRemove={handleRemoveSkill}
                onAdd={handleAddSkill}
            />

            <WorkExperienceSection 
                workExperience={cvAnalysis.work_experience}
                onUpdateWork={handleUpdateWorkExperience}
                onUpdateResponsibility={handleUpdateResponsibility}
            />

            <ProjectsSection 
                projects={cvAnalysis.projects}
                onUpdate={handleUpdateProject}
            />

            {/* Metadata */}
            <section className="text-sm text-gray-500">
                <p>Last updated: {new Date(cvAnalysis.updated_at).toLocaleDateString()}</p>
            </section>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded" 
                    onClick={handleSubmitUpdateCV}
                >
                    Update CV
                </button>
                <CVupload 
                    onUpload={(newAnalysis) => {
                        setHasUploadedCV(true);
                        setCvAnalysis(newAnalysis);
                    }}
                    isInline
                />
            </div>
        </div>
    );
}

export default CV_Page;