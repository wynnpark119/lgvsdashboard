/**
 * Context Store
 * 페이지 간 상태 공유를 위한 Zustand Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReviewStage, TimePeriod } from '@/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface SelectedTechnology {
  id: string;
  name: string;
}

interface SelectedCampaign {
  id: string;
  name: string;
}

interface NavigationContext {
  // 어디서 왔는지
  source: 'home' | 'review-flow' | 'campaign-impact' | 'detail' | null;
  // 검증 목적
  purpose: string | null;
}

interface FilterState {
  // 선택된 기술
  technology: SelectedTechnology | null;
  // 선택된 캠페인
  campaign: SelectedCampaign | null;
  // 선택된 기간
  period: TimePeriod;
  // 선택된 단계 필터
  stageFilter: ReviewStage | 'all';
  // 네비게이션 컨텍스트
  context: NavigationContext;
}

interface FilterActions {
  // 기술 선택
  setTechnology: (tech: SelectedTechnology | null) => void;
  // 캠페인 선택
  setCampaign: (campaign: SelectedCampaign | null) => void;
  // 기간 선택
  setPeriod: (period: TimePeriod) => void;
  // 단계 필터
  setStageFilter: (stage: ReviewStage | 'all') => void;
  // 컨텍스트 설정
  setContext: (context: Partial<NavigationContext>) => void;
  // 리셋
  reset: () => void;
  // Review Flow에서 Detail로 이동
  navigateToDetail: (tech: SelectedTechnology, purpose: string) => void;
  // Campaign Impact에서 Detail로 이동
  navigateToDetailFromCampaign: (tech: SelectedTechnology, campaign: SelectedCampaign, purpose: string) => void;
}

type ContextStore = FilterState & FilterActions;

// ─────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────

const initialState: FilterState = {
  technology: null,
  campaign: null,
  period: '90d',
  stageFilter: 'all',
  context: {
    source: null,
    purpose: null,
  },
};

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

export const useContextStore = create<ContextStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTechnology: (tech) => set({ technology: tech }),

      setCampaign: (campaign) => set({ campaign }),

      setPeriod: (period) => set({ period }),

      setStageFilter: (stage) => set({ stageFilter: stage }),

      setContext: (context) =>
        set((state) => ({
          context: { ...state.context, ...context },
        })),

      reset: () => set(initialState),

      navigateToDetail: (tech, purpose) =>
        set({
          technology: tech,
          context: {
            source: 'review-flow',
            purpose,
          },
        }),

      navigateToDetailFromCampaign: (tech, campaign, purpose) =>
        set({
          technology: tech,
          campaign,
          context: {
            source: 'campaign-impact',
            purpose,
          },
        }),
    }),
    {
      name: 'vs-dashboard-context',
      partialize: (state) => ({
        technology: state.technology,
        campaign: state.campaign,
        period: state.period,
        context: state.context,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────

export const selectTechnology = (state: ContextStore) => state.technology;
export const selectCampaign = (state: ContextStore) => state.campaign;
export const selectPeriod = (state: ContextStore) => state.period;
export const selectContext = (state: ContextStore) => state.context;
export const selectStageFilter = (state: ContextStore) => state.stageFilter;

// ─────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────

export function useSelectedTechnology() {
  return useContextStore((state) => state.technology);
}

export function useSelectedCampaign() {
  return useContextStore((state) => state.campaign);
}

export function usePeriod() {
  return useContextStore((state) => state.period);
}

export function useNavigationContext() {
  return useContextStore((state) => state.context);
}
