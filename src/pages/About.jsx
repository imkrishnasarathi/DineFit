export default function About() {
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

        <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F9F6] via-white to-[#E8F9F6] py-16 sm:py-20">
          {/* Decorative background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-10 backdrop-blur-sm bg-white/40 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 transition hover:shadow-emerald-100/60 hover:scale-[1.01] duration-300">

              {/* Left: Text */}
              <div className="w-full lg:w-1/2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 text-center lg:text-left">
                  About Us <span className="text-white">🍽️</span>
                </h1>

                <div className="mx-auto max-w-xl text-gray-700 text-sm sm:text-lg leading-relaxed text-left space-y-5">
                  <p>
                    Welcome to <b>DineFit</b> – your smart kitchen companion for discovering meals that truly fit your lifestyle. At DineFit, we believe eating well shouldn’t be complicated. Our mission is to make healthy, enjoyable, and personalized cooking accessible to everyone.
                  </p>
                  <p>
                    Whether you’re vegan, keto, gluten-free, or simply looking for wholesome meals, DineFit helps you find cookable recipes tailored to your dietary needs.
                  </p>
                  <p>
                    Not sure what to cook tonight? Let DineFit decide for you! We’ll inspire your next meal and turn your kitchen into a place of creativity and enjoyment.
                  </p>
                  <p>
                    Join us on the journey to smarter cooking, healthier eating, and discovering food that fits you.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-center lg:justify-start">
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                </div>

                <div className="font-bold text-sm sm:text-xl mt-4 text-emerald-700 text-center lg:text-left">
                  DineFit – Recipes that fit your life.
                </div>
              </div>

              {/* Right: Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
                  alt="Healthy food illustration"
                  className="rounded-2xl shadow-lg w-full max-w-md object-cover"
                />
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
