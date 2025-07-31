import { faker } from "@faker-js/faker";
import { User, Family, FamilyMember, MemoryPost, Comment } from "../types";

// 기본 사용자 데이터
export const mockUsers: User[] = [
  {
    id: 1,
    familyId: 1,
    userNickname: "김아빠",
    userRole: "user",
    userFamilyRole: "FATHER",
    isFamilyRoomManager: true,
    profileImage: "https://picsum.photos/150/150?random=1",
  },
  {
    id: 2,
    familyId: 1,
    userNickname: "김엄마",
    userRole: "user",
    userFamilyRole: "MOTHER",
    isFamilyRoomManager: false,
    profileImage: "https://picsum.photos/150/150?random=2",
  },
  {
    id: 3,
    familyId: 1,
    userNickname: "김첫째",
    userRole: "user",
    userFamilyRole: "SON",
    isFamilyRoomManager: false,
    profileImage: "https://picsum.photos/150/150?random=3",
  },
  {
    id: 4,
    familyId: 1,
    userNickname: "김둘째",
    userRole: "user",
    userFamilyRole: "DAUGHTER",
    isFamilyRoomManager: false,
    profileImage: "https://picsum.photos/150/150?random=4",
  },
];

// 기본 가족 데이터
export const mockFamilies: Family[] = [
  {
    id: "family-1",
    name: "김씨네 가족",
    familyCode: "KIM2024",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// 기본 가족 구성원 데이터
export const mockFamilyMembers: FamilyMember[] = mockUsers.map(
  (user, index) => ({
    id: `member-${index + 1}`,
    user,
    role: user.userFamilyRole || "MEMBER",
    joinedAt: "2024-01-01T00:00:00Z",
  })
);

// Mock 데이터 생성 함수들
export const generateMockUser = (override?: Partial<User>): User => ({
  id: faker.number.int({ min: 1000, max: 9999 }),
  familyId: faker.number.int({ min: 1, max: 10 }),
  userNickname: faker.person.fullName(),
  userRole: "user",
  userFamilyRole: faker.helpers.arrayElement([
    "FATHER",
    "MOTHER", 
    "SON",
    "DAUGHTER",
  ]),
  isFamilyRoomManager: faker.datatype.boolean(),
  profileImage: `https://picsum.photos/150/150?random=${faker.number.int({
    min: 1,
    max: 1000,
  })}`,
  ...override,
});

export const generateMockFamily = (override?: Partial<Family>): Family => ({
  id: faker.string.uuid(),
  name: `${faker.person.lastName()}씨네 가족`,
  familyCode: faker.string.alphanumeric(8).toUpperCase(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...override,
});

export const generateMockFamilyMember = (
  override?: Partial<FamilyMember>
): FamilyMember => ({
  id: faker.string.uuid(),
  user: generateMockUser(),
  role: faker.helpers.arrayElement(["아빠", "엄마", "첫째", "둘째", "막내"]),
  joinedAt: faker.date.past().toISOString(),
  ...override,
});

export const generateMockMemoryPost = (
  override?: Partial<MemoryPost>
): MemoryPost => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(2),
  images: Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    (_, i) =>
      `https://picsum.photos/400/300?random=${faker.number.int({
        min: 1,
        max: 1000,
      })}${i}`
  ),
  author: mockUsers[faker.number.int({ min: 0, max: mockUsers.length - 1 })],
  familyMembers: mockFamilyMembers.slice(
    0,
    faker.number.int({ min: 1, max: 4 })
  ),
  likeCount: faker.number.int({ min: 0, max: 50 }),
  isLiked: faker.datatype.boolean(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...override,
});

export const generateMockComment = (override?: Partial<Comment>): Comment => ({
  id: faker.string.uuid(),
  content: faker.lorem.sentence(),
  author: mockUsers[faker.number.int({ min: 0, max: mockUsers.length - 1 })],
  postId: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...override,
});

// 대량 Mock 데이터 생성
export const generateMockMemoryPosts = (count: number = 10): MemoryPost[] =>
  Array.from({ length: count }, () => generateMockMemoryPost());

export const generateMockComments = (
  postId: string,
  count: number = 5
): Comment[] =>
  Array.from({ length: count }, () => generateMockComment({ postId }));

// 현재 로그인 사용자 (테스트용)
export const currentUser = mockUsers[0];

// 현재 가족 (테스트용)
export const currentFamily = mockFamilies[0];

// 유틸리티 함수
export const findUserById = (id: number): User | undefined =>
  mockUsers.find((user) => user.id === id);

export const findMemoryPostById = (id: string): MemoryPost | undefined => {
  const posts = generateMockMemoryPosts(50); // 충분한 수의 포스트 생성
  return posts.find((post) => post.id === id) || generateMockMemoryPost({ id });
};

export const getRecentMemoryPosts = (limit: number = 10): MemoryPost[] => {
  const posts = generateMockMemoryPosts(50);
  return posts
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
};
