import React, { useState } from "react";
import { api } from "~/utils/api";
import { ProjectStatus as PrismaProjectStatus } from "@prisma/client"; // Adjust this import based on your setup

// Use the imported ProjectStatus enum directly instead of defining a new one
type ProjectStatus = PrismaProjectStatus;

const ProjectListComponent: React.FC = () => {
    const { data, error, isLoading } = api.project.allUserProjects.useQuery(
        undefined,
        { refetchOnWindowFocus: false }
    );

    const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All"); // State for status filter

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const projects = data ?? []; // Ensure data is correctly typed as Project[]

    const filteredProjects = statusFilter === "All"
        ? projects
        : projects.filter((project) => project.status === statusFilter);

    return (
        <div className="project-list my-4">
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Filter by status:</span>
                    <select
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-600"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "All")}
                    >
                        <option value="All">All</option>
                        {Object.values(PrismaProjectStatus).map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">List of all projects</p>
            <p className="text-sm text-gray-600 mb-4">Total projects: {filteredProjects.length}</p>
            <ul className="flex flex-col">
                {filteredProjects.map((project) => (
                    <li key={project.projectid} className="bg-white rounded-lg shadow-md p-4 shadow-sm my-2 border flex flex-col space-y-2">
                        <div className="flex items-center space-x-4">
                            <p className="p-2 px-4 rounded-full text-white" style={{ backgroundColor: getStatusColor(project?.status) }}>
                                {project.projectname.charAt(0)}
                            </p>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{project.projectname}</h3>
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-600"><span className="font-semibold">Description:</span> {project.description ?? 'No description'}</p>
                                    <p className="text-sm">Created by: {project.projectcreator ?? 'Unknown'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm">Status: {project.status}</p>
                                    <p className="text-sm">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const getStatusColor = (status: ProjectStatus): string => {
    switch (status) {
        case PrismaProjectStatus.ACTIVE:
            return "#10B981"; // Green
        case PrismaProjectStatus.COMPLETED:
            return "#4B5563"; // Gray
        case PrismaProjectStatus.CANCELLED:
            return "#EF4444"; // Red
        case PrismaProjectStatus.IN_PROGRESS:
            return "#FCD34D"; // Yellow
        case PrismaProjectStatus.INACTIVE:
            return "#D1D5DB"; // Light gray
        case PrismaProjectStatus.ARCHIVED:
            return "#6B7280"; // Dark gray
        default:
            return "#9CA3AF"; // Default color
    }
};

export default ProjectListComponent;
