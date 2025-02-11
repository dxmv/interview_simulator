export interface CVAnalysis {
    personal_info: PersonalInfo,
    skills: {
        technical: any[],
    },
    education: Education[],
    work_experience: WorkExperience[],
    projects: Project[],
    created_at: string;
    updated_at: string;
}

export interface PersonalInfo {
    name: string;
}

export interface Education {
    degree: string;
    institution: string;
    year: number | null;
}

export interface WorkExperience {
    company: string;
    role: string;
    duration: string;
    key_responsibilities: string[];
}

export interface Project {
    name: string;
    description: string;
}