export interface Agent {
  id: string;
  title: string;
  domain: string;
  subdomain: string;
  description: string;
  rating: number;
  comments: number;
  trial: boolean;
  reviewsList?: Review[];
}

export interface Review {
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface BusinessCapability {
  name: string;
  subCapabilities: string[];
}

export interface BusinessCapabilities {
  [key: string]: BusinessCapability;
}

export type FilterOptions = {
  l1Capability: string;
  l2Capability: string;
  trial: string;
  rating: string;
  sortBy: string;
};
