import React, { useState } from 'react';
import {
  Download,
  Mail,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ExternalLink,
  FileText,
  ShoppingBag,
  Star,
  X,
  ArrowRight,
  Lock,
  Package,
  Layers,
  Code2,
  Send
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DigitalProduct, MarketplaceOrder } from '../types';

interface DigitalProductsSectionProps {
  setActiveTab?: (tab: string) => void;
}

export const DigitalProductsSection: React.FC<DigitalProductsSectionProps> = ({ setActiveTab }) => {
  const { digitalProducts = [], currentUser, siteSettings, addMarketplaceOrder, t } = useData();

  // Active Product for Checkout Modal
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);

  // Form State
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.mobile || '');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  // Invoice & Instant Access State
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleOpenCheckout = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setCustomerEmail(currentUser?.email || '');
    setCustomerName(currentUser?.name || '');
    setCustomerPhone(currentUser?.mobile || '');
    setTrxId('');
    setSenderPhone('');
    setIsCompleted(false);
    setCompletedOrder(null);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!customerEmail || !customerName || !trxId) {
      alert('অনুগ্রহ করে ইমেইল, নাম এবং পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const orderId = `DIGI-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: MarketplaceOrder = {
      id: orderId,
      type: 'digital_product_order',
      digitalProductId: selectedProduct.id,
      title: selectedProduct.title,
      category: selectedProduct.category,
      buyerId: currentUser?.id || `buyer-${Date.now()}`,
      buyerName: customerName,
      buyerEmail: customerEmail,
      buyerPhone: customerPhone,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit IT Digital Store',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isInternalStaff: true,
      amount: selectedProduct.price,
      adminCommission: 0,
      sellerPayout: selectedProduct.price,
      paymentMethod: `${paymentMethod} (TrxID: ${trxId})`,
      transactionId: trxId,
      status: selectedProduct.deliveryType === 'auto' ? 'completed' : 'in_progress',
      deliveryNote: selectedProduct.deliveryType === 'auto'
        ? `স্বয়ংক্রিয় ইমেইল ও ড্যাশবোর্ড ডেলিভারি সম্পন্ন! ডাউনলোড লিঙ্ক: ${selectedProduct.downloadUrl}`
        : 'ম্যানুয়াল ভেরিফিকেশনের জন্য ইমেইল ও ড্যাশবোর্ডে ফাইল প্রসেসিং করা হচ্ছে।',
      downloadUrl: selectedProduct.downloadUrl,
      licenseKey: selectedProduct.licenseKey,
      deliveryFileUrl: selectedProduct.downloadUrl,
      deliveryFileName: `${selectedProduct.title}.zip`,
      deliveredAt: new Date().toLocaleString('en-BD'),
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date().toISOString().split('T')[0]
    };

    addMarketplaceOrder(newOrder);
    setCompletedOrder(newOrder);
    setIsCompleted(true);
  };

  const copyLicenseKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  return (
    <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800 font-bengali">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
            <Zap className="w-3.5 h-3.5" />
            {t('ইনস্ট্যান্ট ডাউনলোড ও সোর্স কোড', 'Instant Download & Source Code')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {t('ডিজিটাল প্রোডাক্টস ও সফটওয়্যার', 'Digital Products & Software Downloads')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            ইমেইলে বিল ও অটো/ম্যানুয়াল ফাইল ডেলিভারি সহ সম্পূর্ণ প্রস্তুত প্রিমিয়াম সোর্স কোড, স্ক্রিপ্ট ও সফটওয়্যার।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-[#1DB954] border border-[#1DB954]/20 rounded-full text-xs font-extrabold flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            অটো ইমেইল বিলিং সাপোর্ট
          </span>
        </div>
      </div>

      {/* Grid: 5 columns on PC, 2 columns on Phone */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
        {digitalProducts.map(product => (
          <div
            key={product.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Image */}
              <div className="relative h-32 sm:h-40 overflow-hidden bg-slate-950">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.deliveryType === 'auto' ? (
                    <span className="bg-[#1DB954] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Zap className="w-3 h-3 fill-white" />
                      অটো ইমেইল
                    </span>
                  ) : (
                    <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Mail className="w-3 h-3" />
                      ম্যানুয়াল ইমেইল
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-slate-900/90 text-slate-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                    {product.fileFormat}
                  </span>
                </div>

                {/* Bottom Specs Pill */}
                <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[10px] text-white font-bold">
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
                    <Package className="w-3 h-3 text-[#1DB954]" />
                    <span>{product.fileSize}</span>
                  </span>
                  <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{product.rating}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 space-y-2">
                <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wide block">
                  {product.category}
                </span>

                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors">
                  {product.title}
                </h3>

                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed hidden sm:block">
                  {product.shortDescription}
                </p>

                {/* Features list bullet tags */}
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {product.features.slice(0, 2).map((feat, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[110px]">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
              <div>
                {product.originalPrice && (
                  <span className="text-[10px] text-slate-400 line-through block leading-none">
                    ৳{product.originalPrice.toLocaleString('bn-BD')}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-black text-[#1DB954]">
                  ৳{product.price.toLocaleString('bn-BD')}
                </span>
              </div>

              <button
                onClick={() => handleOpenCheckout(product)}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKOUT & EMAIL BILLING MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-5 sm:p-7 relative shadow-2xl space-y-5 my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {isCompleted ? 'ইমেইল বিল ও ইনভয়েস কনফার্মেশন' : 'ডিজিটাল প্রোডাক্ট অর্ডারিং'}
                  </h3>
                  <span className="text-xs text-slate-500">PTENit IT Digital Store</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold text-[#1DB954] uppercase bg-[#1DB954]/10 px-2 py-0.5 rounded">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#1DB954]">
                    ৳{selectedProduct.price.toLocaleString('bn-BD')}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {selectedProduct.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>ফাইল ফরম্যাট: {selectedProduct.fileFormat}</span>
                  <span>•</span>
                  <span>সাইজ: {selectedProduct.fileSize}</span>
                </div>
              </div>
            </div>

            {!isCompleted ? (
              /* FORM STEP */
              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                {/* Delivery Guarantee Alert */}
                <div className="p-3 bg-emerald-500/10 border border-[#1DB954]/30 rounded-2xl flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                  <Mail className="w-4 h-4 text-[#1DB954] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-[#1DB954] block">
                      {selectedProduct.deliveryType === 'auto' ? '⚡ ইনস্ট্যান্ট অটোমেটিক ইমেইল ডেলিভারি:' : '📩 ম্যানুয়াল ইমেইল ও ড্যাশবোর্ড ফাইল:'}
                    </span>
                    পেমেন্ট সম্পন্ন করার পর আপনার ইমেইলে বিলিং ফাইল, গুগল ড্রাইভ ডাউনলোড লিঙ্ক ও অফিশিয়াল লাইসেন্স কি স্বয়ংক্রিয়ভাবে পাঠিয়ে দেওয়া হবে।
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                      আপনার ইমেইল অ্যাড্রেস (যে ইমেইলে সোর্স কোড ও বিল পাঠানো হবে) *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method Option */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      পেমেন্ট মেথড নির্বাচন করুন *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map(method => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all ${
                            paymentMethod === method
                              ? 'border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954] ring-2 ring-[#1DB954]/20'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {method === 'bKash' ? 'বিকাশ' : method === 'Nagad' ? 'নগদ' : method === 'Rocket' ? 'রকেট' : 'ব্যাংক'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Numbers Display */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-1 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {paymentMethod === 'bKash' ? 'বিকাশ সেন্ড মানি নম্বর (Personal):' : paymentMethod === 'Nagad' ? 'নগদ সেন্ড মানি নম্বর (Personal):' : paymentMethod === 'Rocket' ? 'রকেট নম্বর (Personal):' : 'ব্যাংক হিসাব নম্বর:'}
                    </span>
                    <div className="font-black text-[#1DB954] text-sm tracking-wider">
                      {paymentMethod === 'bKash' ? (siteSettings.bkashNumber || '01712345678') : paymentMethod === 'Nagad' ? (siteSettings.nagadNumber || '01700000000') : paymentMethod === 'Rocket' ? (siteSettings.rocketNumber || '01900000000') : `${siteSettings.bankName || 'DBBL'} - ${siteSettings.bankAccountNumber || '2181100098765'}`}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      উপরোক্ত নম্বরে ঠিক ৳{selectedProduct.price.toLocaleString('bn-BD')} টাকা সেন্ড মানি করে নিচে TrxID লিখুন।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        যে নম্বর থেকে টাকা পাঠিয়েছেন
                      </label>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={e => setSenderPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                        ট্রানজেকশন আইডি (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={e => setTrxId(e.target.value)}
                        placeholder="e.g. 9X2A88K1"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    মোট প্রদেয়: <span className="font-extrabold text-[#1DB954] text-sm">৳{selectedProduct.price.toLocaleString('bn-BD')}</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    পেমেন্ট নিশ্চিত করুন ও ইমেইলে বিল পান
                  </button>
                </div>
              </form>
            ) : (
              /* CONFIRMATION / INSTANT BILL RECEIPT STEP */
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 bg-emerald-500/10 border border-[#1DB954]/30 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    বিলিং ও পেমেন্ট অর্ডার সফল হয়েছে!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    ইনভয়েস নং: <span className="font-mono font-bold text-[#1DB954]">{completedOrder?.id}</span> • আপনার ইমেইলে (<span className="font-bold underline">{customerEmail}</span>) কপি কনফার্ম করা হয়েছে।
                  </p>
                </div>

                {/* Instant Download Action Box */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1DB954] flex items-center gap-1">
                      <Zap className="w-4 h-4 fill-[#1DB954]" />
                      ডাউনলোড লিঙ্ক ও অ্যাক্সেস ফাইল প্রস্তুত:
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-[#1DB954] px-2 py-0.5 rounded font-bold">
                      ইমেইলে পাঠানো হয়েছে
                    </span>
                  </div>

                  <a
                    href={selectedProduct.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    সরাসরি সোর্স কোড ডাউনলোড করুন (Google Drive Link)
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {selectedProduct.licenseKey && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">লাইসেন্স অ্যাক্টিভেশন কি:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-emerald-400 font-mono text-xs font-bold">
                          {selectedProduct.licenseKey}
                        </code>
                        <button
                          onClick={() => copyLicenseKey(selectedProduct.licenseKey || '')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedKey ? 'কপি হয়েছে' : 'কপি'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Return Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      if (setActiveTab) setActiveTab('marketplace');
                    }}
                    className="text-xs font-bold text-[#1DB954] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>কাস্টমার ড্যাশবোর্ডে ওয়ালেট ও সার্ভিসেস চেক করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
