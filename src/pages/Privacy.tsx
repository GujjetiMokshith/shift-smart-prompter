
import React from "react";
import Header from "@/components/Header";
import { Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-800/20 rounded-full mb-6 glow-blue-sm">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">Privacy Policy</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-white/50 mt-4">Last updated: January 25, 2025</p>
          </div>

          <div className="space-y-8">
            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
                  <p>When you create an account, we collect your email address, name, and password (encrypted).</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Usage Data</h3>
                  <p>We collect information about how you use PromptShift, including prompts you enhance, models you select, and feature usage.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Technical Information</h3>
                  <p>We automatically collect device information, IP addresses, browser type, and usage analytics to improve our service.</p>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <div className="space-y-3 text-white/80">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p>Provide and improve our prompt enhancement services</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p>Manage your account and provide customer support</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p>Send important updates about our service</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p>Analyze usage patterns to improve functionality</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p>Ensure security and prevent unauthorized access</p>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Data Protection</h2>
              </div>
              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Encryption</h3>
                  <p>All data is encrypted in transit and at rest using industry-standard encryption protocols.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Access Controls</h3>
                  <p>We implement strict access controls and regularly audit who has access to your data.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Retention</h3>
                  <p>We retain your data only as long as necessary to provide our services or as required by law.</p>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Information Sharing</h2>
              </div>
              <div className="text-white/80 space-y-3">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                <div className="space-y-2 ml-4">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>With your explicit consent</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>To comply with legal obligations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>To protect our rights and safety</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p>With trusted service providers who help us operate our service</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Your Rights</h2>
              </div>
              <div className="space-y-3 text-white/80">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p><strong>Access:</strong> Request a copy of your personal data</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p><strong>Correction:</strong> Update or correct your information</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p><strong>Deletion:</strong> Request deletion of your account and data</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p><strong>Portability:</strong> Export your data in a machine-readable format</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <p><strong>Opt-out:</strong> Unsubscribe from marketing communications</p>
                </div>
              </div>
            </section>

            <section className="bolt-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <div className="text-white/80">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@promptshift.com</p>
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

export default Privacy;
