import React, { useState } from "react";
import { api } from '../utils/api';

const TaskList: React.FC = () => {
    const { data: taskList } = api.project.allTasks.useQuery();
    console.log(taskList, 'taskList');

    const [filter, setFilter] = useState<string | null>(null); // Initialize filter state to null

    const taskStatuses = [
        "ACTIVE",
        "INACTIVE",
        "ARCHIVED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "DELETED"
    ];

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFilter = event.target.value;
        setFilter(selectedFilter === "all" ? null : selectedFilter);
    };

    const filteredTasks = filter
        ? taskList?.filter(task => task.status === filter)
        : taskList;

    const getRandomColor = () => {
        // Generating random color in hexadecimal format
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <>
            <div className="my-8">
                <div className="flex justify-between ">
                    <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                    <select
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-600"
                        value={filter ?? "all"}
                        onChange={handleFilterChange}
                    >
                        <option value="all">All</option>
                        {taskStatuses.map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <p className="text-sm text-gray-600 mb-4">List of all tasks assigned.</p>
                <p className="text-sm text-gray-600 mb-4">Total tasks: {filteredTasks?.length}</p>
                <ul className="flex flex-col p-2">
                    {filteredTasks?.map(task => (
                        <li key={task.taskid} className="rounded-lg shadow-md shadow-sm my-2 border flex flex-col space-y-2 p-4">
                            <div className="flex items-center space-x-4">
                                <p style={{ backgroundColor: getRandomColor() }} className="p-2 px-4 rounded-full bg-zinc-500 text-white">{task.name.charAt(0).toUpperCase()}</p>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{task.name}</h3>
                                    <p className="text-sm text-gray-600"><span className="font-semibold">Description:</span> {task.description}</p>
                                    <div className="flex justify-between">
                                        <p className="text-sm">Assigned By: {task.task_assgn_by}</p>
                                        <p className="text-sm">Assigned To: {task.task_assgn_to}</p>
                                        <p className="text-sm">Deadline: {task?.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</p>
                                        <p className="text-sm">Status: {task.status}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default TaskList;
