import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, Calendar } from 'lucide-react';
import { api } from '../lib/api';

const TrackOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = location.state?.email || '';
    setLoading(true);
    api
      .trackOrder(orderId, email)
      .then(data => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId, location.state?.email]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <p className="text-center py-24 font-wv-sans text-wv-muted">Loading journey…</p>;
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-[var(--wv-space-page)] py-24 flex flex-col items-center text-center gap-6">
        <Package className="text-wv-muted" size={48} />
        <h2 className="font-wv-serif text-2xl">Order not found</h2>
        <button type="button" onClick={() => navigate('/track')} className="text-sm underline font-wv-sans">
          Try again
        </button>
      </div>
    );
  }

  const tracking = order.tracking || {};
  const timeline = order.timeline || [];
  const trackingEvents = tracking.events || [];

  return (
    <div className="max-w-5xl mx-auto px-[var(--wv-space-page)] py-10 md:py-14">
      <p className="wv-caption text-wv-muted mb-2 text-center">Your Wavely journey</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="font-wv-serif text-3xl text-wv-text text-center sm:text-left flex-1">
          {order.orderNumber}
        </h1>
        <button type="button" onClick={() => navigate('/orders')} className="flex items-center justify-center gap-2 text-sm text-wv-muted font-wv-sans">
          <ArrowLeft size={16} /> Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-elevated p-6">
            {timeline.map((step, i) => (
              <div key={step.key} className={`flex gap-4 ${i < timeline.length - 1 ? 'pb-8' : ''}`}>
                <div className="flex flex-col items-center">
                  <div
                    className={`size-3 rounded-full border-2 ${
                      step.active ? 'border-wv-gold-deep bg-wv-gold-deep ring-4 ring-wv-gold-deep/20' : step.completed ? 'border-wv-gold-deep bg-wv-gold-deep' : 'border-wv-border bg-wv-elevated'
                    }`}
                  />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-wv-border min-h-[3rem] mt-1" />}
                </div>
                <div className="pb-2">
                  <p className={`font-wv-sans text-sm uppercase tracking-wide ${step.active ? 'text-wv-text font-medium' : 'text-wv-muted'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-wv-soft mt-1">{step.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tracking Events Timeline */}
          {trackingEvents.length > 0 && (
            <div className="rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-elevated p-6">
              <h3 className="font-wv-serif text-lg mb-5 text-wv-text">Tracking history</h3>
              <div className="space-y-4">
                {trackingEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-wv-gold-deep" />
                      {idx < trackingEvents.length - 1 && <div className="w-px flex-1 bg-wv-border/50 min-h-[2rem] mt-2" />}
                    </div>
                    <div className="pb-2">
                      <p className="font-wv-sans font-medium text-sm text-wv-text">{event.label}</p>
                      <p className="text-xs text-wv-soft mt-1">{event.description}</p>
                      {event.location && <p className="text-xs text-wv-muted mt-1.5 flex items-center gap-1.5"><MapPin size={12} /> {event.location}</p>}
                      <p className="text-xs text-wv-muted mt-1">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Current Status Card */}
          <div className="rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-summary min-h-fit p-6">
            <h3 className="font-wv-serif text-lg mb-5 text-wv-text">Current status</h3>
            
            <div className="space-y-4">
              {/* Location */}
              <div>
                <p className="text-xs uppercase tracking-wide text-wv-soft font-wv-sans mb-1.5">Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="text-wv-gold-deep mt-0.5 flex-shrink-0" size={20} />
                  <p className="font-wv-sans text-sm text-wv-text">{tracking.currentLocation || 'In transit'}</p>
                </div>
              </div>

              {/* Estimated Arrival */}
              <div>
                <p className="text-xs uppercase tracking-wide text-wv-soft font-wv-sans mb-1.5">Estimated arrival</p>
                <div className="flex items-start gap-2">
                  <Calendar className="text-wv-gold-deep mt-0.5 flex-shrink-0" size={20} />
                  <p className="font-wv-sans text-sm text-wv-text">{tracking.estimatedArrival || 'TBD'}</p>
                </div>
              </div>

              {/* Last Updated */}
              {tracking.lastUpdated && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-wv-soft font-wv-sans mb-1.5">Last updated</p>
                  <p className="font-wv-sans text-xs text-wv-muted">{formatDate(tracking.lastUpdated)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-elevated p-6">
            <h3 className="font-wv-serif text-lg mb-4 text-wv-text">Order summary</h3>
            
            <ul className="space-y-2 text-sm font-wv-sans text-wv-muted mb-4 pb-4 border-b border-wv-border">
              {order.items?.map(item => (
                <li key={item._cartId || item.id} className="flex justify-between gap-2">
                  <span className="line-clamp-1">{item.name}</span>
                  <span className="tabular-nums shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm font-wv-sans text-wv-muted mb-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Complimentary' : `$${order.shipping?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="tabular-nums">${order.tax?.toFixed(2)}</span>
              </div>
            </div>

            <p className="font-wv-sans text-sm flex justify-between border-t border-wv-border pt-3">
              <span className="text-wv-text">Total</span>
              <span className="tabular-nums font-medium text-wv-text">${order.total?.toFixed(2)}</span>
            </p>
          </div>

          {/* Shipping Details */}
          {order.shippingDetails && (
            <div className="rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-elevated p-6">
              <h3 className="font-wv-serif text-lg mb-4 text-wv-text">Shipping to</h3>
              <div className="space-y-1 text-sm font-wv-sans text-wv-muted">
                <p className="text-wv-text">{order.shippingDetails.fullName}</p>
                <p>{order.shippingDetails.address1}</p>
                {order.shippingDetails.address2 && <p>{order.shippingDetails.address2}</p>}
                <p>
                  {order.shippingDetails.city}
                  {order.shippingDetails.state && `, ${order.shippingDetails.state}`}
                  {order.shippingDetails.zip && ` ${order.shippingDetails.zip}`}
                </p>
                <p>{order.shippingDetails.country}</p>
                {order.shippingDetails.phone && <p className="mt-2">{order.shippingDetails.phone}</p>}
                {order.shippingDetails.email && <p>{order.shippingDetails.email}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
