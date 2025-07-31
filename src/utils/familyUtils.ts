// 가족 구성원 역할을 한글로 변환
export const getFamilyRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    FATHER: "아빠",
    MOTHER: "엄마",
    SON: "아들",
    DAUGHTER: "딸",
    GRANDFATHER: "할아버지",
    GRANDMOTHER: "할머니",
    UNCLE: "삼촌",
    AUNT: "이모",
    COUSIN: "사촌",
    OTHER: "기타",
  };

  return roleMap[role] || role;
};

// 가족 구성원 역할 색상 매핑
export const getFamilyRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    FATHER: "#3B82F6", // blue-500
    MOTHER: "#EC4899", // pink-500
    SON: "#10B981", // emerald-500
    DAUGHTER: "#F59E0B", // amber-500
    GRANDFATHER: "#8B5CF6", // violet-500
    GRANDMOTHER: "#EF4444", // red-500
    UNCLE: "#06B6D4", // cyan-500
    AUNT: "#84CC16", // lime-500
    COUSIN: "#F97316", // orange-500
    OTHER: "#6B7280", // gray-500
  };

  return colorMap[role] || "#6B7280";
};

// 가족 구성원 프로필 이미지 기본값
export const getDefaultProfileImage = (): string => {
  return "/src/assets/image/style_icon_profile.svg";
};

// 가족 구성원 정렬 순서
export const getFamilyRoleOrder = (role: string): number => {
  const orderMap: Record<string, number> = {
    FATHER: 1,
    MOTHER: 2,
    GRANDFATHER: 3,
    GRANDMOTHER: 4,
    UNCLE: 5,
    AUNT: 6,
    SON: 7,
    DAUGHTER: 8,
    COUSIN: 9,
    OTHER: 10,
  };

  return orderMap[role] || 99;
};

// 가족 구성원들을 역할 순서대로 정렬
export const sortFamilyMembersByRole = <T extends { familyMemberRole: string }>(
  members: T[]
): T[] => {
  return [...members].sort(
    (a, b) =>
      getFamilyRoleOrder(a.familyMemberRole) -
      getFamilyRoleOrder(b.familyMemberRole)
  );
};
