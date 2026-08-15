import  { useRef, useEffect, useState, MutableRefObject } from "react";

function useInView(threshold = 0.2): [MutableRefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export function CustomerStoriesSection() {
  const [ref1, inView1] = useInView();
  const [ref2, inView2] = useInView();
  const [ref3, inView3] = useInView();

  // Gradient border style
  const cardBorder = "p-[1px] bg-gradient-to-br from-[#2640D9]/30 via-transparent to-[#262626]/50 rounded-3xl";
  const cardInner = "bg-[#0b0b0f] rounded-[23px] flex flex-col items-center text-center min-h-[380px] sm:min-h-[420px] h-full";

  return (
    <section className="py-16 sm:py-24 px-4 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-center mb-10 sm:mb-14 text-white font-['Outfit']">
          Customer <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#818CF8]">Stories</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
          {/* Card 1 */}
          <div
            ref={ref1}
            className={`${cardBorder} transition-all duration-[1800ms] ease-out ${inView1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className={cardInner + " shadow-2xl p-6 sm:p-8 border border-[#2640D9]/10"}>
              <img src="/coustmer1.jpg" alt="Sudeep Bansal" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-2 border-[#2640D9]/30" />
              <div className="font-semibold text-base text-white mb-1">Sudeep Bansal</div>
              <div className="text-xs text-[#8A66E6] mb-4">VP of Wow Skin Science</div>
              <div className="text-xs sm:text-sm text-[#737373] leading-relaxed font-normal">NexaFlow AI helped us automate a major chunk of our backend operations. Their workflow tools are reliable and effortless to integrate into our daily tasks.</div>
            </div>
          </div>
          {/* Card 2 */}
          <div
            ref={ref2}
            className={`${cardBorder} transition-all duration-[1800ms] ease-out delay-200 ${inView2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className={cardInner + " shadow-2xl p-6 sm:p-8 border border-[#8A66E6]/10"}>
              <img src="/coustmer2.jpg" alt="Karthik Ranganathan" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-2 border-[#8A66E6]/30" />
              <div className="font-semibold text-base text-white mb-1">Karthik Ranganathan</div>
              <div className="text-xs text-[#8A66E6] mb-4">Assistant VP, eCommerce, The ThickShake Factory</div>
              <div className="text-xs sm:text-sm text-[#737373] leading-relaxed font-normal">NexaFlow AI automated our eCommerce and document workflows. We can now scale our throughput without adding operations overhead.</div>
            </div>
          </div>
          {/* Card 3 */}
          <div
            ref={ref3}
            className={`${cardBorder} transition-all duration-[1800ms] ease-out delay-400 ${inView3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className={cardInner + " shadow-2xl p-6 sm:p-8 border border-[#6633E6]/10"}>
              <img src="/coustmer3.jpg" alt="Rajat Jaiswal" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-2 border-[#6633E6]/30" />
              <div className="font-semibold text-base text-white mb-1">Rajat Jaiswal</div>
              <div className="text-xs text-[#8A66E6] mb-4">Co-founder, Wat-a-Burger</div>
              <div className="text-xs sm:text-sm text-[#737373] leading-relaxed font-normal">By automating recurring customer and PDF tasks with NexaFlow AI, we have reduced operational bottlenecks and improved response times significantly.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 