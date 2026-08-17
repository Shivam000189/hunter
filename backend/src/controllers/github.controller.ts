import express from 'express';

import { scrapeGithub } from '../services/github';

import { githubBody } from '../types/git';
import prisma from "../config/prisma";
import { Prisma } from '@prisma/client';


export const githubRouter = async (req , res) => {
    try {
        const {success, data} = githubBody.safeParse(req.body);
        if(!success) {
            return res.status(400).json({error: 'Invalid github username'});
        }

        const githubUrl = data.githubUsername.endsWith("/") ? data.githubUsername.slice(0, -1) : data.githubUsername;

        const githubUsername = githubUrl.split("/").pop()!;

        const githubData = await scrapeGithub(githubUsername);

        const interview = await prisma.interview.create({
            data: {
                githubMetadata: JSON.stringify(githubData),
                status: "PENDING"
            }
        });
        res.json({
            success: true,
            id: interview.id
        });
    }catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({error: error.message});
         } 
    }

}