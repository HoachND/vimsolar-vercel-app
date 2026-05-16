export interface BlogPost {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  contentVi: string;
  contentEn: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  tags: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
