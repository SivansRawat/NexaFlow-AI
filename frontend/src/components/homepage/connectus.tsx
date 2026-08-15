import { Phone, Mail } from "lucide-react"

export function ConnectUs() {
  return (
    <section className="w-full flex justify-center items-center py-12 sm:py-16 md:py-20 px-2 sm:px-4 bg-[#050505]/45">
      <div
        className="w-full max-w-5xl rounded-3xl p-[1px] bg-gradient-to-r from-[#2640D9] via-[#8A66E6] to-[#6633E6] shadow-lg"
        style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)" }}
      >
        <div className="rounded-[23px] w-full h-full bg-[#0b0b0f] p-6 sm:p-10 md:p-16 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extralight text-white mb-4 sm:mb-6 text-center font-['Outfit']">
            Want to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8A66E6]">Connect?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#737373] mb-6 sm:mb-10 text-center max-w-2xl font-normal">
            We’d love to hear from you — whether you're a business looking to scale with AI, a partner, or just curious about what we do.
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center">
            <a
              href="tel:+917579427608"
              className="px-8 sm:px-10 py-3 sm:py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-[#2640D9] hover:bg-[#6633E6] text-white shadow-md transition-all duration-200 text-center flex items-center gap-2.5 w-full md:w-auto justify-center"
            >
              <Phone className="w-4 h-4 text-white" />
              Call us: ‪+91 75794 27608‬
            </a>
            <a
              href="mailto:hello@nexaflowai.com"
              className="px-8 sm:px-10 py-3 sm:py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-transparent border border-[#2640D9]/30 hover:border-[#2640D9] text-white shadow-md transition-all duration-200 text-center flex items-center gap-2.5 w-full md:w-auto justify-center"
            >
              <Mail className="w-4 h-4 text-[#8A66E6]" />
              Email: hello@nexaflowai.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 