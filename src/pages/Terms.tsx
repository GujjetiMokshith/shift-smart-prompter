
import React from "react";
import Header from "@/components/Header";
import { FileText, Users, Shield, AlertTriangle, Scale, Clock } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-800/20 rounded-full mb-6 glow-blue-sm">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">Terms of Service</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Please read these terms carefully before using PromptShift services.
            </p>
            <p className="text-sm text-white/50 mt-4">Last updated: January 25, 2025</p>
          </div>

          <div className="space-y-8">
            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
              </div>
              <div className="text-white/80 space-y-4">
                <p>
                  By accessing and using PromptShift ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Use License</h2>
              </div>
              <div className="text-white/80 space-y-4">
                <p>
                  Permission is granted to temporarily use PromptShift for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <div className="space-y-2 ml-4">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Modify or copy the materials</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Use the materials for commercial purpose or for any public display</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Attempt to reverse engineer any software contained on the website</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Remove any copyright or other proprietary notations from the materials</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">User Responsibilities</h2>
              </div>
              <div className="text-white/80 space-y-4">
                <p>As a user of PromptShift, you agree to:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Provide accurate and complete information when creating your account</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Maintain the security of your account credentials</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Use the service in compliance with all applicable laws</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Not engage in any activity that interferes with or disrupts the service</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Not attempt to gain unauthorized access to our systems or networks</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Service Availability</h2>
              </div>
              <div className="text-white/80 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Free Tier</h3>
                  <p>Free accounts are limited to 5 prompt enhancements per day. Service availability is not guaranteed.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pro & Enterprise</h3>
                  <p>Paid accounts receive priority access and unlimited prompt enhancements with 99.9% uptime SLA.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Maintenance</h3>
                  <p>We reserve the right to temporarily suspend the service for maintenance and updates.</p>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Payment and Billing</h2>
              </div>
              <div className="text-white/80 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Subscription Plans</h3>
                  <p>Pro and Enterprise plans are billed monthly or annually. All fees are non-refundable except as required by law.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Auto-Renewal</h3>
                  <p>Subscriptions automatically renew unless cancelled before the end of the current billing period.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Price Changes</h3>
                  <p>We reserve the right to modify subscription prices with 30 days advance notice.</p>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
              <div className="text-white/80 space-y-4">
                <p>
                  The materials on PromptShift are provided on an 'as is' basis. PromptShift makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p>
                  Further, PromptShift does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
              </div>
            </section>

            <section className="bolt-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Limitations</h2>
              <div className="text-white/80 space-y-4">
                <p>
                  In no event shall PromptShift or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PromptShift, even if PromptShift or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </div>
            </section>

            <section className="bolt-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Revisions and Errata</h2>
              <div className="text-white/80 space-y-4">
                <p>
                  The materials appearing on PromptShift could include technical, typographical, or photographic errors. PromptShift does not warrant that any of the materials on its website are accurate, complete, or current. PromptShift may make changes to the materials contained on its website at any time without notice. However, PromptShift does not make any commitment to update the materials.
                </p>
              </div>
            </section>

            <section className="bolt-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <div className="text-white/80">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> legal@promptshift.com</p>
                  <p><strong>Address:</strong> 123 AI Street, Tech Valley, CA 94025</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
