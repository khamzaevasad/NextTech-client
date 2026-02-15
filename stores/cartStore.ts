import { CartItem } from "@/lib/types/common";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      /* ---------------------------------- onAdd --------------------------------- */
      onAdd: (input) =>
        set((state) => {
          const exist = state.cartItems.find((item) => item._id === input._id);

          let updated;
          if (exist) {
            updated = state.cartItems.map((item) =>
              item._id === input._id
                ? { ...exist, quantity: exist.quantity + 1 }
                : item,
            );
          } else {
            updated = [...state.cartItems, { ...input, quantity: 1 }];
          }

          toast.success("Product added to cart");
          return { cartItems: updated };
        }),

      /* -------------------------------- onRemove -------------------------------- */
      onRemove: (input) =>
        set((state) => {
          const exist = state.cartItems.find((item) => item._id === input._id);

          let updated;
          if (exist && exist.quantity === 1) {
            updated = state.cartItems.filter((item) => item._id !== input._id);
          } else {
            updated = state.cartItems.map((item) =>
              item._id === input._id
                ? { ...exist, quantity: exist!.quantity - 1 }
                : item,
            );
          }

          return { cartItems: updated };
        }),

      /* -------------------------------- onDelete -------------------------------- */
      onDelete: (input) =>
        set((state) => {
          const updated = state.cartItems.filter(
            (item) => item._id !== input._id,
          );
          toast.success("Product have been deleted");
          return { cartItems: updated };
        }),

      /* ------------------------------- onDeleteAll ------------------------------ */
      onDeleteAll: () => set({ cartItems: [] }),

      getTotalPrice: () => {
        const { cartItems } = get();
        return cartItems.reduce(
          (sum, item) => sum + item.productPrice * item.quantity,
          0,
        );
      },

      getTotalItems: () => {
        const { cartItems } = get();
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cartData",
    },
  ),
);
