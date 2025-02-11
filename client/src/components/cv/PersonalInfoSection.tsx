import { PersonalInfo } from "../../types/cv_types";
import EditableText from "../reusable/EditableText";

interface PersonalInfoSectionProps {
    personalInfo: PersonalInfo;
    onUpdate: (field: keyof PersonalInfo, value: string) => void;
}

const PersonalInfoSection = ({ personalInfo, onUpdate }: PersonalInfoSectionProps) => {
    return (
        <section className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Personal Information</h1>
            <EditableText
                value={personalInfo.name}
                onSave={(value) => onUpdate('name', value)}
            />
        </section>
    );
};

export default PersonalInfoSection; 