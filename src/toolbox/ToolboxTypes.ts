export interface ContentItem {
  label: string;
  name: string;
  icon: string;
}

export interface ContentItemGroup {
  title: string;
  items: ContentItem[];
}
