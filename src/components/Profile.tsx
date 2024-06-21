import React from 'react';
import { useSession } from "next-auth/react";
import { api } from '../utils/api';

const Profile: React.FC = () => {
    const { data: sessionData } = useSession();
    const { data: tasklist } = api.project.userTasks.useQuery();
    const { data: projectlist } = api.project.respectiveUserProjects.useQuery();

    return (
        <>
            <div className="container mx-auto px-8 py-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="mb-8 col-span-full">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Profile Details</h2>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex justify-between rounded-lg shadow-lg p-6">
                        <div>
                            <p className="text-lg font-semibold mb-2">Name: {sessionData?.user?.username}</p>
                            <p className="text-lg font-semibold mb-2">Email: {sessionData?.user?.email}</p>
                        </div>
                        <div className="flex items-center justify-center w-16 h-16 bg-white text-blue-500 rounded-full shadow-md">
                            <span className="text-xl font-bold">
                                {sessionData?.user?.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className='flex justify-between'>
                        <h3 className="text-2xl font-bold text-blue-600 mb-4">Projects</h3>
                        <h3 className="text-2xl font-bold text-blue-600 mb-4">Total projects: {projectlist?.length}</h3>
                    </div>
                    {projectlist?.map((project) => (
                        <div key={project.projectid} className="mb-4 p-4 border rounded-lg shadow-md">
                            <h4 className="text-lg font-bold">{project.projectname}</h4>
                            <p className="text-sm text-gray-600 mb-2">Description: {project.description}</p>
                            <p className="text-sm text-gray-600 mb-2">Deadline: {project?.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>
                            <p className="text-sm text-gray-600 mb-2">Status: {project.status}</p>
                            <p className="text-sm text-gray-600 mb-2">Creator: {project.projectcreator}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className='flex justify-between'>
                        <h3 className="text-2xl font-bold text-blue-600 mb-4">Tasks</h3>
                        <h3 className="text-2xl font-bold text-blue-600 mb-4">Total tasks: {tasklist?.length}</h3>
                    </div>
                    {tasklist?.map((task) => (
                        <div key={task.taskid} className="mb-4 p-4 border rounded-lg shadow-md">
                            <h4 className="text-lg font-bold">{task.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">Description: {task.description}</p>
                            <p className="text-sm text-gray-600 mb-2">Assigned By: {task.task_assgn_by}</p>
                            <p className="text-sm text-gray-600 mb-2">Assigned To: {task.task_assgn_to}</p>
                            {task?.deadline ? (
                                <p className="text-sm text-gray-600 mb-2">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                            ) : (
                                <p className="text-sm text-gray-600 mb-2">No deadline set</p>
                            )}
                            <p className="text-sm text-gray-600 mb-2">Status: {task.status}</p>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
}

export default Profile;
