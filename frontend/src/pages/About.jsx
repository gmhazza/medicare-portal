import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Activity, Building2, CheckCircle2, ShieldCheck, HeartPulse, GraduationCap, ArrowRight, Stethoscope, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const doctorImages = [
  // 4 Male Doctors
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD0_nQSNjfe9_gTRP5YnNwyaLBK-tuhUd-ukI_GrDL1w&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsMueobxxhtTLPcipDSyNNQWi3TcYac0N8SVr1l9HyxA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMwQxnHe9ym8oigWf7ILv2jAO6E-cn28ZZDQzyoxyvOA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK6Cl7f_sjJnJRiW-qe-GtuziKhfKA1ng12bbchZiUEg&s=10',
  // 4 Female Doctors
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh1NCp8gkWufrf-rAc3eNTtZe0jc7a7Ca3D5EDhKZxuQ&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7dV0XrI72GErOcIy0HHYOin75ql6aiPuUcf7MHFrBgQ&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyOffV_WcnwwBfwLSPTzfnSXf5ejnCsXlphGJLRdkHWw&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHn9mWsgN1YGLASXNpEnKpmvQKg17JcEGtsmnAXpAGWw&s=10',
];

const gridItems = [
  { r: 1, c: 3, img: doctorImages[0] },
  { r: 1, c: 7, img: doctorImages[4] },
  { r: 2, c: 2, img: doctorImages[1] },
  { r: 2, c: 6, img: doctorImages[5] },
  { r: 3, c: 4, img: doctorImages[2] },
  { r: 4, c: 8, img: doctorImages[6] },
  { r: 5, c: 1, img: doctorImages[3] },
  { r: 6, c: 5, img: doctorImages[7] },
  { r: 7, c: 3, img: doctorImages[0] },
  { r: 8, c: 7, img: doctorImages[4] },
  { r: 9, c: 2, img: doctorImages[1] },
  { r: 10, c: 6, img: doctorImages[5] },
  { r: 11, c: 4, img: doctorImages[2] },
  { r: 12, c: 8, img: doctorImages[6] },
  { r: 13, c: 1, img: doctorImages[3] },
  { r: 14, c: 5, img: doctorImages[7] },
  { r: 15, c: 3, img: doctorImages[0] },
  { r: 16, c: 7, img: doctorImages[4] },
  { r: 18, c: 2, img: doctorImages[1] },
  { r: 20, c: 5, img: doctorImages[5] },
];

