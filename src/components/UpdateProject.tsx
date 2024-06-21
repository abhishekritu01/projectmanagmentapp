import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { api } from '../utils/api';

// Define the ProjectStatus enum
enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    DELETED = 'DELETED',
}

// Define the Project interface
interface Project {
    projectid: string;
    projectname: string;
    description: string;
    deadline: string | null | undefined; // Adjusted to allow null or undefined
    projectcreator: string;
    createdAt: string; // Assuming these are ISO strings
    updatedAt: string;
    status: ProjectStatus; // Should match your enum
    userId: string;
}

interface UpdateProjectProps {
    project: Project;
    setPopUp: (isOpen: boolean) => void;
}

const UpdateProject: React.FC<UpdateProjectProps> = ({ project, setPopUp }) => {
    const [projectData, setProjectData] = useState<Project>({
        ...project,
        createdAt: project.createdAt.toString(), // Ensure createdAt and updatedAt are strings
        updatedAt: project.updatedAt.toString(),
    });

    const updateProjectMutation = api.project.updateProject.useMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Ensure deadline is always a string or null
        const updatedValue = name === 'deadline' && valueAsDate(value) ? new Date(value).toISOString() : value;

        setProjectData({ ...projectData, [name]: updatedValue });
    };

    const handleSubmit = async () => {
        try {
            const { projectid, projectname, description, deadline, status } = projectData;
            console.log('Updating project with data:', projectData);

            await updateProjectMutation.mutateAsync({
                projectid,
                projectname,
                description,
                deadline: deadline ? new Date(deadline).toISOString() : '', // Ensure deadline is a string
                status,
            });

            console.log('Updated project data:', projectData);

            setPopUp(false); // Close the dialog upon successful update
        } catch (error) {
            console.error('Failed to update project:', error);
            // Handle error state or show error message
        }
    };

    // Helper function to check if value is a valid date
    const valueAsDate = (value: string): boolean => {
        const date = new Date(value);
        return !isNaN(date.getTime());
    };

    return (
        <Transition appear show={true}>
            <Dialog onClose={() => setPopUp(false)} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen p-4">
                    <Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                                    Update Project
                                </Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                                            Project Name
                                        </label>
                                        <input
                                            type="text"
                                            id="projectName"
                                            name="projectname"
                                            value={projectData.projectname}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                                            Project Description
                                        </label>
                                        <textarea
                                            id="projectDescription"
                                            name="description"
                                            value={projectData.description}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="projectDeadline" className="block text-sm font-medium text-gray-700">
                                            Project Deadline
                                        </label>
                                        <input
                                            type="date" // Assuming deadline should be edited as a date input
                                            id="projectDeadline"
                                            name="deadline"
                                            // value={projectData.deadline || ''}
                                            value={projectData.deadline ?? ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700">
                                            Project Status
                                        </label>
                                        <select
                                            id="projectStatus"
                                            name="status"
                                            value={projectData.status}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            {Object.values(ProjectStatus).map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPopUp(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UpdateProject;








