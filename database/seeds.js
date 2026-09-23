import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import prisma from "./prisma.js";

const NUM_USERS = 20;
const POSTS_PER_USER_MAX = 5;
const FOLLOWS_PER_USER_MAX = 8;
const LIKES_PER_POST_MAX = 10;
const COMMENTS_PER_POST_MAX = 5;

// Real English content banks, written for a text-only opinion/discourse
// platform — replaces faker.lorem.* (which only generates fake Latin
// placeholder text, never coherent English).

const BIO_SAMPLES = [
    "Writer. Skeptic. Occasionally wrong, always willing to say so.",
    "Debating in good faith since before it was cool.",
    "I think out loud so you don't have to.",
    "Former optimist, current realist, permanent overthinker.",
    "Here for the arguments, not the applause.",
    "Reader first, writer second, right maybe a third of the time.",
    "Slow thinker in a fast-take world.",
    "I change my mind more than I'd like to admit.",
    "Trying to write the thing I'd actually want to read.",
    "Contrarian by habit, convinced by evidence.",
    "Long posts, longer walks, occasional regret.",
    "Ask me why — I probably have an answer.",
    "Opinions subject to revision without notice.",
    "I'd rather be interesting than agreeable.",
    "Building a case, one paragraph at a time.",
    "Unlearning things I was very sure about in my twenties.",
    "I write to figure out what I actually think.",
    "Here to disagree productively, not just disagree.",
    "Curious about everything, certain about very little.",
    "Making the case, expecting the rebuttal.",
];

const POST_SAMPLES = [
    "Remote work didn't kill office friendships — it just made us pickier about who we bother talking to. I've had more honest conversations with three coworkers over the past year than I did with thirty when we all shared a floor. Proximity was always a weak substitute for actual interest in someone's ideas.",

    "Everyone treats hustle culture like it's a personality flaw now, but I think we overcorrected. There's a difference between grinding yourself into the ground and just genuinely caring about getting good at something. We used to call that ambition. Now we call it a red flag.",

    "The most useful thing AI has done for me isn't writing anything — it's forcing me to get specific about what I actually want, because vague prompts get vague results. That's a skill I didn't know I was missing until a machine kept handing my own laziness back to me.",

    "Minimalism as an aesthetic and minimalism as a practice are two completely different things, and Instagram only ever shows you the first one. The people who actually own less stuff aren't posting photos of their empty shelves. They're too busy not thinking about their stuff at all.",

    "I used to feel guilty about rereading books instead of constantly finding new ones. Then I noticed the books I reread are the only ones I can actually talk about in any depth years later. Breadth of reading is overrated compared to how many times you've sat with the same ideas.",

    "Social media didn't make people more opinionated — it made opinions cheaper to produce and cheaper to abandon. Nobody actually believes half of what they post; they believe it for the fifteen seconds it takes to hit send, and that's the whole transaction now.",

    "School taught me how to answer questions someone else already knew the answer to. It took years afterward to learn how to sit with a question nobody has actually answered yet. Those are completely different muscles, and only one of them gets graded.",

    "Creativity gets romanticized as some rare gift, but most of what I've made that I'm actually proud of came from doing a boring, unglamorous version of the same task a hundred times until something interesting fell out of the repetition. Inspiration is mostly a byproduct of reps.",

    "Discipline is just motivation you've automated. Nobody wants to go to the gym at 6am — the people who go anyway have simply removed the decision from the morning entirely. The willpower happened days earlier, when they built the habit, not in the moment everyone assumes it happens.",

    "I turned down a higher-paying job for one with better people, and I will not apologize for it. Everyone talks about compensation like it's the only variable that matters, but nobody warns you how much of your actual life gets eaten by a team you dread being around.",

    "Cities keep optimizing for efficiency and keep getting lonelier in the process. The most alive a neighborhood ever feels is when it's slightly inconvenient — when you have to actually run into people instead of gliding past them in a car built to remove friction from your day.",

    "Cooking from a recipe and cooking from experience are not the same skill, and conflating them is why so many people think they can't cook. Following instructions correctly is a real skill. It just isn't the one that lets you improvise when you're out of an ingredient.",

    "The best trips I've taken were the ones with no itinerary at all, and the worst were the ones I spent optimizing in advance. There's a point where planning stops reducing anxiety and starts replacing the actual experience with a checklist you're just executing.",

    "Every generation thinks the one after it is soft, and every generation is wrong for the exact same reason: they're comparing a kid's current hardship to their own hardship in hindsight, after the edges got sanded off by nostalgia. Nobody remembers their own childhood as hard while they're living it either.",

    "Buying less stuff didn't make me happier because I stopped wanting things. It made me happier because I stopped outsourcing my identity to things I hadn't bought yet. The relief wasn't in the empty cart. It was in not needing the cart to feel like someone.",

    "Sleep culture has become another arena for competitive suffering, and I'm tired of it in the literal sense. Bragging about four hours of sleep used to be a warning sign. Now it's a personality trait people cultivate on purpose, which should worry us more than it does.",

    "Nobody tells you that the hardest part of getting good at something is staying bad at it in public for long enough to improve. Talent gets all the credit for outcomes that were mostly just tolerance for looking incompetent in front of people who could see you struggling.",

    "I don't think free will is an illusion, but I do think most people vastly overestimate how many of their daily decisions are actually decisions and not just the path of least resistance dressed up as a choice they made on purpose.",

    "The internet promised to make expertise more accessible and instead made confidence more contagious. Those are not the same thing, and the gap between them is where most bad advice lives — stated with a certainty that has nothing to do with how much the person actually knows.",

    "Working in silence used to feel like a virtue to me. Now I think it was mostly fear of being told my half-formed idea was bad before I'd had the chance to convince myself it was good. Sharing earlier, worse work turned out to be the actual shortcut.",
];

