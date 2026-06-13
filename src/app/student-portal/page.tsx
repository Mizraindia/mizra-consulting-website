'use client';

import { useState } from 'react';

export default function StudentPortalPage() {

  const [demoSuccess, setDemoSuccess] = useState(false);
const [enrollSuccess, setEnrollSuccess] = useState(false);

const GOOGLE_SCRIPT_URL =
'https://script.google.com/macros/s/AKfycbxHELE4yy3Wasq8KmWV-VTWk1O8bNQtEZBZXZcz7b2fLkmvvAME_mg3jMklFFCtUccx/exec';

const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const payload = {
    formType: 'demo',
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    college: formData.get('college'),
    passingYear: formData.get('passingYear'),
  };
 
  await fetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});
  

  setDemoSuccess(true);
  // e.currentTarget.reset();
};

const handleEnrollmentSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const payload = {
    formType: 'enrollment',
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    college: formData.get('college'),
    passingYear: formData.get('passingYear'),
    course: formData.get('course'),
    targetRole: formData.get('targetRole'),
    linkedin: formData.get('linkedin'),
  };

  await fetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

 window.open(
   'https://rzp.io/rzp/WGSNPrpM',
   '_blank'
 );
  
  setEnrollSuccess(true);
  // e.currentTarget.reset();
};
  return (
    <main className="min-h-screen pt-20">

      <section className="py-20 bg-orange-50">
  <div className="container-custom max-w-3xl">

     {!demoSuccess ? (
  <>
    <div className="text-center mb-10">
      <h2 className="text-4xl font-bold">
        Book a Free Demo Call
      </h2>

      <p className="mt-4 text-gray-600">
        Speak with our team and understand how the program can help you become placement-ready.
      </p>
    </div>
    
       <form
        className="space-y-6"
        onSubmit={handleDemoSubmit}
       >

      <input
        name="name"
        type="text"
        placeholder="Full Name"
        className="w-full p-4 border rounded-lg"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="w-full p-4 border rounded-lg"
        required
      />
      
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
       />
      <input
        name="college"
        type="text"
        placeholder="College Name"
        className="w-full p-4 border rounded-lg"
      />

      <input
        name="passingYear"
        type="text"
        placeholder="Passing Year"
        className="w-full p-4 border rounded-lg"
      />

      <button
        type="submit"
        className="btn-primary w-full"
      >
        Book My Demo Call
      </button>
    </form>
    </>

    ) : (
  <div className="text-center py-10">
    <h3 className="text-3xl font-bold">
      Demo Call Booked!
    </h3>

    <p className="mt-4 text-gray-600">
      Thank you for your interest.
      Our team will contact you shortly.
    </p>
  </div>
)}

    {/* {demoSuccess && (
  <p className="text-green-600 text-center">
    Thank you! Your demo call request has been received.
  </p>
)} */}

  </div>
</section>

      <section className="bg-gradient-to-b from-orange-50 to-white py-24">
        <div className="container-custom">

          <div className="max-w-4xl mx-auto text-center">

            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-primary-500 font-medium mb-6">
              Mizra Student Program
            </span>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Become Corporate Ready
              <span className="block text-primary-500">
                From Day One
              </span>
            </h1>

            <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Build. Refine. Excel. Master the resumes, LinkedIn strategies,
              and interview tactics that top recruiters actually look for.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

              <button
                onClick={() =>
               document
                .getElementById('enrollment')
                ?.scrollIntoView({ behavior: 'smooth' })
                }
                 className="btn-primary px-8 py-4 text-lg"
                 >
                 Enroll Now – ₹2,000
              </button>

              <button
                onClick={() =>
                  document
                  .getElementById('learn-more')
                  ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="border border-primary-500 text-primary-500 px-8 py-4 rounded-lg font-medium hover:bg-orange-50 transition"
                  >
                  Learn More
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Program Highlights Section */}
<section id="learn-more" className="py-20 bg-white">
  <div className="container-custom">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900">
        Your Toolkit for Success
      </h2>

      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Designed to help students stand out, get shortlisted, and perform confidently during placements.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
          📄
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">
          Profile Engineering
        </h3>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Build AI-optimized resumes and LinkedIn profiles designed to attract recruiters and improve visibility.
        </p>
      </div>

      {/* Card 2 */}
      <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
          🎤
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">
          Interview Conditioning
        </h3>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Practice through realistic mock interviews covering technical rounds and HR evaluations.
        </p>
      </div>

      {/* Card 3 */}
      <div className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
          🎯
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">
          Application Strategy
        </h3>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Learn how to target the right opportunities and create a focused placement strategy.
        </p>
      </div>

    </div>

  </div>
</section>

<section className="py-20 bg-gray-50">
  <div className="container-custom">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900">
        Why Choose Mizra?
      </h2>

      <p className="mt-4 text-lg text-gray-600">
        Designed to help students transition confidently into the corporate world.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h3 className="text-2xl font-semibold mb-4">
          Industry-Focused Training
        </h3>
        <p className="text-gray-600">
          Learn the skills and strategies recruiters actually look for during placements.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h3 className="text-2xl font-semibold mb-4">
          Mock Interview Practice
        </h3>
        <p className="text-gray-600">
          Gain confidence through guided interview simulations and feedback sessions.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h3 className="text-2xl font-semibold mb-4">
          Affordable & Practical
        </h3>
        <p className="text-gray-600">
          Career readiness training designed specifically for students at an accessible cost.
        </p>
      </div>

    </div>
  </div>
</section>


<section className="py-20">
  <div className="container-custom">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900">
        What Is  In Here
      </h2>
    </div>

    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

      <div className="p-5 border rounded-xl">
        ✓ Resume Optimization
      </div>

      <div className="p-5 border rounded-xl">
        ✓ LinkedIn Profile Review
      </div>

      <div className="p-5 border rounded-xl">
        ✓ Mock HR Interviews
      </div>

      <div className="p-5 border rounded-xl">
        ✓ Mock Technical Interviews
      </div>

      <div className="p-5 border rounded-xl">
        ✓ Placement Strategy Sessions
      </div>

      <div className="p-5 border rounded-xl">
        ✓ Career Guidance Resources
      </div>

    </div>
  </div>
</section>


{/* Enrollment Section */}
<section id="enrollment" className="py-20 bg-gray-50">
  <div className="container-custom max-w-3xl">

    <div className="text-center mb-10">
      <h2 className="text-4xl font-bold text-gray-900">
        Ready to Enroll?
      </h2>

      <p className="mt-4 text-lg text-gray-600">
        Take the next step towards becoming corporate-ready and placement confident.
      </p>
    </div>

    <form className="space-y-5"
    onSubmit={handleEnrollmentSubmit}
    >

      <input
        name="name"
        type="text"
        placeholder="Full Name"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
        
      />


      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required

      />

      <input
        name="college"
        type="text"
        placeholder="College Name"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required

      />

      <input
        name="passingYear"
        type="text"
        placeholder="Passing Year"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required

      />

      <input
        name="course"
        type="text"
        placeholder="Current Course / Degree"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required

      />

      <input
        name="targetRole"
        type="text"
        placeholder="Target Job Role"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        required

      />

      <input
        name="linkedin"
        type="url"
        placeholder="LinkedIn Profile (Optional)"
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        

      />

      <button
        type="submit"
        className="btn-primary w-full py-4"
      >
        Enroll Now – ₹2,000
      </button>

      {enrollSuccess && (
  <p className="text-green-600 text-center">
    Thank you! Your enrollment request has been received.
  </p>
)}

    </form>

  </div>
</section>


{/* FAQ Section */}
<section className="py-20">
  <div className="container-custom max-w-4xl">

    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900">
        Frequently Asked Questions
      </h2>
    </div>

    <div className="space-y-6">

      <div className="border rounded-xl p-6">
        <h3 className="font-semibold text-xl mb-2">
          Who is this program for?
        </h3>
        <p className="text-gray-600">
          Students, fresh graduates, and placement aspirants looking to improve their employability.
        </p>
      </div>

      <div className="border rounded-xl p-6">
        <h3 className="font-semibold text-xl mb-2">
          Do I need prior work experience?
        </h3>
        <p className="text-gray-600">
          No. The program is specifically designed for students and freshers.
        </p>
      </div>

      <div className="border rounded-xl p-6">
        <h3 className="font-semibold text-xl mb-2">
          Will I get mock interview practice?
        </h3>
        <p className="text-gray-600">
          Yes. The program includes mock interview preparation and guided feedback.
        </p>
      </div>

      <div className="border rounded-xl p-6">
        <h3 className="font-semibold text-xl mb-2">
          Is LinkedIn optimization included?
        </h3>
        <p className="text-gray-600">
          Yes. LinkedIn profile engineering is included in the program.
        </p>
      </div>

      <div className="border rounded-xl p-6">
        <h3 className="font-semibold text-xl mb-2">
          How will sessions be conducted?
        </h3>
        <p className="text-gray-600">
          Sessions will be conducted online through scheduled live interactions.
        </p>
      </div>

    </div>

  </div>
</section>

{/* Final CTA */}
<section className="py-20 bg-primary-500 text-white">
  <div className="container-custom text-center">

    <h2 className="text-4xl font-bold">
      Start Your Career Journey Today
    </h2>

    <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
      Join the Corporate Readiness Program and build the skills recruiters are looking for.
    </p>

    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

      <button className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold">
        Enroll Now
      </button>

      <button className="border border-white px-8 py-4 rounded-lg font-semibold">
        Book Demo Call
      </button>

    </div>

  </div>
</section>

    </main>
  );
}