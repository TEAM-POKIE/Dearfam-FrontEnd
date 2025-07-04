import { faker } from "@faker-js/faker";
// 기본 사용자 데이터
export const mockUsers = [
    {
        id: "user-1",
        nickname: "김아빠",
        email: "dad@dearfam.com",
        profilePicture: "https://picsum.photos/150/150?random=1",
        role: "아빠",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "user-2",
        nickname: "김엄마",
        email: "mom@dearfam.com",
        profilePicture: "https://picsum.photos/150/150?random=2",
        role: "엄마",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "user-3",
        nickname: "김첫째",
        email: "first@dearfam.com",
        profilePicture: "https://picsum.photos/150/150?random=3",
        role: "첫째",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "user-4",
        nickname: "김둘째",
        email: "second@dearfam.com",
        profilePicture: "https://picsum.photos/150/150?random=4",
        role: "둘째",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
];
// 기본 가족 데이터
export const mockFamilies = [
    {
        id: "family-1",
        name: "김씨네 가족",
        familyCode: "KIM2024",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
];
// 기본 가족 구성원 데이터
export const mockFamilyMembers = mockUsers.map((user, index) => ({
    id: `member-${index + 1}`,
    user,
    role: user.role || "가족",
    joinedAt: "2024-01-01T00:00:00Z",
}));
// Mock 데이터 생성 함수들
export const generateMockUser = (override) => ({
    id: faker.string.uuid(),
    nickname: faker.person.fullName(),
    email: faker.internet.email(),
    profilePicture: `https://picsum.photos/150/150?random=${faker.number.int({
        min: 1,
        max: 1000,
    })}`,
    role: faker.helpers.arrayElement([
        "아빠",
        "엄마",
        "첫째",
        "둘째",
        "막내",
        "할아버지",
        "할머니",
    ]),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...override,
});
export const generateMockFamily = (override) => ({
    id: faker.string.uuid(),
    name: `${faker.person.lastName()}씨네 가족`,
    familyCode: faker.string.alphanumeric(8).toUpperCase(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...override,
});
export const generateMockFamilyMember = (override) => ({
    id: faker.string.uuid(),
    user: generateMockUser(),
    role: faker.helpers.arrayElement(["아빠", "엄마", "첫째", "둘째", "막내"]),
    joinedAt: faker.date.past().toISOString(),
    ...override,
});
export const generateMockMemoryPost = (override) => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(2),
    images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, i) => `https://picsum.photos/400/300?random=${faker.number.int({
        min: 1,
        max: 1000,
    })}${i}`),
    author: mockUsers[faker.number.int({ min: 0, max: mockUsers.length - 1 })],
    familyMembers: mockFamilyMembers.slice(0, faker.number.int({ min: 1, max: 4 })),
    likeCount: faker.number.int({ min: 0, max: 50 }),
    isLiked: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...override,
});
export const generateMockComment = (override) => ({
    id: faker.string.uuid(),
    content: faker.lorem.sentence(),
    author: mockUsers[faker.number.int({ min: 0, max: mockUsers.length - 1 })],
    postId: faker.string.uuid(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...override,
});
// 대량 Mock 데이터 생성
export const generateMockMemoryPosts = (count = 10) => Array.from({ length: count }, () => generateMockMemoryPost());
export const generateMockComments = (postId, count = 5) => Array.from({ length: count }, () => generateMockComment({ postId }));
// 현재 로그인 사용자 (테스트용)
export const currentUser = mockUsers[0];
// 현재 가족 (테스트용)
export const currentFamily = mockFamilies[0];
// 유틸리티 함수
export const findUserById = (id) => mockUsers.find((user) => user.id === id);
export const findMemoryPostById = (id) => {
    const posts = generateMockMemoryPosts(50); // 충분한 수의 포스트 생성
    return posts.find((post) => post.id === id) || generateMockMemoryPost({ id });
};
export const getRecentMemoryPosts = (limit = 10) => {
    const posts = generateMockMemoryPosts(50);
    return posts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
};
