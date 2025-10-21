import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { branding } from '@/config/branding';
import type { ContactSubmission, JoinTeamForm } from '@/types';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<JoinTeamForm>({
    name: '',
    email: '',
    phone: '',
    grade: '',
    experience: 'none',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create contact submission in Firestore
      const submission: Omit<ContactSubmission, 'id'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Join Team Inquiry - Grade ${formData.grade}`,
        message: `Experience Level: ${formData.experience}\n\n${formData.message}`,
        type: 'join-team',
        status: 'new',
        submittedAt: new Date(),
      };

      await addDoc(collection(db, 'contactSubmissions'), {
        ...submission,
        submittedAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        grade: '',
        experience: 'none',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiger-neutral-50 to-white">
      {/* Page Header */}
      <section className="bg-tiger-primary-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-tiger-neutral-300">
            Interested in joining the team? Get in touch!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-display font-black text-tiger-primary-black mb-6">
              Get In Touch
            </h2>
            <p className="text-lg text-tiger-neutral-700 mb-8">
              Whether you're a prospective player, parent, or just want to learn more about our program,
              we'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-tiger-primary-black mb-1">Location</h3>
                  <p className="text-tiger-neutral-700">{branding.school.address}</p>
                </div>
              </div>

              {branding.contact.coach.phone && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-tiger-primary-black mb-1">Phone</h3>
                    <a
                      href={`tel:${branding.contact.coach.phone}`}
                      className="text-tiger-neutral-700 hover:text-tiger-tiger-darkRed transition-colors"
                    >
                      {branding.contact.coach.phone}
                    </a>
                  </div>
                </div>
              )}

              {branding.contact.coach.email && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-tiger-primary-black mb-1">Email</h3>
                    <a
                      href={`mailto:${branding.contact.coach.email}`}
                      className="text-tiger-neutral-700 hover:text-tiger-tiger-darkRed transition-colors"
                    >
                      {branding.contact.coach.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Program Info */}
            <div className="mt-12 p-6 bg-gradient-to-br from-tiger-neutral-100 to-tiger-neutral-50 rounded-xl">
              <h3 className="font-display font-bold text-tiger-primary-black mb-4">
                Practice Schedule
              </h3>
              <div className="space-y-2 text-tiger-neutral-700">
                <p><strong>Monday:</strong> 3:30 PM - 5:30 PM</p>
                <p><strong>Wednesday:</strong> 3:30 PM - 5:30 PM</p>
                <p className="text-sm text-tiger-neutral-600 mt-4">
                  All skill levels welcome. Equipment available for beginners.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-tiger-lg p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-tiger-primary-black mb-2">
                    Thank You!
                  </h3>
                  <p className="text-tiger-neutral-700 mb-6">
                    We've received your inquiry and will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-tiger-primary-black text-white font-semibold rounded-lg hover:bg-tiger-neutral-800 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-black text-tiger-primary-black mb-6">
                    Join the Team
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                        placeholder="(417) 555-0123"
                      />
                    </div>

                    <div>
                      <label htmlFor="grade" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                        Current Grade *
                      </label>
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                      >
                        <option value="">Select grade</option>
                        <option value="9">9th Grade</option>
                        <option value="10">10th Grade</option>
                        <option value="11">11th Grade</option>
                        <option value="12">12th Grade</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                        Bowling Experience *
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
                      >
                        <option value="none">No Experience</option>
                        <option value="beginner">Beginner (Just for fun)</option>
                        <option value="intermediate">Intermediate (Bowl occasionally)</option>
                        <option value="advanced">Advanced (League or tournament experience)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-tiger-neutral-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition resize-none"
                        placeholder="Tell us about yourself or ask any questions..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-tiger-primary-black text-white py-4 rounded-lg font-bold hover:bg-tiger-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Inquiry
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
