import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleItem: (data: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (data: WishlistItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          set({ items: currentItems.filter((item) => item.id !== data.id) });
          toast.info("Removed from wishlist");
        } else {
          set({ items: [...currentItems, data] });
          toast.success("Added to wishlist");
        }
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      isInWishlist: (id: string) => {
        return !!get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
