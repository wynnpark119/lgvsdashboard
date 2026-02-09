/**
 * Campaign Helper Functions
 * 캠페인 관련 유틸리티 함수
 */

import { CampaignLayer, Campaign } from '@/types';

/**
 * Campaign Layer 레이블 반환
 */
export function getLayerLabel(layer?: CampaignLayer): string {
  const labels: Record<CampaignLayer, string> = {
    'theme': 'Campaign Theme',
    'teasing': 'Teasing',
    'narrative-film': 'Narrative Film',
    'core-pillar': 'Core Tech Pillar',
    'landing': 'Landing Hub',
    'distribution': 'Distribution',
    'authority': 'Authority Content',
  };
  return layer ? labels[layer] : '';
}

/**
 * 부모 캠페인의 하위 캠페인들 반환 (순서대로 정렬)
 */
export function getChildCampaigns(
  campaigns: Campaign[], 
  parentId: string
): Campaign[] {
  return campaigns
    .filter(c => c.hierarchy?.parentCampaignId === parentId)
    .sort((a, b) => 
      (a.hierarchy?.sequenceOrder || 0) - (b.hierarchy?.sequenceOrder || 0)
    );
}

/**
 * 특정 레이어의 캠페인들 반환
 */
export function getCampaignsByLayer(
  campaigns: Campaign[], 
  layer: CampaignLayer
): Campaign[] {
  return campaigns.filter(c => c.hierarchy?.layer === layer);
}

/**
 * 현재 활성 캠페인 반환 (Home에 표시할 캠페인)
 */
export function getActiveCampaign(campaigns: Campaign[]): Campaign | undefined {
  return campaigns.find(c => c.isActiveCampaign === true);
}

/**
 * 히스토리 캠페인 반환 (활성 캠페인 제외)
 */
export function getHistoryCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.filter(c => !c.isActiveCampaign);
}

/**
 * 상태별 캠페인 필터링
 */
export function getCampaignsByStatus(
  campaigns: Campaign[], 
  status: 'active' | 'completed' | 'planned'
): Campaign[] {
  return campaigns.filter(c => c.status === status);
}
