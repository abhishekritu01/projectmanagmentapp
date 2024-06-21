import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { api } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

interface ProjectData {
    project_name: string;
    project_description: string;
    project_deadline: string;
    project_status: ProjectStatus;
    user_email: string;
    porject_creater: string;
}

enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    DELETED = 'DELETED',
}

interface ModelProps {
    children?: React.ReactNode;
    createproject: boolean;
    setCreateProject: (value: boolean) => void;
}

const Model: React.FC<ModelProps> = ({ createproject, setCreateProject }) => {
    const [open, setOpen] = useState(true);
    const { data: sessionData, status } = useSession();
    // const userEmail = sessionData?.user?.email || '';
    // const projectCreator = sessionData?.user.username || '';

    const userEmail = sessionData?.user?.email ?? '';
    const projectCreator = sessionData?.user?.username ?? '';

    const [projectData, setProjectData] = useState<ProjectData>({
        porject_creater: projectCreator,
        project_name: '',
        project_description: '',
        project_deadline: '',
        project_status: ProjectStatus.ACTIVE,
        user_email: userEmail,
    });

    useEffect(() => {
        setProjectData(prevState => ({
            ...prevState,
            user_email: userEmail,
            porject_creater: projectCreator
        }));
    }, [userEmail, projectCreator]);

    // api
    const createUser = api.project.createProject.useMutation({
        onSuccess: () => {
            toast.success('Project created successfully!', {
                autoClose: 2000
            });
            setCreateProject(false);
        },
        onError: () => {
            toast.error('Failed to create project.');
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProjectData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!sessionData) {
            await signIn();
            return;
        }
        createUser.mutate({
            projectname: projectData.project_name,
            description: projectData.project_description,
            deadline: projectData.project_deadline,
            status: projectData.project_status,
            email: projectData.user_email,
            projectcreator: projectData.porject_creater
        });

    };

    if (status === 'loading') {
        return <div>Loading...</div>; // Or a loading spinner
    }

    if (!sessionData) {
        return <div>Please sign in to create a project.</div>;
    }

    return (
        <>
            <ToastContainer />
            <Transition show={open}>
                <Dialog className="relative z-10" onClose={() => {
                    console.log('close');
                }}>
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </TransitionChild>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border">
                                    <div>
                                        <XMarkIcon
                                            className="h-6 w-6 text-gray-500 absolute top-4 right-4 cursor-pointer"
                                            onClick={() => {
                                                setOpen(false);
                                                setCreateProject(false);
                                            }}
                                        />
                                    </div>
                                    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                                        <h1 className="text-3xl font-bold mb-6">Create Project</h1>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="mb-4">
                                                <label htmlFor="project_name" className="block text-sm font-semibold mb-2">Project Name:</label>
                                                <input type="text" id="project_name" name="project_name" value={projectData.project_name} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none" required />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="project_description" className="block text-sm font-semibold mb-2">Project Description:</label>
                                                <textarea id="project_description" name="project_description" value={projectData.project_description} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none" rows={4} required></textarea>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="project_deadline" className="block text-sm font-semibold mb-2">Project Deadline:</label>
                                                <input type="datetime-local" id="project_deadline" name="project_deadline" value={projectData.project_deadline} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none" required />
                                            </div>
                                            <div className="mb-6">
                                                <label htmlFor="project_status" className="block text-sm font-semibold mb-2">Project Status:</label>
                                                <select id="project_status" name="project_status" value={projectData.project_status} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:outline-none" required>
                                                    {Object.values(ProjectStatus).map((status) => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Create Project</button>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Model;



