import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import bcrypt from 'bcryptjs'


export const registerRouter = createTRPCRouter({
    // Existing hello route
    registerUser: publicProcedure
        .input(z.object({
            username: z.string().min(1),
            email: z.string().email(),
            password: z.string().min(4),
        }))
        .mutation(async ({ ctx, input }) => {
            const { username, email, password } = input;

            try {
                console.log('Registering user:', input);

                const existingUser = await ctx.db.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (existingUser) {
                    throw new Error('User with this email already exists');
                }

                // Hash the password securely using bcryptjs
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user using Prisma client
                const newUser = await ctx.db.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    },
                });

                return newUser;
            } catch (error) {
                console.error('Error registering user:', error);
                throw new Error('Failed to register user');
            }
        }),

    getprojects: protectedProcedure.meta({
        input: z.object({}),
    }).query(async ({ ctx }) => {
        console.log('Getting projects');
    }),

});





