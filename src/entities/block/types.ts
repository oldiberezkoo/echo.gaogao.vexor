/**
 * Learning block entity
 */
export interface BlockLabel {
  id: string;
  text: string;
  /** HeroIcon name */
  icon: string;
  /** Hex color */
  color: string;
}

/**
 * Block rating for profile statistics
 */
export interface BlockRating {
  name: string;
  points: number;
  maxPoints: number;
  rank: number;
}

/**
 * Knowledge block for charts
 */
export interface KnowledgeBlock {
  label: string;
  value: number;
  color: string;
}
