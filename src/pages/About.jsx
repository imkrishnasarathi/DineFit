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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center mb-8 backdrop-blur-sm bg-white/30 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              About Us
              <span className="text-white"> 🍽️</span>
            </h1>

            <p className="py-5 text-xs sm:text-xl text-gray-700 mb-4 items-start px-5">
              Welcome to <b>DineFit</b>– your smart kitchen companion for
              discovering meals that truly fit your lifestyle. At DineFit, we
              believe eating well shouldn’t be complicated. Our mission is to
              make healthy, enjoyable, and personalized cooking accessible to
              everyone. That’s why we’ve created a smart, user-friendly web
              application designed to recommend recipes that align with your
              unique diet preferences. <br />
              <br />
              Whether you’re vegan, keto, gluten-free, or simply looking for
              wholesome meals, DineFit helps you find cookable recipes tailored
              to your likes, dislikes, and dietary needs. By sourcing trusted
              recipes from reliable online databases, we ensure every suggestion
              is practical, delicious, and easy to prepare.
              <br />
              <br /> Not sure what to cook tonight? Let DineFit decide for you!
              With just a few clicks, we’ll inspire your next meal, taking the
              stress out of decision-making and turning your kitchen into a
              place of creativity and enjoyment. <br />
              <br />
              Join us on the journey to smarter cooking, healthier eating, and
              discovering food that fits you.
            </p>
            <div className="font-bold text-xs sm:text-xl">
              DineFit – Recipes that fit your life.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
