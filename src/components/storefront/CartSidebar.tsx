"use client";

import { X, Minus, Plus, ShoppingBag, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, type CartItem } from "@/lib/mock-data";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  subtotal: number;
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  subtotal,
}: CartSidebarProps) {
  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              <Badge className="bg-emerald-100 text-emerald-700">{items.length} items</Badge>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="rounded-full bg-slate-100 p-6">
                  <ShoppingBag className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Your cart is empty</h3>
                <p className="mt-2 text-slate-500">Add some products to get started!</p>
                <Button
                  className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    {/* Product Image */}
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Package className="h-8 w-8 text-slate-300" />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">{item.product.name}</h4>
                          <p className="text-sm text-slate-500">{item.product.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-slate-600 transition-colors hover:bg-slate-50"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(item.product.sellingPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 p-6">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>
                {subtotal < 50000 && (
                  <p className="text-xs text-slate-500">
                    Add {formatCurrency(50000 - subtotal)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-emerald-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="mt-4 w-full bg-emerald-600 py-6 text-lg font-semibold text-white hover:bg-emerald-700"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>

              <p className="mt-3 text-center text-xs text-slate-500">
                Secure checkout powered by Paystack
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
