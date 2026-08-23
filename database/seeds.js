import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import prisma from "./prisma.js";

const NUM_USERS = 20;
const POSTS_PER_USER_MAX = 5;
const FOLLOWS_PER_USER_MAX = 8;
const LIKES_PER_POST_MAX = 10;
const COMMENTS_PER_POST_MAX = 5;

async function clearDatabase(){
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
}

async function createUsers(){

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [];
    for (let i =0; i<NUM_USERS; i++){
        const user = await prisma.user.create({
            data: {
                username: `${faker.internet.username().toLowerCase()}${i}`,
                name: faker.person.fullName(),
                password: hashedPassword,
                bio: faker.lorem.sentence(),
                avatar: faker.image.avatar(),
            },
        });
        users.push(user);
    }
    return users;
}

async function createPosts(users){
    const posts = [];
    for (const user of users){
        const numPosts = faker.number.int({ min: 1, max: POSTS_PER_USER_MAX });
        for(let i = 0; i< numPosts; i++){
            const post = await prisma.post.create({
                data: {
                    content: faker.lorem.paragraphs({min: 1, max: 3 }),
                    authorId: (user.id),
                    createdAt: faker.date.recent({ days: 30 }),
                },
            });
            posts.push(post);
        }
    }
    return posts;
}

async function createFollows(users){
    for(const user of users){
        const others = users.filter((u) => u.id !== user.id);
        const shuffled = faker.helpers.shuffle(others);
        const numFollows = faker.number.int({ min: 0, max: Math.min(FOLLOWS_PER_USER_MAX, shuffled.length) });
        const toFollow = shuffled.slice(0, numFollows);

        for (const target of toFollow){
            await prisma.follow.create({
                data: { followerId: user.id, followingId: target.id},
            });
        }
    }
}

async function createLikesAndComments(users, posts){
    for(const post of posts){
        const potentialLikers = users.filter((u) => u.id !== post.authorId);
        const shuffledLikers = faker.helpers.shuffle(potentialLikers);
        const numLikes = faker.number.int({ min: 0, max: Math.min(LIKES_PER_POST_MAX,shuffledLikers.length) });
        const likers = shuffledLikers.slice(0, numLikes);

        for (const liker of likers){
            await prisma.like.create({
                data: {userId: liker.id, postId: post.id},
            });
        }

        const numComments = faker.number.int({ min: 0, max: COMMENTS_PER_POST_MAX });
        for (let i = 0;i<numComments;i++){
            const commenter = faker.helpers.arrayElement(users);
            await prisma.comment.create({
                data: {
                    content: faker.lorem.sentence(),
                    authorId: commenter.id,
                    postId: post.id,
                },
            });
        }
    }
}

async function main(){
    console.log("Clearing existing data...");
    await clearDatabase();

    console.log("Creating users...");
    const users = await createUsers();

    console.log("Creating posts...");
    const posts = await createPosts(users);

    console.log("Creating follows...");
    await createFollows(users);

    console.log("Creating likes and comments...");
    await createLikesAndComments(users, posts);

    console.log(`Done - seeded ${users.length} users and ${posts.length} posts.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });