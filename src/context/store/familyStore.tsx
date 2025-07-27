import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { FamilyData, FamilyMember } from "@/data/types/family";

interface FamilyState {
  // 상태
  familyData: FamilyData | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setFamilyData: (data: FamilyData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (
    memberId: number,
    updates: Partial<FamilyMember>
  ) => void;
  removeFamilyMember: (memberId: number) => void;
  reset: () => void;
}

const initialState = {
  familyData: null,
  isLoading: false,
  error: null,
};

export const useFamilyStore = create<FamilyState>()(
  devtools(
    subscribeWithSelector((set) => ({
      ...initialState,

      setFamilyData: (data) =>
        set({ familyData: data, error: null }, false, "setFamilyData"),

      setLoading: (loading) => set({ isLoading: loading }, false, "setLoading"),

      setError: (error) => set({ error, isLoading: false }, false, "setError"),

      addFamilyMember: (member) =>
        set(
          (state) => ({
            familyData: state.familyData
              ? {
                  ...state.familyData,
                  familyMembers: [...state.familyData.familyMembers, member],
                }
              : null,
          }),
          false,
          "addFamilyMember"
        ),

      updateFamilyMember: (memberId, updates) =>
        set(
          (state) => ({
            familyData: state.familyData
              ? {
                  ...state.familyData,
                  familyMembers: state.familyData.familyMembers.map((member) =>
                    member.familyMemberId === memberId
                      ? { ...member, ...updates }
                      : member
                  ),
                }
              : null,
          }),
          false,
          "updateFamilyMember"
        ),

      removeFamilyMember: (memberId) =>
        set(
          (state) => ({
            familyData: state.familyData
              ? {
                  ...state.familyData,
                  familyMembers: state.familyData.familyMembers.filter(
                    (member) => member.familyMemberId !== memberId
                  ),
                }
              : null,
          }),
          false,
          "removeFamilyMember"
        ),

      reset: () => set(initialState, false, "reset"),
    }))
  )
);
