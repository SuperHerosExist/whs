import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Mail, Phone, MapPin, Send, CheckCircle, Home } from "lucide-react";
import { branding } from "@/config/branding";
import type { ContactSubmission, JoinTeamForm } from "@/types";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<JoinTeamForm>({
    name: "",
    email: "",
    phone: "",
    grade: "",
    experience: "none",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const submission: Omit<ContactSubmission, "id"> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Join Team Inquiry - Grade ${formData.grade}`,
        message: `Experience Level: ${formData.experience}\n\n${formData.message}`,
        type: "join-team",
        status: "new",
        submittedAt: new Date(),
      };

      await addDoc(collection(db, "contactSubmissions"), {
        ...submission,
        submittedAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        grade: "",
        experience: "none",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        "Failed to submit form. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-willard-grey-50 via-willard-white to-willard-grey-100 text-willard-black">
      {/* 🏆 HEADER */}
      <section className="relative bg-black text-white overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-90" />
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-8 sm:px-12 text-center">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            Join the Willard Tigers
          </h1>
          <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide shadow-[0_0_12px_rgba(255,215,0,0.5)] mb-4">
            Contact & Recruitment
          </div>
          <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto opacity-90">
            Ready to roll with the team? Reach out and start your journey.
          </p>
        </div>
      </section>

      {/* 🧾 MAIN CONTENT */}
      <div className="max-w-[90rem] mx-auto px-8 sm:px-12 py-20 md:py-24 grid md:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* LEFT - INFO */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-willard-grey-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-lg text-willard-grey-700 mb-8 leading-relaxed">
            Whether you’re a prospective player, parent, or just want to learn
            more about our program, we’d love to hear from you.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-willard-black to-yellow-500 flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-willard-grey-900 mb-1">
                  Location
                </h3>
                <p className="text-willard-grey-700">
                  {branding.school.address}
                </p>
              </div>
            </div>

            {branding.contact.coach.phone && (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-willard-black to-yellow-500 flex items-center justify-center shadow-md">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-willard-grey-900 mb-1">Phone</h3>
                  <a
                    href={`tel:${branding.contact.coach.phone}`}
                    className="text-willard-grey-700 hover:text-yellow-600 transition-colors"
                  >
                    {branding.contact.coach.phone}
                  </a>
                </div>
              </div>
            )}

            {branding.contact.coach.email && (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-willard-black to-yellow-500 flex items-center justify-center shadow-md">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-willard-grey-900 mb-1">Email</h3>
                  <a
                    href={`mailto:${branding.contact.coach.email}`}
                    className="text-willard-grey-700 hover:text-yellow-600 transition-colors"
                  >
                    {branding.contact.coach.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-br from-willard-grey-100 to-willard-grey-50 rounded-xl shadow-inner">
            <h3 className="font-bold text-willard-grey-900 mb-4">
              Practice Schedule
            </h3>
            <p className="text-willard-grey-700 mb-1">
              <strong>Monday:</strong> 3:30 PM - 5:30 PM
            </p>
            <p className="text-willard-grey-700 mb-1">
              <strong>Wednesday:</strong> 3:30 PM - 5:30 PM
            </p>
            <p className="text-sm text-willard-grey-500 mt-3">
              All skill levels welcome. Equipment available for beginners.
            </p>
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-willard-grey-200">
          {submitted ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-black text-willard-grey-900 mb-2">
                Thank You!
              </h3>
              <p className="text-willard-grey-700 mb-6">
                We’ve received your inquiry and will get back to you soon.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition-all"
                >
                  Submit Another Inquiry
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-6 py-3 bg-willard-grey-900 text-white font-semibold rounded-full hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" /> Back to Home
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-willard-grey-900 mb-6">
                Join the Team
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { id: "name", label: "Full Name *", type: "text" },
                  { id: "email", label: "Email Address *", type: "email" },
                  { id: "phone", label: "Phone Number", type: "tel" },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-bold text-willard-grey-800 mb-2"
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={(formData as any)[field.id]}
                      onChange={handleChange}
                      required={field.label.includes("*")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-willard-black placeholder-gray-400"
                      placeholder={`Enter your ${field.id}`}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-sm font-bold text-willard-grey-800 mb-2"
                    >
                      Current Grade *
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-willard-black"
                    >
                      <option value="">Select grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-bold text-willard-grey-800 mb-2"
                    >
                      Bowling Experience *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition text-willard-black"
                    >
                      <option value="none">No Experience</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-willard-grey-800 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition resize-none text-willard-black placeholder-gray-400"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-4 rounded-full font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,215,0,0.4)]"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
