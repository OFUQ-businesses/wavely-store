import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, ChevronDown, Clock } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { fetchMyOrders } = useOrders();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [seenTracking, setSeenTracking] = useState({});

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    fetchMyOrders()
      .then(fetchedOrders => {
        setOrders(fetchedOrders);
        // Auto-expand orders with new tracking updates
        const newSeen = { ...seenTracking };
        fetchedOrders.forEach(order => {
          const trackingEvents = order.tracking?.events?.length || 0;
          if (trackingEvents > 0 && !newSeen[order.id]) {
            setExpanded(order.id);
            newSeen[order.id] = trackingEvents;
          }
        });
        setSeenTracking(newSeen);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, fetchMyOrders, navigate]);

  const getLatestTrackingEvent = (order) => {
    const events = order.tracking?.events || [];
    return events[events.length - 1];
  };

  const formatTrackingTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStageLabel = (stage) => {
    const stageMap = {
      order_placed: 'Order Placed',
      in_curation: 'In Curation',
      en_route: 'En Route',
      customs: 'Customs Clearance',
      ready_for_delivery: 'Ready for Delivery',
      delivered: 'Delivered',
      enroute: 'En Route'
    };
    return stageMap[stage] || stage;
  };

  if (authLoading || loading) {
    return <p className="text-center py-24 font-wv-sans text-wv-muted">Loading your purchases…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-[var(--wv-space-page)] py-24 flex flex-col items-center text-center gap-6">
        <Package size={40} className="text-wv-muted" strokeWidth={1.25} />
        <h2 className="font-wv-serif text-2xl text-wv-text">No journeys yet</h2>
        <Link to="/#shop" className="px-8 py-3 bg-wv-forest text-wv-on-hero text-xs uppercase tracking-[0.14em] rounded-[var(--wv-radius-md)]">
          Begin shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-[var(--wv-space-page)] py-10 md:py-14">
      <h1 className="font-wv-serif text-3xl text-wv-text mb-10">Purchase history</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const latestEvent = getLatestTrackingEvent(order);
          const isExpanded = expanded === order.id;

          return (
            <article key={order.id} className="rounded-[var(--wv-radius-lg)] border border-wv-border bg-wv-elevated overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:justify-between">
                <div className="flex-1">
                  <p className="font-wv-serif text-lg">{order.orderNumber}</p>
                  <p className="text-sm text-wv-muted font-wv-sans mt-1">{order.date}</p>
                  <p className="text-sm font-wv-sans mt-1 tabular-nums">Total ${order.total?.toFixed(2)}</p>

                  {/* Tracking Badge */}
                  {latestEvent && (
                    <div className="mt-3 flex items-center gap-2">
                      <Clock size={14} className="text-wv-gold-deep" />
                      <span className="text-xs text-wv-soft font-wv-sans">
                        {getStageLabel(latestEvent.stage)}
                      </span>
                      <span className="text-xs text-wv-muted">
                        • {formatTrackingTime(latestEvent.timestamp)}
                      </span>
                    </div>
                  )}

                  <span className="inline-block mt-2 text-[11px] uppercase tracking-wide px-2 py-1 border border-wv-border rounded-sm">
                    {order.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/track/${order.orderNumber}`)}
                    className="px-5 py-2.5 bg-wv-text text-wv-on-hero text-xs uppercase tracking-wide rounded-[var(--wv-radius-md)] flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    <Truck size={16} /> Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    className="px-5 py-2.5 border border-wv-border text-xs uppercase tracking-wide rounded-[var(--wv-radius-md)] flex items-center justify-center gap-2 hover:bg-wv-page transition"
                  >
                    {isExpanded ? 'Hide' : 'Details'} <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-wv-border bg-wv-page px-5 sm:px-6 py-5 space-y-5 text-sm font-wv-sans">
                  {/* Tracking Events */}
                  {(order.tracking?.events?.length > 0) && (
                    <div>
                      <h4 className="font-medium text-wv-text mb-3 text-xs uppercase tracking-wide">Tracking Updates</h4>
                      <div className="space-y-2">
                        {order.tracking.events.map((event, idx) => (
                          <div key={idx} className="flex gap-3 pb-2 last:pb-0">
                            <div className="pt-1">
                              <div className="w-2 h-2 rounded-full bg-wv-gold-deep" />
                            </div>
                            <div className="flex-1">
                              <p className="text-wv-text font-medium">{event.label}</p>
                              {event.description && <p className="text-xs text-wv-muted mt-0.5">{event.description}</p>}
                              {event.location && <p className="text-xs text-wv-soft mt-0.5">{event.location}</p>}
                              <p className="text-xs text-wv-muted mt-1">{formatTrackingTime(event.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Status */}
                  {order.tracking && (
                    <div>
                      <h4 className="font-medium text-wv-text mb-3 text-xs uppercase tracking-wide">Current Status</h4>
                      <div className="grid grid-cols-2 gap-3 text-wv-muted">
                        <div>
                          <p className="text-xs text-wv-soft">Location</p>
                          <p className="text-sm text-wv-text mt-1">{order.tracking.currentLocation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-wv-soft">Est. Arrival</p>
                          <p className="text-sm text-wv-text mt-1">{order.tracking.estimatedArrival}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <p className="font-medium text-wv-text mb-2">Items</p>
                    {order.items?.map(item => (
                      <div key={item._cartId || item.id} className="flex justify-between gap-4 py-2 border-b border-wv-border/50 last:border-0">
                        <span className="text-wv-muted">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div>
                    <div className="grid grid-cols-2 gap-2 text-wv-muted text-xs">
                      <span>Subtotal</span><span className="text-right tabular-nums">${order.subtotal?.toFixed(2)}</span>
                      <span>Shipping</span><span className="text-right">{order.shipping === 0 ? 'Complimentary' : `$${order.shipping}`}</span>
                      <span>Tax</span><span className="text-right tabular-nums">${order.tax?.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-wv-border/50 flex justify-between font-medium text-wv-text">
                      <span>Total</span>
                      <span className="tabular-nums">${order.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {order.shippingDetails && (
                    <div>
                      <p className="font-medium text-wv-text mb-2">Ship to</p>
                      <p className="text-wv-muted text-xs">{order.shippingDetails.fullName}</p>
                      <p className="text-wv-muted text-xs">{order.shippingDetails.address1}</p>
                      <p className="text-wv-muted text-xs">
                        {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zip}
                      </p>
                      <p className="text-wv-muted text-xs">{order.shippingDetails.email}</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
