'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

type FormStep = 1 | 2 | 3;

interface FormData {
  phone: string;
  name: string;
  email: string;
}

export default function ContactForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    name: '',
    email: '',
  });

  const saveToGoogleSheets = async (data: Partial<FormData>) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...data,
          timestamp: new Date().toISOString(),
          step,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      return true;
    } catch (err) {
      console.error('Error saving to Google Sheets:', err);
      throw err;
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate phone number
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      await saveToGoogleSheets({ phone: formData.phone });
      setStep(2);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (formData.name.trim().length < 2) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }

      await saveToGoogleSheets({ name: formData.name, email: formData.email });
      setStep(3);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ phone: '', name: '', email: '' });
    setError('');
  };

  return (
    <div className="card border">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${s <= step
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500'
                }`}
            >
              {s < step ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${s < step ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Phone Number */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Let&apos;s Get Started
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your phone number and we&apos;ll get back to you shortly.
            </p>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !formData.phone}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2: Name and Email */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Almost There!
            </h3>
            <p className="text-gray-600 mb-6">
              Please provide your name and email address.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Thank You!
          </h3>
          <p className="text-gray-600 mb-8">
            We&apos;ve received your information and will get back to you within 24 hours.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h4 className="font-semibold text-gray-900 mb-3">Your Details:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              <p><span className="font-medium">Name:</span> {formData.name}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="btn-secondary"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
}
