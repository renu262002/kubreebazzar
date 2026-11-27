import { useState, useMemo, useEffect } from 'react';
import {
  Car,
  Bike,
  ShieldCheck,
  MapPin,
  Calendar,
  Gauge,
  Phone,
  MessageCircle,
  CheckCircle2,
  X,
  Fuel,
  Settings,
  Heart,
  Eye,
  Loader2,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import type { Product } from '../types';
import { apiFetch } from '../utils/apiClient';

export function UsedBikesAndCarsPage() {
  const {
    products,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    settings,
    showToast,
    navigate,
  } = useStore();

  // Customer Enquiry modal state
  const [enquiryVehicle, setEnquiryVehicle] = useState<Product | null>(null);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryDate, setEnquiryDate] = useState('');
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Used Bikes & Cars | KubreeBazzar';
  }, []);

  // Only active vehicles belonging to Used Bikes & Cars or carrying vehicleDetails
  const allVehicles = useMemo(() => {
    return products.filter(
      (p) =>
        p.enabled !== false &&
        (p.category.toLowerCase().includes('used bikes') ||
          p.category.toLowerCase().includes('used-bikes') ||
          Boolean(p.vehicleDetails))
    );
  }, [products]);

  // Vehicle list sorted by featured
  const filteredVehicles = useMemo(() => {
    const list = [...allVehicles];
    list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [allVehicles]);

  // Optional configured WhatsApp number (only shown when explicitly configured)
  const configuredWhatsApp = useMemo(() => {
    const rawNumber =
      settings?.whatsappNumber ||
      (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ||
      '';
    const digits = rawNumber.replace(/[^0-9]/g, '');
    if (digits.length >= 10) return { type: 'number' as const, digits };
    if (settings?.whatsappUrl) return { type: 'url' as const, url: settings.whatsappUrl };
    return null;
  }, [settings?.whatsappNumber, settings?.whatsappUrl]);

  const buildWhatsAppLink = (vehicle: Product) => {
    if (!configuredWhatsApp) return null;
    const v = vehicle.vehicleDetails;
    const price = getEffectivePrice(vehicle);
    const detailsText = [
      `Hello KubreeBazzar, I am interested in this used vehicle:`,
      `Vehicle: ${vehicle.name}`,
      v?.brand && v?.model ? `Brand / Model: ${v.brand} ${v.model}` : '',
      v?.year ? `Year: ${v.year}` : '',
      v?.kmDriven !== undefined ? `Kilometres Driven: ${v.kmDriven.toLocaleString('en-IN')} km` : '',
      price > 0 ? `Asking Price: ₹${price.toLocaleString('en-IN')}` : '',
      v?.location ? `Location: ${v.location}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    if (configuredWhatsApp.type === 'number') {
      return `https://wa.me/${configuredWhatsApp.digits}?text=${encodeURIComponent(
        detailsText
      )}`;
    }
    const sep = configuredWhatsApp.url.includes('?') ? '&' : '?';
    return `${configuredWhatsApp.url}${sep}text=${encodeURIComponent(detailsText)}`;
  };

  const sellerPhoneHref = settings?.contactPhone
    ? `tel:${settings.contactPhone.replace(/[^+\d]/g, '')}`
    : null;

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryVehicle) return;
    if (!enquiryName.trim() || !enquiryPhone.trim()) {
      showToast('Please provide your name and phone number');
      return;
    }

    const v = enquiryVehicle.vehicleDetails;
    const price = getEffectivePrice(enquiryVehicle);
    const vehicleSummary = [
      `Vehicle: ${enquiryVehicle.name}`,
      v?.type ? `Type: ${v.type}` : '',
      v?.brand ? `Brand: ${v.brand}` : '',
      v?.model ? `Model: ${v.model}` : '',
      v?.year ? `Year: ${v.year}` : '',
      v?.kmDriven !== undefined
        ? `Kilometres Driven: ${v.kmDriven.toLocaleString('en-IN')} km`
        : '',
      price > 0 ? `Asking Price: ₹${price.toLocaleString('en-IN')}` : '',
      v?.location ? `Location: ${v.location}` : '',
      enquiryDate.trim() ? `Preferred Visit/Call Slot: ${enquiryDate.trim()}` : '',
      enquiryNotes.trim() ? `Customer Note: ${enquiryNotes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setSubmittingEnquiry(true);
    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiryName.trim(),
          email:
            enquiryEmail.trim() ||
            settings?.contactEmail ||
            'vehicle-enquiry@kubreebazzar.com',
          phone: enquiryPhone.trim(),
          subject: `Used Vehicle Enquiry: ${enquiryVehicle.name}`,
          message: vehicleSummary,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Could not submit enquiry');
      }
      setEnquirySubmitted(true);
      showToast(
        `Enquiry submitted for ${enquiryVehicle.name}! Our team will contact you shortly.`
      );
      window.setTimeout(() => {
        setEnquiryVehicle(null);
        setEnquirySubmitted(false);
        setEnquiryName('');
        setEnquiryPhone('');
        setEnquiryEmail('');
        setEnquiryDate('');
        setEnquiryNotes('');
      }, 2200);
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Unable to submit enquiry. Please try again.'
      );
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#64748B]">
        <ol className="flex items-center gap-2">
          <li>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-[#0B3B78] hover:underline cursor-pointer"
            >
              Home
            </button>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#0B3B78]">Used Bikes &amp; Cars</li>
        </ol>
      </nav>

      {/* Hero Banner for Combined Category */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0B3B78] via-[#1D6FD8] to-[#0B3B78] text-white p-4 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
            <span>KubreeBazzar Verified Pre-Owned Vehicles</span>
          </div>
          <h1 className="font-display text-2xl sm:text-5xl font-extrabold leading-tight">
            Used Bikes &amp; Cars
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            Explore verified pre-owned motorcycles, scooters, hatchbacks, and
            family cars in one combined marketplace. Compare mileage, year,
            location, and submit direct seller enquiries.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/20 text-xs font-bold">
              {filteredVehicles.length}{' '}
              {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Available
            </span>
            {sellerPhoneHref && settings?.contactPhone && (
              <a
                href={sellerPhoneHref}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Seller ({settings.contactPhone})</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Listing Grid / Empty State */}
      {allVehicles.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl bg-white border border-[#DCE6F2] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F6FF] text-[#0B3B78] flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0B3B78]">
            No Verified Used Vehicles Available Right Now
          </h2>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Pre-owned bikes and cars appear here only after inspection, mileage,
            and ownership details are published in the catalogue. Reach out to
            our team if you are looking for a specific vehicle model.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
            {sellerPhoneHref && (
              <a
                href={sellerPhoneHref}
                className="px-5 py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Seller</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Submit Vehicle Requirement
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 rounded-xl bg-[#F0F6FF] hover:bg-[#E5EDF9] text-[#0B3B78] text-xs font-bold transition-colors cursor-pointer"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => {
            const vDetails = vehicle.vehicleDetails;
            const isWishlisted = wishlist.includes(vehicle.id);
            const isBike = vDetails?.type === 'Bike';
            const askingPrice = getEffectivePrice(vehicle);
            const brandModelLabel =
              vDetails?.brand && vDetails?.model
                ? `${vDetails.brand} ${vDetails.model}`
                : vDetails?.brand || vehicle.brand || '';

            return (
              <article
                key={vehicle.id}
                className="rounded-2xl bg-white border border-[#DCE6F2] overflow-hidden shadow-xs hover:shadow-md hover:border-[#1D6FD8] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Type Badge */}
                  <div className="relative aspect-16/10 bg-[#F8FAFC] overflow-hidden">
                    <ResilientImage
                      src={vehicle.images?.[0]}
                      fallbackSrc={undefined}
                      emptyLabel="Verified Vehicle Photo Needed · Image Pending"
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-xs ${
                          isBike ? 'bg-[#FF6B1A]' : 'bg-[#0B3B78]'
                        }`}
                      >
                        {isBike ? (
                          <Bike className="w-3 h-3" />
                        ) : (
                          <Car className="w-3 h-3" />
                        )}
                        <span>{isBike ? 'Used Bike' : 'Used Car'}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(vehicle.id)}
                      aria-label={
                        isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'
                      }
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#FF6B1A] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? 'fill-[#FF6B1A]' : ''
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(vehicle)}
                      className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-xs cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#64748B]">
                        <span className="truncate font-semibold text-[#1D6FD8]">
                          {brandModelLabel || 'Verified Vehicle'}
                        </span>
                        {vDetails?.year && (
                          <span className="inline-flex items-center gap-1 shrink-0 font-mono-tabular">
                            <Calendar className="w-3 h-3" />
                            <span>{vDetails.year}</span>
                          </span>
                        )}
                      </div>
                      <h3
                        onClick={() => navigate(`/product/${vehicle.slug}`)}
                        className="font-display text-base font-bold text-[#0B3B78] hover:text-[#FF6B1A] line-clamp-1 cursor-pointer transition-colors mt-0.5"
                      >
                        {vehicle.name}
                      </h3>
                    </div>

                    {/* Key Vehicle Specifications Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#EEF4FB]">
                      {vDetails?.kmDriven !== undefined && (
                        <div className="flex items-center gap-1.5 text-[#334155]">
                          <Gauge className="w-3.5 h-3.5 text-[#1D6FD8] shrink-0" />
                          <span className="font-mono-tabular font-semibold truncate">
                            {vDetails.kmDriven.toLocaleString('en-IN')} km
                          </span>
                        </div>
                      )}

                      {vDetails?.location && (
                        <div className="flex items-center gap-1.5 text-[#334155]">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                          <span className="truncate">{vDetails.location}</span>
                        </div>
                      )}

                      {vDetails?.fuelType && (
                        <div className="flex items-center gap-1.5 text-[#334155]">
                          <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{vDetails.fuelType}</span>
                        </div>
                      )}

                      {vDetails?.transmission && (
                        <div className="flex items-center gap-1.5 text-[#334155]">
                          <Settings className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate">
                            {vDetails.transmission}
                          </span>
                        </div>
                      )}
                    </div>

                    {vehicle.shortDescription && (
                      <p className="text-[11px] text-[#64748B] line-clamp-2">
                        {vehicle.shortDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Asking Price & Action Buttons */}
                <div className="p-4 pt-0 space-y-2.5">
                  <div className="pt-3 border-t border-[#DCE6F2] flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                        Asking Price
                      </p>
                      <p className="font-mono-tabular text-lg font-extrabold text-[#0B3B78]">
                        {askingPrice > 0
                          ? `₹${askingPrice.toLocaleString('en-IN')}`
                          : 'Price on Request'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${vehicle.slug}`)}
                      className="min-h-[38px] px-3 py-2 rounded-xl bg-[#F0F6FF] hover:bg-[#E5EDF9] text-[#0B3B78] text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEnquirySubmitted(false);
                        setEnquiryVehicle(vehicle);
                      }}
                      className="min-h-[38px] px-3 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>Enquire Now</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Direct Vehicle Enquiry Modal */}
      {enquiryVehicle && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Enquire about ${enquiryVehicle.name}`}
        >
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white border border-[#DCE6F2] p-4 sm:p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setEnquiryVehicle(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {enquirySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto" />
                <h3 className="font-display text-xl font-bold text-[#0B3B78]">
                  Enquiry Successfully Submitted
                </h3>
                <p className="text-xs text-[#64748B]">
                  Our vehicle team has received your enquiry for{' '}
                  <strong className="text-[#0B3B78]">
                    {enquiryVehicle.name}
                  </strong>{' '}
                  and will contact you at{' '}
                  <strong className="text-[#0B3B78]">{enquiryPhone}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B1A]">
                    Vehicle &amp; Seller Enquiry
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#0B3B78]">
                    {enquiryVehicle.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {getEffectivePrice(enquiryVehicle) > 0
                      ? `Asking Price: ₹${getEffectivePrice(
                          enquiryVehicle
                        ).toLocaleString('en-IN')}`
                      : 'Price on Request'}
                    {enquiryVehicle.vehicleDetails?.location
                      ? ` · ${enquiryVehicle.vehicleDetails.location}`
                      : ''}
                  </p>
                </div>

                {/* Direct Contact Seller & Configured WhatsApp Actions */}
                {(sellerPhoneHref || buildWhatsAppLink(enquiryVehicle)) && (
                  <div className="flex flex-wrap gap-2">
                    {sellerPhoneHref && settings?.contactPhone && (
                      <a
                        href={sellerPhoneHref}
                        className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-[#F0F6FF] hover:bg-[#E2ECFB] border border-[#DCE6F2] text-[#0B3B78] text-xs font-bold inline-flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#1D6FD8]" />
                        <span>Contact Seller</span>
                      </a>
                    )}
                    {buildWhatsAppLink(enquiryVehicle) && (
                      <a
                        href={buildWhatsAppLink(enquiryVehicle)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-[#EAF7EC] hover:bg-[#D7F0DC] border border-[#A7F3D0] text-[#065F46] text-xs font-bold inline-flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Enquiry</span>
                      </a>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Email Address (optional)
                    </label>
                    <input
                      type="email"
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Preferred Test Ride / Callback Slot
                    </label>
                    <input
                      type="text"
                      value={enquiryDate}
                      onChange={(e) => setEnquiryDate(e.target.value)}
                      placeholder="e.g. Tomorrow Afternoon 3 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Message / Questions
                    </label>
                    <textarea
                      rows={2}
                      value={enquiryNotes}
                      onChange={(e) => setEnquiryNotes(e.target.value)}
                      placeholder="Ask about RC documents, inspection report, or test ride..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2] text-base sm:text-xs text-[#132238] focus:bg-white focus:outline-none focus:border-[#1D6FD8]"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submittingEnquiry ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Enquiry...</span>
                      </>
                    ) : (
                      <span>Submit Vehicle Enquiry</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
