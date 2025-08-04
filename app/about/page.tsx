export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About LightPro Solutions</h1>
        <div className="prose prose-lg mx-auto">
          <p className="text-xl text-gray-600 mb-8 text-center">
            Leading the entertainment industry with professional stage lighting solutions since 1995.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 1995, LightPro Solutions has been at the forefront of the professional lighting industry for
                over 25 years. What started as a small family business has grown into one of the most trusted names in
                stage lighting equipment.
              </p>
              <p className="text-gray-700">
                We specialize in importing and distributing high-quality lighting equipment from the world's leading
                manufacturers, ensuring our customers have access to the latest technology and innovations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                To provide the entertainment industry with reliable, innovative, and cost-effective lighting solutions
                that enhance every performance and event.
              </p>
              <p className="text-gray-700">
                We believe that great lighting can transform any space and create unforgettable experiences. That's why
                we're committed to offering only the highest quality products backed by exceptional service.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">25+ Years Experience</h3>
                <p className="text-gray-600">Decades of industry expertise and knowledge</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">500+ Happy Clients</h3>
                <p className="text-gray-600">Trusted by theaters, venues, and production companies</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock technical assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
