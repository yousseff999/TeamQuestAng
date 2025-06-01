export interface GiftCard {
  id: number;
  title: string;
  description: string;
  requiredScore: number;
  imageUrl: string;
  brand: string;
  category: string;
  canAfford: boolean;
  alreadyOwned: boolean;
  createdAt: Date;
}

export interface ExchangeRequest {
  giftCardId: number;
  userId: number;
}
