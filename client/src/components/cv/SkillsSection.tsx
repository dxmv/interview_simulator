import React, { useState } from 'react';

interface SkillsSectionProps {
    skills: string[];
    onRemove: (skill: string) => void;
    onAdd: (skill: string) => void;
}

const SkillsSection = ({ skills, onRemove, onAdd }: SkillsSectionProps) => {
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        onAdd(newSkill.trim());
        setNewSkill('');
        setIsAddingSkill(false);
    };

    return (
        <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Technical Skills</h2>
            <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        onClick={() => onRemove(skill)}
                        className="bg-gray-100 px-3 py-1 rounded cursor-pointer hover:bg-red-100 hover:line-through transition-colors duration-200"
                        title="Click to remove"
                    >
                        {skill}
                    </span>
                ))}
            </div>
            
            {isAddingSkill ? (
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Enter new skill"
                        autoFocus
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddSkill();
                            }
                        }}
                    />
                    <button
                        onClick={handleAddSkill}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => {
                            setIsAddingSkill(false);
                            setNewSkill('');
                        }}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingSkill(true)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                    Add Skill
                </button>
            )}
        </section>
    );
};

export default SkillsSection; 