import { User, List, Clock, Database, Lock, Info } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-float-slow"></div>

          <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 transform rotate-45 animate-spin-slow opacity-10"></div>
          <div className="absolute bottom-32 left-16 w-6 h-16 bg-gradient-to-b from-cyan-400 to-blue-500 transform -skew-y-12 animate-sway opacity-15"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-8 backdrop-blur-sm bg-white/30 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                Privacy Policy
              </h1>

              <p className="py-5 text-xs sm:text-xl text-gray-700 mb-4 items-start px-5">
                At <strong>DineFit</strong>, your privacy and trust are
                important to us. This Privacy Policy explains how we collect,
                use, and protect your personal information when you use our
                website and services. By accessing or using DineFit, you agree
                to the terms outlined below.
                <br />
                <br />
              </p>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <User className="w-5 h-5 text-indigo-500" />
              Information We Collect
            </h2>
            <div className="pl-7 items-start">
              <p className="mb-2">
                We collect information that helps us personalize recipes and
                improve the service:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Personal Information:</strong> Name, age, email
                  address, and dietary preferences (likes/dislikes, allergies,
                  dietary restrictions).
                </li>
                <li>
                  <strong>Usage Information:</strong> Interactions with the app
                  (recipes viewed, saved, search queries) to personalize
                  recommendations.
                </li>
                <li>
                  <strong>Device & Technical Data:</strong> IP address, browser
                  type, and operating system collected automatically for
                  security and performance.
                </li>
              </ul>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <Database className="w-5 h-5 text-indigo-500" />
              How We Use Your Information
            </h2>
            <div className="pl-7">
              <p className="mb-2">We use data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  To personalize recipe recommendations based on your
                  preferences and dietary needs.
                </li>
                <li>
                  To operate, maintain, and improve our platform and user
                  experience.
                </li>
                <li>
                  To send transactional messages and support responses (account
                  updates, resets, replies).
                </li>
                <li>
                  To protect our service and comply with legal obligations
                  (fraud prevention, abuse handling).
                </li>
              </ul>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <Lock className="w-5 h-5 text-indigo-500" />
              Data Sharing & Third Parties
            </h2>
            <div className="pl-7">
              <p className="mb-2">
                We do not sell your personal information. We may share data only
                in these cases:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Trusted Service Providers:</strong> Vendors who help
                  run the site (hosting, analytics, recipe data providers). They
                  access data only to perform services for us and must follow
                  our instructions and appropriate safeguards.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to respond to lawful requests from public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets — we will notify users
                  and follow legal requirements.
                </li>
              </ul>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <Clock className="w-5 h-5 text-indigo-500" />
              Data Retention
            </h2>
            <div className="pl-7">
              <p>
                We retain personal information only as long as necessary to
                provide the service, comply with legal obligations, resolve
                disputes, and enforce our agreements. When data is no longer
                needed, we securely delete or anonymize it.
              </p>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <List className="w-5 h-5 text-indigo-500" />
              Your Rights & Choices
            </h2>
            <div className="pl-7">
              <p className="mb-2">
                Depending on your location, you may have rights regarding your
                personal data:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access and obtain a copy of the data we hold about you.</li>
                <li>
                  Request correction of inaccurate or incomplete information.
                </li>
                <li>
                  Request deletion of your personal data (subject to legal
                  exceptions).
                </li>
                <li>
                  Opt-out of marketing emails — links are included in every
                  promotional message.
                </li>
              </ul>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <Info className="w-5 h-5 text-indigo-500" />
              Data Security
            </h2>
            <div className="pl-7">
              <p>
                We implement reasonable technical and organizational measures to
                protect personal data. While we strive to protect your
                information, no method of transmission or storage is completely
                secure.
              </p>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-medium mt-4">
              <Clock className="w-5 h-5 text-indigo-500" />
              Changes to This Policy
            </h2>
            <div className="pl-7">
              <p>
                We may update this Privacy Policy periodically. Significant
                changes will be communicated where required by law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
