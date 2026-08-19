import prisma from "./prisma.js";

async function getUserByUsername(username){
    return prisma.user.findUnique({
        where: { username }
    });
}

async function getUserById(id){
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true, name: true, bio: true, avatar: true }
    });
}

async function getUserByGithubId(githubId){
    return prisma.user.findUnique({
        where: { githubId },
    });
}

async function createUser(username, name, hashedPassword){
    return prisma.user.create({
        data: {
            username: username,
            name: name,
            password: hashedPassword,
        }
    });
}

async function createUserFromGithub({ githubId, username, name, avatar }){
    return prisma.user.create({
        data: {
            username: username,
            name: name,
            githubId: githubId,
            avatar: avatar,
        }
    });
}

export { getUserByUsername, getUserById, getUserByGithubId, createUserFromGithub, createUser };