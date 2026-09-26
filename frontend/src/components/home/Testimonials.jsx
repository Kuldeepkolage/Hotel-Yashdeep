import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ExternalLink, CheckCircle } from "lucide-react";
import { GOOGLE_REVIEWS } from "../../constants/content";
import { SITE } from "../../constants/site";
import publicApi from "../../services/publicApi";

// Google multi-color SVG icon
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(GOOGLE_REVIEWS);
  const [meta, setMeta] = useState({
    rating: 5.0,
    totalReviews: 158,
    writeReviewUrl: SITE.googleReviewUrl || "https://share.google/Au3T7npSRutxtBqgt",
  });
  const [i, setI] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch live reviews from backend API on mount, with graceful fallback
  useEffect(() => {
    let isMounted = true;
    publicApi
      .get("/reviews")
      .then((res) => {
        const payload = res.data;
        if (isMounted && payload?.data?.reviews?.length) {
          setReviews(payload.data.reviews);
          if (payload.data.rating) {
            setMeta({
              rating: payload.data.rating,
              totalReviews: payload.data.totalReviews || 158,
              writeReviewUrl: payload.data.writeReviewUrl || SITE.googleReviewUrl || "https://share.google/Au3T7npSRutxtBqgt",
            });
          }
        }
      })
      .catch(() => {
        // Fallback gracefully to bundled GOOGLE_REVIEWS
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance reviews every 2.8 seconds (satisfies 2-3 seconds user request)
  useEffect(() => {
    if (isPaused || !reviews.length) return;
    const interval = setInterval(() => {
      setI((prev) => (prev + 1) % reviews.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [reviews.length, isPaused]);

  const current = reviews[i] || GOOGLE_REVIEWS[0];

  const handlePrev = () => {
    setI((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setI((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section
      className="py-14 sm:py-20 md:py-28 bg-[#fbf9f5] border-y border-border/80 overflow-hidden"
      data-testid="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-luxe max-w-6xl">
        {/* Header with Google Badge and Trust Indicators */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-xs text-xs font-semibold text-dark mb-3">
              <GoogleIcon className="w-4 h-4" />
              <span>Google Customer Reviews</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 font-bold">5.0 ★</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-dark tracking-tight">
              Real stories from <span className="italic text-primary">Google Reviews.</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Auto-updating notes from travelers, pilgrims, and families visiting Yermala.
            </p>
          </div>

          {/* Aggregate Rating Pill & Link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-border/80 shadow-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-dark">{meta.rating.toFixed(1)}</span>
              <span className="text-xs text-muted">({meta.totalReviews}+ reviews)</span>
            </div>

            <a
              href={meta.writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-2xl bg-secondary text-dark hover:bg-dark hover:text-white transition-all shadow-xs"
              title="Review Hotel Yashdeep on Google Maps"
            >
              <span>Review on Google</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Carousel Body */}
        <div className="relative pt-8 sm:pt-10">
          {/* Animated Review Card */}
          <div className="min-h-[220px] sm:min-h-[200px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id || i}
                initial={{ opacity: 0, x: 24, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.98 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-border/90 shadow-sm"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {current.avatar ? (
                      <img
                        src={current.avatar}
                        alt={current.author}
                        className="w-12 h-12 rounded-full object-cover border border-border/80 shadow-xs"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-white font-bold text-lg shadow-xs ${
                        current.accentColor || "bg-primary"
                      } ${current.avatar ? "hidden" : "flex"}`}
                    >
                      {current.initial || current.author?.charAt(0) || "Y"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-semibold text-base sm:text-lg text-dark">
                          {current.author}
                        </span>
                        <CheckCircle size={14} className="text-blue-500 fill-blue-50" title="Verified Review" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        <span className="text-secondary font-medium">{current.badge || "Verified Google Review"}</span>
                        <span>·</span>
                        <span>{current.time || current.relativeTimeDescription || "Recently"}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5 Stars Rating & Google G */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(current.rating || 5)].map((_, s) => (
                        <Star key={s} size={15} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                      Posted on Google
                    </span>
                  </div>
                </div>

                {/* Review Quote */}
                <blockquote className="mt-5 sm:mt-6 font-display text-base sm:text-xl md:text-2xl text-dark leading-snug">
                  "{current.quote || current.text}"
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls Bar: Progress, Dots & Arrows */}
          <div className="mt-6 sm:mt-8 flex items-center justify-between gap-4">
            {/* Live Counter & Auto-rotate badge */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-semibold text-dark">
                {String(i + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline">· Auto-rotating every ~3s</span>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === i ? "w-7 sm:w-8 bg-primary" : "w-2 bg-border hover:bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Next / Prev Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous review"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-white flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-all active:scale-95 shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next review"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-border bg-white flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-all active:scale-95 shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
