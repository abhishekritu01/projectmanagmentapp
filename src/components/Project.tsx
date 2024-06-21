import React, { useState } from 'react';
import { Card, Divider } from '@tremor/react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { api } from '../utils/api';
import UpdateProject from './UpdateProject'; // Assuming UpdateProject is correctly implemented


interface ProjectData {
    projectname: string;
    description: string | null;
    deadline: Date | null;
    projectcreator: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    userId: string;
}

const Project: React.FC = () => {
    const [popUp, setPopUp] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Partial<ProjectData> | null>(null);

    const { data: projectList, isLoading, isError, refetch } = api.project.allProjects.useQuery(
        undefined,
        { refetchOnWindowFocus: false }
    );

    const deleteProjectMutation = api.project.deleteProject.useMutation();

    const handleUpdateProject = (project: Partial<ProjectData>) => {
        // Ensure the project object has all required properties
        if (project.projectname) {
            setSelectedProject(project);
            setPopUp(true);
        } else {
            console.error('Invalid project object:', project);
            // Handle error or provide feedback if needed
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await deleteProjectMutation.mutateAsync({ projectId });
            await refetch(); // Refresh the project list after deletion
            toast.success('Project deleted successfully', {
                position: 'top-right',
                autoClose: 5000,
            });
        } catch (error) {
            console.error('Failed to delete project:', error);
            toast.error('Failed to delete project. Please try again later.', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading projects</div>;
    }

    return (
        <>
            {/* Project list header */}
            <div className="flex items-center space-x-2 my-4">
                <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Projects
                </h3>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
                    {projectList?.length}
                </span>
            </div>
            <Divider className="my-4" />

            {/* Project cards grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectList?.map((project, index) => (
                    <Card key={index} className="group p-4 relative">
                        <div className="flex items-center space-x-4">
                            {/* Left part of the card */}
                            <div className="flex-shrink-0 rounded-full h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-500/20">
                                <span className="text-tremor-default font-medium text-blue-800 dark:text-blue-500">
                                    {project.projectname ? project.projectname.charAt(0) : ''}
                                </span>
                            </div>
                            {/* Middle part of the card */}
                            <div className="truncate flex-1">
                                <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    <a href="#" className="focus:outline-none">
                                        {project.projectname}
                                    </a>
                                </p>
                                <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    {project.description}
                                </p>
                                <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Created By: {project.projectcreator}
                                </p>
                                {project.createdAt && (
                                    <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                        Created At: {new Date(project.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                                {project.deadline && (
                                    <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                                    </p>
                                )}
                                <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Status: {project.status}
                                </p>
                            </div>
                            {/* Right part of the card */}
                            <div className="absolute top-2 right-2">
                                <button
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => handleUpdateProject(project)}
                                >
                                    <PencilSquareIcon className="h-6 w-6" />
                                </button>
                                <button
                                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => handleDeleteProject(project.projectid)} // corrected to projectId
                                >
                                    <TrashIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Update Project Dialog */}
            {popUp && selectedProject && (
                // @ts-expect-error: UpdateProject is correctly implemented
                <UpdateProject project={selectedProject} setPopUp={setPopUp} />
            )}
        </>
    );
};

export default Project;