const COMMENT_SAMPLES = [
    "This is the take I didn't know I needed today.",
    "Strongly disagree, but I respect how you got here.",
    "I've thought this for years and never put it into words this cleanly.",
    "Counterpoint: this only holds if you ignore the exceptions, which are most people I know.",
    "Okay but what about the people for whom this genuinely doesn't apply?",
    "This aged well. Wish more people said this out loud before it was obvious.",
    "I want to disagree but I can't actually find the hole in this.",
    "Same conclusion, very different reasoning for me, but I'll take it.",
    "This is a much more generous read than I would have given it.",
    "Respectfully, I think you're underestimating how rare this actually is.",
    "You've just described my last five years in one paragraph.",
    "I came in ready to argue and now I'm just nodding.",
    "This is true but only half the story, I think.",
    "Finally someone said the quiet part out loud.",
    "I don't think this holds up outside of a fairly specific context.",
    "This is going to live in my head for the rest of the week.",
    "Hard agree, and I don't say that often on here.",
    "I think you're right for the wrong reasons, if that makes sense.",
    "This is the most honest version of this argument I've read.",
    "Pushing back a little — isn't this just survivorship bias with extra steps?",
];

async function clearDatabase() {
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
}

async function createUsers() {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
        const user = await prisma.user.create({
            data: {
                username: `${faker.internet.username().toLowerCase()}${i}`,
                name: faker.person.fullName(),
                password: hashedPassword,
                bio: faker.helpers.arrayElement(BIO_SAMPLES),
                avatar: faker.image.avatar(),
            },
        });
        users.push(user);
    }
    return users;
}

async function createPosts(users) {
    const posts = [];
    for (const user of users) {
        const numPosts = faker.number.int({ min: 1, max: POSTS_PER_USER_MAX });
        for (let i = 0; i < numPosts; i++) {
            const post = await prisma.post.create({
                data: {
                    content: faker.helpers.arrayElement(POST_SAMPLES),
                    authorId: user.id,
                    createdAt: faker.date.recent({ days: 30 }),
                },
            });
            posts.push(post);
        }
    }
    return posts;
}

async function createFollows(users) {
    for (const user of users) {
        const others = users.filter((u) => u.id !== user.id);
        const shuffled = faker.helpers.shuffle(others);
        const numFollows = faker.number.int({ min: 0, max: Math.min(FOLLOWS_PER_USER_MAX, shuffled.length) });
        const toFollow = shuffled.slice(0, numFollows);

        for (const target of toFollow) {
            await prisma.follow.create({
                data: { followerId: user.id, followingId: target.id },
            });
        }
    }
}

async function createLikesAndComments(users, posts) {
    for (const post of posts) {
        const potentialLikers = users.filter((u) => u.id !== post.authorId);
        const shuffledLikers = faker.helpers.shuffle(potentialLikers);
        const numLikes = faker.number.int({ min: 0, max: Math.min(LIKES_PER_POST_MAX, shuffledLikers.length) });
        const likers = shuffledLikers.slice(0, numLikes);

        for (const liker of likers) {
            await prisma.like.create({
                data: { userId: liker.id, postId: post.id },
            });
        }

        const numComments = faker.number.int({ min: 0, max: COMMENTS_PER_POST_MAX });
        for (let i = 0; i < numComments; i++) {
            const commenter = faker.helpers.arrayElement(users);
            await prisma.comment.create({
                data: {
                    content: faker.helpers.arrayElement(COMMENT_SAMPLES),
                    authorId: commenter.id,
                    postId: post.id,
                },
            });
        }
    }
}

async function main() {
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

    console.log(`Done — seeded ${users.length} users and ${posts.length} posts.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });