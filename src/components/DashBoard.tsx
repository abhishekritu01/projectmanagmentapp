import React, { useState } from "react";
import { api } from "~/utils/api";


const Dashboard = () => {
    const [projectStatus, setProjectStatus] = useState("All");
    const [taskStatus, setTaskStatus] = useState("All");
    const allUser = api.project.allUsers.useQuery();
    const { data: taskList } = api.project.allTasks.useQuery();
    const { data, error, isLoading } = api.project.allUserProjects.useQuery(
        undefined,
        { refetchOnWindowFocus: false }
    );

    const filteredTasks = taskStatus === "All" ? taskList : taskList?.filter(task => task.status === taskStatus);
    const filteredProjects = projectStatus === "All" ? data : data?.filter(project => project.status === projectStatus);


    //dashboard data
    const totalProjects = data?.length;
    const totalTasks = taskList?.length;
    const totalCompletedProjects = data?.filter(project => project.status === "COMPLETED")?.length;
    const totalCompletedTasks = taskList?.filter(task => task.status === "COMPLETED")?.length;
    const totalUsers = allUser?.data?.length;

    function getRandomColorClass() {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
            'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
        ];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }


    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto">
                <h1 className="text-xl font-bold p-2 bg-zinc-200 rounded mb-8">Dashboard</h1>

                <div className="grid grid-cols-3 gap-4 mb-8 shadow p-4 rounded">
                    <div className={`p-4 rounded-lg shadow-md text-center ${getRandomColorClass()} text-white`}>
                        <h2 className="text-lg font-semibold">Total Projects</h2>
                        <p className="text-3xl font-bold">{totalProjects}</p>
                    </div>
                    <div className={`p-4 rounded-lg shadow-md text-center ${getRandomColorClass()} text-white`}>
                        <h2 className="text-lg font-semibold">Total Tasks</h2>
                        <p className="text-3xl font-bold">{totalTasks}</p>
                    </div>
                    <div className={`p-4 rounded-lg shadow-md text-center ${getRandomColorClass()} text-white`}>
                        <h2 className="text-lg font-semibold">Total Users</h2>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                    </div>
                    <div className={`p-4 rounded-lg shadow-md text-center ${getRandomColorClass()} text-white`}>
                        <h2 className="text-lg font-semibold">Completed Projects</h2>
                        <p className="text-3xl font-bold">{totalCompletedProjects}</p>
                    </div>
                    <div className={`p-4 rounded-lg shadow-md text-center ${getRandomColorClass()} text-white`}>
                        <h2 className="text-lg font-semibold">Pending Projects</h2>
                        {/* <p className="text-3xl font-bold">{totalPendingProjects}</p> */}
                    </div>
                    <div className={`p-4 rounded-lg shadow-md text-center ${getRandomColorClass()} text-white`}>
                        <h2 className="text-lg font-semibold">Completed Tasks</h2>
                        <p className="text-3xl font-bold">{totalCompletedTasks}</p>
                    </div>
                </div>


                <div className="mb-8 shadow p-4 rounded ">
                    <div className="flex justify-between items-center mb-4 shadow-xl  p-4 bg-indigo-500">
                        <h2 className="text-xl font-semibold mb-4 text-white mt-1">Projects</h2>
                        <p className="text-white">Total Projects: {filteredProjects?.length}</p>
                        <div className="flex">
                            <label className="mr-2 text-white">Project Status:</label>
                            <select className="rounded p-1" value={projectStatus} onChange={e => setProjectStatus(e.target.value)}>
                                <option value="All">All</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="ARCHIVED">Archived</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="DELETED">Deleted</option>
                            </select>
                        </div>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects && filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => (
                                <li key={index} className="bg-white rounded-lg shadow-md p-4">
                                    <h3 className="text-lg font-semibold mb-2">{project.projectname}</h3>
                                    <p>Status: {project.status}</p>
                                </li>
                            ))
                        ) : (
                            <li className="bg-white rounded-lg shadow-md p-4">
                                <p className="text-gray-500">No projects to show.</p>
                            </li>
                        )}
                    </ul>

                </div>

                <div className="mb-8 shadow p-4 rounded ">
                    <div className="flex justify-between items-center mb-4 shadow-xl  p-4 bg-indigo-500">
                        <h2 className="text-xl font-semibold mb-4 text-white">Tasks </h2>
                        <p className="text-white">Total Tasks: {filteredTasks?.length}</p>
                        <div>
                            <label className="mr-2">Task Status:</label>
                            <select className="rounded p-1" value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
                                <option value="All">All</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="OVERDUE">Overdue</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="APPROVED">Approved</option>
                                <option value="IN_REVIEW">In Review</option>
                            </select>
                        </div>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks && filteredTasks.length > 0 ? (
                            filteredTasks.map((task, index) => (
                                <li key={index} className="bg-white rounded-lg shadow-md p-4">
                                    <h3 className="text-lg font-semibold mb-2">{task?.name}</h3>
                                    <p>Status: {task?.status}</p>
                                </li>
                            ))
                        ) : (
                            <li className="bg-white rounded-lg shadow-md p-4">
                                <p className="text-gray-500">No tasks to show.</p>
                            </li>
                        )}
                    </ul>

                </div>

                <div className="shadow p-4 rounded ">
                    <h2 className="text-xl font-semibold mb-4">Users</h2>
                    <p className="text-sm text-gray-600 mb-4">Total User {allUser?.data?.length} </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allUser?.data?.map((user, index) => (
                            <li key={index} className="bg-white rounded-lg shadow-md p-4">
                                <p>{user?.username}</p>
                                <p>{user?.email}</p>

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
