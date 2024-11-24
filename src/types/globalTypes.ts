export interface ShoppingCart {
    id: string;
    bookTitle: string;
    bookAuthor: string;
    price: number;
    productId: string;
    publishedAt: string;
    product: any;
    updatedAt: string;
    coupons: Coupon[]
    cover: any;
    discount: number;
    createdAt: string;
    amount: number;
    name: string;
    author: string;
}

export interface Coupon {
    id: number
    value: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
