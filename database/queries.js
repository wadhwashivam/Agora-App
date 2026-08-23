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

async function createPost(myId, content){
    return prisma.post.create({
        data: { authorId: myId, content: content},
    });
}

async function getPostById(postId){
    return prisma.post.findUnique({
        where: {id: postId},
        select: {
            id: true,
            content: true,
            createdAt: true,
            postedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatar: true,
                }
            },
            comments: {
                orderBy: { createdAt: "asc"},
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        }
                    }
                }
            },
            _count: {select: {likes: true}}
        }
    });
}

async function createComment(myId, postId, content){
    return prisma.comment.create({
        data: { authorId: myId, postId: postId, content: content}
    });
}

async function findLike(myId, postId){
    return prisma.like.findUnique({
        where: {userId_postId: {userId: myId, postId}}
    });
}

async function createLike(myId, postId){
    return prisma.like.create({
        data: { userId: myId, postId}
    });
}

async function deleteLike(myId, postId){
    return prisma.like.delete({
        where: {userId_postId: {userId: myId, postId}}
    });
}


async function getFeedPosts(myId, { skip = 0, take = 20} = {}){
    const following = await prisma.follow.findMany({
        where: {followerId: myId},
        select: {followingId: true}
    });

    const authorIds = [myId, ...following.map(f => f.followingId)];

    return prisma.post.findMany({
        where: { authorId: {in: authorIds}},
        orderBy: {createdAt: "desc"},
        skip,
        take,
        select: {
            id: true,
            content: true,
            createdAt: true,
            postedBy: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatar: true,
                }
            },
            _count: { select: {likes: true, comments: true}}
        }
    });
}

async function editUserProfile(userId, updates){
    return prisma.user.update({
        where: {id: userId},
        data: updates,
        select: {id: true, username: true, name: true, bio: true, avatar: true},
    });
}

export { getUserByUsername, getUserById, getUserByGithubId, createUserFromGithub, createUser, getAllUsers, getUserProfile, findFollow, createFollow, deleteFollow, createPost, getPostById, createComment, findLike, createLike, deleteLike, getFeedPosts, editUserProfile };