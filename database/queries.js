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

async function getAllUsers(myId){
    const [users, following] = await Promise.all([
        prisma.user.findMany({
            where: {id: { not: myId}},
            select: {id: true, username: true, name: true, bio: true, avatar: true}
        }),
        prisma.follow.findMany({
            where: { followerId: myId},
            select: { followingId: true}
        })
    ]);

    const followingIds = new Set(following.map(f => f.followingId));

    return users.map(user => ({
        ...user,
        isFollowing: followingIds.has(user.id),
    }));
}

async function getUserProfile(otherUserId){
    return prisma.user.findUnique({
        where: {id: otherUserId},
        select: {
            id: true,
            username: true,
            name: true,
            bio: true,
            avatar: true,
            posts: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    _count: {select: { likes: true, comments: true}}
                }
            }
        }
    });
}

async function findFollow(followerId, followingId){
    return prisma.follow.findUnique({
        where: { followerId_followingId: {followerId, followingId }}
    });
}

async function createFollow(followerId, followingId){
    return prisma.follow.create({
        data: { followerId, followingId}
    });
}

async function deleteFollow(followerId, followingId) {
    return prisma.follow.delete({
        where: {followerId_followingId: { followerId, followingId }}
    });
}


export { getUserByUsername, getUserById, getUserByGithubId, createUserFromGithub, createUser, getAllUsers, getUserProfile, findFollow, createFollow, deleteFollow };