const About = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Staggered layout entrance on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from('.about-hero-title', { opacity: 0, y: -30, duration: 0.8 })
      .from('.about-hero-text', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.about-hero-stats', { opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.3');

    // Scroll trigger animation for sections
    gsap.from('.about-section-card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.25,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-sections-grid',
        start: 'top 80%',
      }
    });

    // Stats counter ticks
    gsap.from('.stat-count', {
      innerText: 0,
      duration: 2.0,
      snap: { innerText: 1 },
      ease: 'power1.out',
    });

    // Specialized Doctors Grid Scroll Animation
    const docElems = document.querySelectorAll('.doctor-scroll-elem');
    const isMobile = window.innerWidth < 768;
    const maxShift = isMobile ? 35 : 100;

    docElems.forEach((elem) => {
      const image = elem.querySelector('img');
      if (!image) return;

      const xTransform = gsap.utils.random(-maxShift, maxShift);

      gsap.set(image, {
        transformOrigin: `${xTransform < 0 ? '0%' : '100%'} 50%`,
      });

      gsap.to(image, {
        scale: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(image, {
        xPercent: xTransform,
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14 sm:space-y-20 w-full max-w-[100vw] overflow-x-clip">
      
      {/* 1. Hero / Vision Banner */}
      <div className="relative rounded-3xl bg-black text-white overflow-hidden p-6 sm:p-16 text-left border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5" />
            Healthcare Innovation
          </span>
          <h1 className="about-hero-title text-3xl sm:text-5xl font-black font-heading leading-tight tracking-tight text-white">
            Redefining Medical Diagnostics & Clinical Checkups
          </h1>
          <p className="about-hero-text text-xs sm:text-base text-teal-100/90 leading-relaxed font-body">
            MediCare Portal is a pioneering telemedicine and healthcare scheduling ecosystem. 
            Initially designed to support the student and faculty demographic at Ibadat International University, Islamabad, 
            the system has expanded into an enterprise-grade digital health solution offering 24/7 AI diagnosis, 
            live consultation desk booking, and secure, encrypted electronic health records (EHR).
          </p>
        </div>

        {/* Dynamic Metric Ticks */}
        <div className="about-hero-stats grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-teal-900 mt-8 sm:mt-12 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">12000</span>+
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">Registered Patients</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">65</span>+
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">Specialist Doctors</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">100</span>%
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">Safe Data Auditing</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-heading">
              <span className="stat-count">24</span>/7
            </h3>
            <p className="text-xs text-teal-200 uppercase tracking-widest font-semibold">AI Support Access</p>
          </div>
        </div>
      </div>

      {/* 2. Core Pillars / Highlights */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 font-heading">Why Choose MediCare?</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-body">
            Combining academic excellence, advanced automation, and human-centric healthcare pillars.
          </p>
        </div>

        <div className="about-sections-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Sihala Campus Connection */}
          <div className="about-section-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">Sihala Islamabad Campus</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Located within the main campus of Ibadat International University, Islamabad, our state-of-the-art physical dispensary 
              and clinical division provides immediate emergency support and hands-on laboratory checkups.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-650 pt-2 border-t border-slate-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Japan Road, Sihala location</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Direct student/staff integration</span>
              </li>
            </ul>
          </div>

          {/* Card 2: AI Tech Integration */}
          <div className="about-section-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">AI-Powered Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Our advanced AI chat engine uses the Google Gemini large language model to help patients check medical symptoms, 
              provide healthy lifestyle guides, and route severe alerts directly to specialist doctors.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-650 pt-2 border-t border-slate-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Immediate response panels</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Pre-clinical consultation checks</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Research Driven Excellence */}
          <div className="about-section-card bg-white rounded-3xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-shadow text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">HIPAA-Compliant EHR</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              All consultation scheduling details, prescriptions, diagnostics reports, and credentials are encrypted using 
              best practices. Patient confidentiality and dashboard session logs are rigorously audited.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-650 pt-2 border-t border-slate-50">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Protected data stores</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Authenticated doctor reviews</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Academic Affiliation & Facilities Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left py-4">
        <div className="slide-in-left lg:col-span-6 section-header-anim space-y-6">
          <h2 className="text-3xl font-black text-teal-950 font-heading leading-tight">
            Ibadat International University Affiliated Healthcare
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-body">
            Through our association with Ibadat International University, Islamabad, we serve as the principal digital 
            medical platform for students, faculty, and administrative staff. Our clinic hosts top-tier general practitioners, 
            cardiologists, dermatologists, and orthopedists.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <Award className="w-5 h-5 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">HEC Recognized Standards</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">On-Campus Dispatch Desk</span>
            </div>
          </div>
        </div>

        <div className="slide-in-right lg:col-span-6 relative">
          <div className="fade-up-anim bg-black text-white rounded-3xl border border-slate-800 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
            <div className="space-y-3">
              <h4 className="text-teal-400 font-bold uppercase tracking-widest text-xs">Administrative Services</h4>
              <h3 className="text-xl sm:text-2xl font-black font-heading leading-snug">Hospital Dispatch Desk Sihala</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-body">
                Our main campus dispatch coordinates medical transports, clinical queues, prescription refills, 
                and references for local hospital structures in Islamabad.
              </p>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Direct Hotline: +92 (51) 844-6666</span>
                <span className="text-teal-400 font-bold uppercase">Open Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Specialized Doctors Showcase — Heading on Top (Black Color, No Eyebrow) + Free Floating Scroll Grid */}
      <div className="space-y-8 pt-6">
        {/* Heading on Top in Black */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-black uppercase leading-tight">
            OUR SPECIALIZED DOCTORS
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-body">
            Distinguished medical practitioners across Cardiology, Dermatology, Orthopedics, and Advanced Diagnostics.
          </p>
        </div>

        {/* 8-Column Grid spanning 20 rows — Floating Doctor Images with Scroll Animation */}
        <div className="w-full relative py-4 overflow-x-clip">
          <div 
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 xs:gap-3 sm:gap-6 p-2 relative z-0"
            style={{
              gridTemplateRows: 'repeat(20, min(32vh, 220px))',
            }}
          >
            {gridItems.map((item, idx) => {
              // Dynamically wrap columns on smaller viewports
              const colSpanClass = "";
              return (
                <div
                  key={idx}
                  className={`doctor-scroll-elem col-span-1 row-span-1 w-full h-full min-h-[110px] sm:min-h-[160px] ${colSpanClass}`}
                  style={{
                    gridRow: item.r,
                    gridColumn: `var(--col-${item.c}, ${item.c > 4 ? ((item.c - 1) % 4) + 1 : item.c})`,
                  }}
                >
                  <img
                    src={item.img}
                    alt="Specialist Doctor"
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl will-change-transform pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;



