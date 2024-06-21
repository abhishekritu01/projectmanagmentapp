import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { ProjectStatus, TaskStatus } from "@prisma/client"; // Import ProjectStatus enum from Prisma client
import { create } from "domain";

export const projectsRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(z.object({
            projectname: z.string(),
            description: z.string().optional(),
            deadline: z.string().optional(),
            status: z.nativeEnum(ProjectStatus).optional(), // Correct status type
            email: z.string(),
            projectcreator: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { projectname, description, deadline, status, email, projectcreator } = input;
            console.log("Creating project", projectname, description, deadline, status, email);

            // Find the user by email
            const user = await db.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new Error("User not found");
            }

            // Database insertion logic here
            try {
                await db.project.create({
                    data: {
                        projectname,
                        description,
                        deadline: deadline ? new Date(deadline) : undefined,
                        status,
                        projectcreator,
                        userId: user.id, // Assign the project to the user
                    },
                });
                return { success: true, message: "Project created successfully" };
            } catch (error) {
                console.error(error);
                throw new Error("Failed to create project");
            }
        }),


    //get all projects
    allProjects: protectedProcedure.query(async ({ ctx }) => {
        const projects = await db.project.findMany({
            where: {
                projectcreator: ctx.session.user.username,
            },
        });
        return projects;
    }),

    //get all projects exist in the database
    allUserProjects: protectedProcedure.query(async ({ ctx }) => {
        const projects = await db.project.findMany();
        return projects;
    }),

    respectiveUserProjects: protectedProcedure.query(async ({ ctx }) => {
        const projects = await db.project.findMany({
            where: {
                projectcreator: ctx.session.user.username,
            },
        });
        return projects;
    }),


    //get all user
    allUsers: protectedProcedure.query(async ({ ctx }) => {
        const users = await db.user.findMany();
        return users;
    }),


    deleteProject: protectedProcedure
        .input(z.object({
            projectId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { projectId } = input;
            console.log("Deleting project with ID:", projectId);
            try {
                await db.project.delete({
                    where: {
                        projectid: projectId,
                    },
                });
                return { success: true, message: "Project deleted successfully" };
            } catch (error) {
                console.error(error);
                throw new Error("Failed to delete project");
            }
        }),


    updateProject: protectedProcedure.input(z.object({
        projectid: z.string(),
        projectname: z.string(),
        description: z.string().optional(),
        deadline: z.string().optional(), // Expected as a string
        status: z.nativeEnum(ProjectStatus).optional(),
    })).mutation(async ({ ctx, input }) => {
        const { projectid, projectname, description, deadline, status } = input;
        console.log("Updating project with ID:", projectid, projectname, description, deadline, status);
        try {
            await db.project.update({
                where: {
                    projectid,
                },
                data: {
                    projectname,
                    description,
                    deadline: deadline ? new Date(deadline) : undefined, // Converts string to Date object if provided
                    status,
                },
            });
            return { success: true, message: "Project updated successfully" };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to update project");
        }
    }),

    createTask: protectedProcedure.input(z.object({
        name: z.string(),
        description: z.string(),
        task_assgn_by: z.string(),
        task_assgn_to: z.string().optional(),
        deadline: z.string().optional(),
        createdById: z.string(),
        projectId: z.string(),
        status: z.nativeEnum(TaskStatus).optional(),
    })).mutation(async ({ ctx, input }) => {
        const { name, description, task_assgn_by, task_assgn_to, deadline, createdById, projectId, status } = input;
        console.log("Creating task", name, description, task_assgn_by, task_assgn_to, deadline, createdById, projectId, status);
        try {
            await db.task.create({
                data: {
                    name,
                    description,
                    task_assgn_by,
                    task_assgn_to,
                    deadline: deadline ? new Date(deadline) : undefined,
                    createdById,
                    projectId,
                    status,
                },
            });
            return { success: true, message: "Task created successfully" };
        } catch (error) {
            console.error(error);
            throw new Error("Failed to create task");
        }
    }),

    //get all tasks in the database
    allTasks: protectedProcedure.query(async ({ ctx }) => {
        const tasks = await db.task.findMany();
        return tasks;
    }),


    //get all tasks of a user 
    userTasks: protectedProcedure.query(async ({ ctx }) => {
        const tasks = await db.task.findMany({
            where: {
                task_assgn_to: ctx.session.user.username,
            },
        });
        return tasks;
    }),
});
