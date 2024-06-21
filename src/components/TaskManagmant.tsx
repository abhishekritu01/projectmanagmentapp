import { useState, ChangeEvent } from 'react';
import { api } from "~/utils/api";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    DELETED = 'DELETED'
}

enum TaskStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    DELETED = 'DELETED'
}

interface Project {
    projectid: string;
    projectname: string;
    description: string | null;
    deadline: Date | null;
    projectcreator: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: ProjectStatus;
    userId: string;
}

interface User {
    id: string;
    username: string;
}

interface TaskDetails {
    name: string;
    description: string;
    task_assgn_by: string;
    task_assgn_to?: string;
    deadline?: string;
    createdById: string;
    projectId: string;
    status: TaskStatus;
}

const TaskManagement = () => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [taskDetails, setTaskDetails] = useState<TaskDetails>({
        name: "",
        description: "",
        task_assgn_by: "",
        task_assgn_to: "",
        deadline: "",
        createdById: "",
        projectId: "",
        status: TaskStatus.ACTIVE,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: projectList } = api.project.allProjects.useQuery(undefined, { refetchOnWindowFocus: false });
    const { data: userList } = api.post.getListOfUsers.useQuery();

    const createTask = api.project.createTask.useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: () => {
            setIsLoading(false);
            setTaskDetails({
                name: "",
                description: "",
                task_assgn_by: "",
                task_assgn_to: "",
                deadline: "",
                createdById: "",
                projectId: "",
                status: TaskStatus.ACTIVE,
            });
            setSelectedProjectId("");
            setProjectData(null);
        },
        onError: () => {
            setIsLoading(false);
        }
    });

    const handleProjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);


        const selectedProject = projectList?.find(project => project.projectid === projectId) ?? null;
        if (selectedProject) {
            setProjectData({
                projectid: selectedProject.projectid,
                projectname: selectedProject.projectname,
                description: selectedProject.description ?? "",
                deadline: selectedProject.deadline ?? null,
                projectcreator: selectedProject.projectcreator ?? "",
                createdAt: new Date(selectedProject.createdAt),
                updatedAt: new Date(selectedProject.updatedAt),
                status: selectedProject.status as ProjectStatus,
                userId: selectedProject.userId,
            });
            setTaskDetails(prevDetails => ({
                ...prevDetails,
                projectId: projectId,
                task_assgn_by: selectedProject.projectcreator ?? "",
                createdById: selectedProject.userId,
            }));
        } else {
            setProjectData(null);
            setTaskDetails(prevDetails => ({
                ...prevDetails,
                projectId: "",
                task_assgn_by: "",
                createdById: "",
            }));
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTaskDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleAddTask = () => {
        const newTaskDetails = {
            ...taskDetails,
            description: taskDetails.description ?? "",
            task_assgn_to: taskDetails.task_assgn_to ?? undefined,
            deadline: taskDetails.deadline ?? undefined,
            status: taskDetails.status || TaskStatus.ACTIVE,
        };

        createTask.mutate(newTaskDetails);
    };

    return (
        <div className="p-4 flex flex-col">
            <h1 className="text-2xl font-semibold mb-4">Task Management</h1>
            <div className="flex items-center w-full">
                <select
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    className="text-xl w-full font-thin p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select Project</option>
                    {projectList?.map(project => (
                        <option key={project.projectid} value={project.projectid ?? ''}>{project.projectname}</option>
                    ))}
                </select>
                <button
                    onClick={handleAddTask}
                    disabled={!selectedProjectId || isLoading}
                    className={`bg-green-500 w-30 text-white px-3 py-2 rounded-md flex items-center justify-center gap-1 ml-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? <span>Loading...</span> : <><PlusCircleIcon className="h-5 w-5" /> Task</>}
                </button>
            </div>

            {projectData && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">{projectData.projectname}</h2>
                    <p className="text-sm text-gray-600">{projectData.description}</p>
                    {projectData.deadline && (
                        <p className="text-sm text-gray-600">Deadline: {new Date(projectData.deadline).toLocaleDateString()}</p>
                    )}

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Task Name</label>
                        <input
                            type="text"
                            name="name"
                            value={taskDetails.name}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
                        <textarea
                            name="description"
                            value={taskDetails.description}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-4">Assign Task to</label>
                        <select
                            name="task_assgn_to"
                            value={taskDetails.task_assgn_to ?? ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                        >
                            <option value="">Select User</option>
                            {userList?.map(user => (
                                <option key={user.id} value={user.username ?? ''}>{user.username}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mt-4">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={taskDetails.deadline ?? ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-4">Task Status</label>
                        <select
                            name="status"
                            value={taskDetails.status}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                        >
                            {Object.values(TaskStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;
