import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { Calendar, Clock, AlertCircle, FileText, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const appointmentSchema = z.object({
  service: z.string().min(1, { message: 'Please select a medical service.' }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(), {
    message: 'Please select a valid future date.',
  }),
  note: z.string().max(500, { message: 'Notes must not exceed 500 characters.' }).optional(),
});

const maleDoctorImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD0_nQSNjfe9_gTRP5YnNwyaLBK-tuhUd-ukI_GrDL1w&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsMueobxxhtTLPcipDSyNNQWi3TcYac0N8SVr1l9HyxA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMwQxnHe9ym8oigWf7ILv2jAO6E-cn28ZZDQzyoxyvOA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK6Cl7f_sjJnJRiW-qe-GtuziKhfKA1ng12bbchZiUEg&s=10'
];

const femaleDoctorImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh1NCp8gkWufrf-rAc3eNTtZe0jc7a7Ca3D5EDhKZxuQ&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7dV0XrI72GErOcIy0HHYOin75ql6aiPuUcf7MHFrBgQ&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyOffV_WcnwwBfwLSPTzfnSXf5ejnCsXlphGJLRdkHWw&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHn9mWsgN1YGLASXNpEnKpmvQKg17JcEGtsmnAXpAGWw&s=10'
];

const getDoctorAvatar = (doc) => {
  const name = typeof doc === 'string' ? doc : (doc?.name || '');
  const gender = typeof doc === 'object' ? doc?.gender : '';

  if (name.includes('Sara Khan')) return femaleDoctorImages[0];
  if (name.includes('Ayesha Bilal')) return femaleDoctorImages[1];
  if (name.includes('Nida Yasir')) return femaleDoctorImages[2];
  if (name.includes('Zainab Raza')) return femaleDoctorImages[3];

  const isFemale = gender === 'female' || ['sara', 'ayesha', 'nida', 'zainab', 'sarah', 'aisha', 'elena'].some(f => name.toLowerCase().includes(f));
  
  if (doc?.avatar && !doc.avatar.includes('R0k6mJECkDvvxLWpl2C6oVOgbs49inNcoZtvJRFileqS3TAkNr3qOH87dG') && !doc.avatar.includes('ui-avatars')) {
    if (!isFemale && femaleDoctorImages.includes(doc.avatar)) return maleDoctorImages[0];
    if (isFemale && maleDoctorImages.includes(doc.avatar)) return femaleDoctorImages[0];
    return doc.avatar;
  }
  
  const pool = isFemale ? femaleDoctorImages : maleDoctorImages;
  const hash = Math.abs((name || 'Dr').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  return pool[hash % pool.length];
};

const BookAppointment = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [successAppt, setSuccessAppt] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(appointmentSchema),
  });

  const selectedServiceId = watch('service');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const list = await api.getAvailableServices();
        setServices(list.filter(s => s.available));
      } catch (e) {
        console.error("Failed to load services:", e);
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSuccessAppt(null);
    try {
      // 1. Book appointment (which calls real backend database POST create/appointment endpoint)
      const res = await api.createAppointment(data.service, data.date, data.note);
      
      // 2. Fetch the real assigned doctor from the backend using the doctor ID
      const selectedService = services.find(s => s._id === data.service);
      let doctorName = 'Dr. Assigned Consultant';
      let doctorAvatar = null;

      const backendDoctorId = res._backendDoctorId || res.doctor;
      if (backendDoctorId) {
        try {
          const realDoctor = await api.getDoctorById(backendDoctorId);
          if (realDoctor) {
            doctorName = realDoctor.name || doctorName;
            doctorAvatar = getDoctorAvatar(realDoctor);
          }
        } catch (fetchErr) {
          console.warn('Could not fetch assigned doctor details:', fetchErr);
        }
      }

      if (!doctorAvatar) {
        doctorAvatar = getDoctorAvatar(doctorName);
      }
      
      setSuccessAppt({
        date: data.date,
        service: selectedService?.service_name || 'Medical Care',
        doctor: doctorName,
        avatar: doctorAvatar,
      });

      showNotification(`Appoinment for ${selectedService?.service_name || 'Medical Care'} Booked sucessfully`);
    } catch (err) {
      setSubmitError(err.message || 'Unable to book appointment. Ensure a doctor is available on the chosen date.');
    }
  };

  // Redirect to Auth if not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-6 bg-black text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-800/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-950/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white font-heading animate-pulse">Consultation Booking</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Please log in to your patient account to schedule an appointment with our specialist doctors.
        </p>
        <div className="pt-2">
          <Link
            to="/auth"
            className="inline-block px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Access Sign In / Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header — Centered */}
      <div className="booking-header text-center space-y-3 pb-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-teal-950 font-heading">
          Book a Consultation
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Select a medical service. Our booking algorithm automatically schedules you with an available physician.
        </p>
      </div>

      {successAppt ? (
        /* SUCCESS SCREEN */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-xl text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 font-heading">Consultation Confirmed!</h2>
            <p className="text-slate-500 text-sm">Your medical entry is saved in the database tables.</p>
          </div>

          {/* Assigned Doctor details */}
          <div className="bg-slate-50 rounded-2xl p-6 max-w-md mx-auto border border-slate-100 flex items-center gap-4 text-left">
            <img
              src={successAppt.avatar || getDoctorAvatar(successAppt.doctor)}
              alt={successAppt.doctor}
              className="w-14 h-14 rounded-full border border-teal-800/20 object-cover shrink-0 shadow-xs"
            />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assigned Specialist</p>
              <h4 className="text-base font-extrabold text-slate-800">{successAppt.doctor}</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="font-semibold text-teal-800 capitalize">{successAppt.service}</span>
                <span>•</span>
                <span>Date: {new Date(successAppt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/dashboard/patient"
              className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-md text-sm transition-colors cursor-pointer"
            >
              Go To Dashboard
            </Link>
            <button
              onClick={() => setSuccessAppt(null)}
              className="px-6 py-3 bg-white border border-teal-850/20 text-teal-850 hover:bg-teal-50 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Book Another
            </button>
          </div>
        </div>
      ) : (
        /* BOOKING FORM — Centered & Full Width */
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="booking-form w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xl space-y-6 text-left">
            
            {/* Error message */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="font-bold">Failed to Book Appointment</p>
                  <p className="mt-0.5 text-rose-600 leading-normal">{submitError}</p>
                </div>
              </div>
            )}

            {/* Step 1: Select Service */}
            <div className="form-step space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-850" />
                1. Select Service / Specialty
              </label>
              <select
                {...register('service')}
                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer ${
                  errors.service ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              >
                <option value="">Choose Service...</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.service_name} ({(s.pillar || 'general').toUpperCase()})
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.service.message}
                </p>
              )}
            </div>

            {/* Step 2: Date Selector */}
            <div className="form-step space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-850" />
                2. Select Date
              </label>
              <input
                type="date"
                {...register('date')}
                className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700 cursor-pointer ${
                  errors.date ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.date && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Step 3: Medical Notes */}
            <div className="form-step space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-850" />
                3. Symptoms / Notes (Optional)
              </label>
              <textarea
                rows="4"
                placeholder="Please describe symptoms, prior treatments, or special requests..."
                {...register('note')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-teal-700"
              />
              {errors.note && (
                <p className="text-rose-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.note.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-step pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-850 hover:bg-teal-900 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isSubmitting ? 'Booking Consultation...' : 'Confirm Appointment Request'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default BookAppointment;
