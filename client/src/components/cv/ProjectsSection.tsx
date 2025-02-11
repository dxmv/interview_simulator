import { Project } from "../../types/cv_types";
import EditableText from "../reusable/EditableText";

interface ProjectsSectionProps {
    projects: Project[];
    onUpdate: (index: number, field: keyof Project, value: string) => void;
}

const ProjectsSection = ({ projects, onUpdate }: ProjectsSectionProps) => {
    return (
        <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Projects</h2>
            {projects.map((project, index) => (
                <div key={index} className="mb-4">
                    <h3 className="font-semibold">
                        <EditableText
                            value={project.name}
                            onSave={(value) => onUpdate(index, 'name', value)}
                        />
                    </h3>
                    <EditableText
                        value={project.description}
                        onSave={(value) => onUpdate(index, 'description', value)}
                        multiline
                        className="mb-2"
                    />
                </div>
            ))}
        </section>
    );
};

export default ProjectsSection; 