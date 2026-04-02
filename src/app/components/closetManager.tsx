"use client";

import ClosetCategoryCard, { Category } from "./closetCategoryCard";

const categories: { key: Category; label: string }[] = [
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "shoes", label: "Shoes" },
  { key: "accessories", label: "Accessories" },
  { key: "outerwear", label: "Outerwear" },
];

export default function ClosetManager() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {categories.map((category) => (
        <ClosetCategoryCard
          key={category.key}
          category={category.key}
          label={category.label}
        />
      ))}
    </div>
  );
}