import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Award, Users, ArrowRight, Activity, Smile, PhoneCall, Sparkles, MessageSquare, CalendarCheck, Bot } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const servicesTrackRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const bannerRef = useRef(null);
  const testimonialsRef = useRef(null);

  const departments = [
    {
      id: 'cardiology',
      name: 'Cardiology Division',
      description: 'Comprehensive coronary care, diagnostic mapping, and rhythm control monitored by seasoned cardiologists.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50 border-rose-100',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYgYBIlm5witDE7hCW56t0r3TAUC_dAj__12fCxjPrhw&s=10',
    },
    {
      id: 'dermatology',
      name: 'Dermatology & Skin Science',
      description: 'Advanced clinical treatments for complex skin disorders, oncology checks, and aesthetics.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 border-amber-100',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcO7DshGSpIzLSxbucc8XAWugxCP76IIOGh2XRlrv-iA&s',
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics & Joint Care',
      description: 'Restoring joint motility and skeletal strength through non-invasive therapies and robotic surgeries.',
      icon: Activity,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsOS8SngKLoulKiz5ZNrc7ZKtOG-dvVMf7AYIFup7lsw&s=10',
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics Laboratory',
      description: 'Precision pathology reports, high-resolution radiology scans, and molecular profiling.',
      icon: ShieldCheck,
      color: 'text-teal-500 bg-teal-50 border-teal-100',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp_sk6IYUurZTuKa4lUV8AyV2Ql4gzF2v47xS3GGlc-g&s=10',
    },
  ];

  const statistics = [
    { value: '18k+', label: 'Patients Treated', icon: Users },
    { value: '140+', label: 'Medical Specialists', icon: Award },
    { value: '99.6%', label: 'Positive Outcomes', icon: Smile },
    { value: '24/7', label: 'Telemedicine Desk', icon: PhoneCall },
  ];

  // GSAP ScrollTrigger for horizontal scroll of Clinical Services
  useGSAP(() => {
    const track = servicesTrackRef.current;
    const section = servicesSectionRef.current;
    if (!track || !section) return;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(trackWidth - viewportWidth);
    };

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { scope: servicesSectionRef });

  // GSAP float animation for the Chatbot Banner
  useGSAP(() => {
    if (!bannerRef.current) return;
    
    gsap.from(bannerRef.current, {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // GSAP staggered animation for Testimonial Cards
  useGSAP(() => {
    if (!testimonialsRef.current) return;
    
    gsap.from('.testimonial-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: testimonialsRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  return (
    <div className="pb-16 sm:pb-20 w-full max-w-[100vw] overflow-x-clip">
      {/* 1. Hero Section — HOPE [Video] HEAL WITH CARE */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#FAFFFD] pt-6 sm:pt-12 pb-10 sm:pb-12 px-3 sm:px-6 lg:px-8 text-center select-none">
        {/* Subtle radial background tint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f6fde6]/70 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center justify-center space-y-3 sm:space-y-6 my-auto">

          {/* Top Logo — MediCare logo centered with natural breathing room */}
          <div className="mb-1 sm:mb-4">
            <img
              src="/imgvid/medicarelogo.png"
              alt="MediCare Logo"
              className="h-16 sm:h-24 md:h-28 lg:h-[105px] w-auto object-contain"
            />
          </div>

          {/* Headline Row 1: HOPE + Borderless Compact Video Frame + HEAL (Strictly 1 Line) */}
          <div className="flex flex-nowrap mt-3 sm:mt-6 items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-4 md:gap-6 lg:gap-8 whitespace-nowrap tracking-tight">
            <span className="text-[8.5vw] sm:text-[8vw] md:text-[7.5vw] lg:text-[120px] xl:text-[138px] 2xl:text-[150px] font-extrabold text-black font-body leading-none">
              HOPE
            </span>

            {/* Stadium/Pill Rounded Video Container — Borderless, No Shadow, Height slightly more than text, Width decreased */}
            <div className="relative w-[14vw] sm:w-[13vw] md:w-[12vw] lg:w-50 xl:w-62 2xl:w-60 h-[10.5vw] sm:h-[10vw] md:h-[9vw] lg:h-[135px] xl:h-[155px] 2xl:h-[170px] rounded-full overflow-hidden shrink-0 transform hover:scale-[1.02] transition-transform duration-300">
              <video
                src="/imgvid/medicarevid1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center"
              />
            </div>

            <span className="text-[8.5vw] sm:text-[8vw] md:text-[7.5vw] lg:text-[120px] xl:text-[138px] 2xl:text-[150px] font-extrabold text-black font-body leading-none">
              HEAL
            </span>
          </div>

          {/* Headline Row 2: WITH CARE (Centered, EXACT same font size and Montserrat styling) */}
          <div className="text-center w-full">
            <span className="text-[8.5vw] sm:text-[8vw] md:text-[7.5vw] lg:text-[120px] xl:text-[138px] 2xl:text-[150px] font-extrabold text-black font-body leading-none tracking-tight block text-center">
              WITH CARE
            </span>
          </div>

          {/* Fully Rounded CTAs with working functionality */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3">
            <Link
              to="/book"
              className="px-5 sm:px-7 py-3 sm:py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer font-heading text-xs sm:text-base"
            >
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              Book Appointment
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              className="px-5 sm:px-7 py-3 sm:py-4 bg-white text-teal-900 border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50/50 font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer font-heading text-xs sm:text-base"
            >
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              Consult AI
            </button>
          </div>

        </div>
      </section>

      <div className="space-y-16 sm:space-y-24 mt-6 sm:mt-8">

        {/* 2. Statistics Section — Full width (no rounded corners), cream (#FAFFFD) text */}
        <section className="w-full bg-black text-[#FAFFFD] relative overflow-hidden py-12 sm:py-16 border-y border-slate-900/80 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800/15 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-950/25 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {statistics.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center space-y-2 sm:space-y-2.5 border-r [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0 border-teal-900/40">
                    <div className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00d2b4] mb-1">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAFFFD] font-heading tracking-tight drop-shadow-sm">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-[#FAFFFD]/75 uppercase tracking-widest font-semibold font-body">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Department Highlights — Horizontal Scroll with ScrollTrigger */}
        <section ref={servicesSectionRef} className="services-scroll-section relative overflow-hidden">
          {/* Section Header (pinned overlay) */}
          <div className="absolute top-4 sm:top-8 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8">
            <div className="section-header-anim max-w-7xl mx-auto text-center flex flex-col items-center space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-teal-950 font-heading">
                Our Dedicated Clinical Services
              </h2>
              <p className="text-slate-500 text-xs sm:text-base leading-relaxed max-w-xl">
                MediCare houses state-of-the-art departments engineered to cater to all aspects of clinical science, offering virtual scheduling and AI support.
              </p>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={servicesTrackRef}
            className="services-scroll-track flex items-center gap-6 sm:gap-8 pt-28 sm:pt-36 pb-8 sm:pb-12 pl-4 sm:pl-8 pr-[20vw] sm:pr-[30vw]"
            style={{ width: 'max-content' }}
          >
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              const isOffset = index % 2 === 1;
              return (
                <div
                  key={dept.id}
                  className={`services-card bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md transition-all duration-500 flex flex-col group hover:shadow-2xl ${isOffset ? 'sm:mt-14 mt-4' : 'mt-0'}`}
                  style={{ width: 'min(340px, 82vw)', minWidth: 'min(340px, 82vw)', flexShrink: 0 }}
                >
                  <div className="h-40 sm:h-48 overflow-hidden relative">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className={`absolute bottom-3 left-3 p-2.5 rounded-2xl border ${dept.color} shadow-md backdrop-blur-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800 font-heading">{dept.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-body">{dept.description}</p>
                    </div>
                    <Link
                      to="/book"
                      className="text-xs font-bold text-teal-800 hover:text-teal-600 flex items-center gap-1.5 transition-colors group/link"
                    >
                      Schedule Specialist
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Telehealth Promo / AI Banner */}
        <section ref={bannerRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-black text-white overflow-hidden p-6 sm:p-12 lg:p-16 text-left border border-slate-800 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-5 sm:space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5" />
                  AI Clinical Consultation
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight tracking-tight text-white">
                  Get Instant Clinical Answers from the <br className="hidden sm:inline" />
                  MediCare AI Chatbot Assistant
                </h2>
                <p className="text-teal-100 text-xs sm:text-base leading-relaxed max-w-xl font-body">
                  Need immediate suggestions on minor symptoms or want to check doctor schedules? Chat with our virtual health desk integrated directly with your profile messages.
                </p>
                <div className="pt-1 sm:pt-2">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#00d2b4] hover:bg-[#00baa0] text-[#080d11] font-extrabold rounded-xl shadow-[0_0_20px_rgba(0,210,180,0.3)] hover:shadow-[0_0_25px_rgba(0,210,180,0.5)] transition-all cursor-pointer font-heading text-xs sm:text-base"
                  >
                    Start Consultation Chat
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="lg:col-span-4 flex justify-center">
                <div className="p-6 bg-slate-900/90 backdrop-blur-xs rounded-2xl border border-slate-800 text-left max-w-xs space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-950 border border-[#00d2b4]/40 flex items-center justify-center font-bold text-[#00d2b4]">AI</div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">MediCare Assistant</h4>
                      <p className="text-[10px] text-teal-300 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2b4] animate-ping"></span>
                        Online & Listening
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-black/60 rounded-xl text-xs text-teal-100/90 leading-relaxed italic border-l-2 border-[#00d2b4]">
                    "Hello! I can help check available services, analyze symptoms, and guide your booking flow."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Interactive Testimonial Section */}
        <section ref={testimonialsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="section-header-anim text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-teal-950 font-heading">What Our Patients Say</h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Read stories of recovery and clinical satisfaction from patients registered in our databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="testimonial-card bg-white p-8 rounded-3xl border border-slate-100 shadow-xs relative text-left">
              <p className="text-sm text-slate-600 leading-relaxed font-body italic">
                "Booking a cardiologist was incredibly fast. I selected Cardiology, and within seconds the portal scheduled me with Dr. Sara Khan on my chosen date. Fully digital!"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
                <img src="https://ui-avatars.com/api/?name=James+Carter&background=10B981&color=fff" alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">James Carter</h4>
                  <p className="text-[10px] text-slate-400">Registered Patient</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-white p-8 rounded-3xl border border-slate-100 shadow-xs relative text-left">
              <p className="text-sm text-slate-600 leading-relaxed font-body italic">
                "The AI chatbot analyzed my minor rash and suggested dermatologist checking. The booking engine assigned me to Dr. Chen, who resolved my condition. Simply excellent experience!"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
                <img src="https://ui-avatars.com/api/?name=Sofia+Martinez&background=115E59&color=fff" alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">Sofia Martinez</h4>
                  <p className="text-[10px] text-slate-400">Chronic Skin Care Patient</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-white p-8 rounded-3xl border border-slate-100 shadow-xs relative text-left">
              <p className="text-sm text-slate-600 leading-relaxed font-body italic">
                "As an administrator, registering new diagnostic services and tracking active hospital pillars is unified. The dashboard layouts are neat, reactive, and responsive."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
                <img src="https://ui-avatars.com/api/?name=Admin+Staff&background=0F172A&color=fff" alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">David Vance</h4>
                  <p className="text-[10px] text-slate-400">Chief Operations Admin</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
