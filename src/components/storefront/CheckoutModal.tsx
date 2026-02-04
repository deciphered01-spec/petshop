"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, type CartItem } from "@/lib/mock-data";
import { nigeriaLocations } from "@/lib/nigeria-data";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onOrderComplete: () => void;
}

type PaymentMethod = "card" | "bank" | "ussd";
type CheckoutStep = "details" | "payment" | "processing" | "success";

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
  onOrderComplete,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  // Derived state for cities based on selected state
  const cities = formData.state ? nigeriaLocations.cities[formData.state] || [] : [];

  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close if needed, but usually we keep it or reset on success
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePayment = () => {
    setStep("processing");
    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const handleComplete = () => {
    onOrderComplete();
    setStep("details");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    });
  };

  const paymentMethods = [
    { id: "card" as const, name: "Card Payment", icon: CreditCard, description: "Visa, Mastercard, Verve" },
    { id: "bank" as const, name: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
    { id: "ussd" as const, name: "USSD", icon: Smartphone, description: "Pay with USSD code" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {step === "success" ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">Order Confirmed!</h2>
            <p className="mt-2 text-slate-600">
              Your order has been placed successfully. A confirmation email has been sent to {formData.email}.
            </p>
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">Order ID</p>
              <p className="text-lg font-bold text-slate-900">#ORD-2024-{Math.floor(Math.random() * 10000).toString().padStart(4, "0")}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 bg-transparent"
                onClick={handleComplete}
              >
                Continue Shopping
              </Button>
              <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleComplete}>
                View Order
              </Button>
            </div>
          </div>
        ) : step === "processing" ? (
          <div className="p-12 text-center">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-emerald-600" />
            <h2 className="mt-6 text-xl font-bold text-slate-900">Processing Payment...</h2>
            <p className="mt-2 text-slate-600">Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                {step === "payment" && (
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-slate-900">
                  {step === "details" ? "Checkout" : "Payment"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-5">
              {/* Form Section */}
              <div className="p-6 md:col-span-3 md:border-r md:border-slate-100">
                {step === "details" ? (
                  <form onSubmit={handleSubmitDetails} className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Delivery Information</h3>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <textarea
                        placeholder="Delivery Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <select
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({ ...formData, state: e.target.value, city: "" });
                          }}
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="">Select State</option>
                          {nigeriaLocations.states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                          disabled={!formData.state}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                      Continue to Payment
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Select Payment Method</h3>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${paymentMethod === method.id
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            <div
                              className={`rounded-lg p-2 ${paymentMethod === method.id ? "bg-emerald-100" : "bg-slate-100"
                                }`}
                            >
                              <Icon
                                className={`h-5 w-5 ${paymentMethod === method.id ? "text-emerald-600" : "text-slate-500"
                                  }`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{method.name}</p>
                              <p className="text-sm text-slate-500">{method.description}</p>
                            </div>
                            {paymentMethod === method.id && (
                              <CheckCircle className="h-5 w-5 text-emerald-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-lg bg-sky-50 p-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/logo-green.png"
                          alt="Paystack"
                          width={80}
                          height={24}
                          className="h-5 w-auto opacity-80"
                        />
                        <span className="text-sm text-sky-700">Secured by Paystack</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-emerald-600 py-6 text-lg font-semibold text-white hover:bg-emerald-700"
                      onClick={handlePayment}
                    >
                      Pay {formatCurrency(total)}
                    </Button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 p-6 md:col-span-2">
                <h3 className="font-semibold text-slate-900">Order Summary</h3>

                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                        <Package className="h-6 w-6 text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {formatCurrency(item.product.sellingPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-emerald-600" : ""}>
                      {deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
