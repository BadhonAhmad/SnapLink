import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  const stats = [
    { label: "Active Users", value: "50K+", color: "text-blue-600" },
    { label: "URLs Shortened", value: "2M+", color: "text-green-600" },
    { label: "Links Clicked", value: "10M+", color: "text-purple-600" },
    { label: "Countries", value: "150+", color: "text-orange-600" },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Create short links instantly with our optimized infrastructure.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Track clicks, monitor performance, and gain insights on your links.",
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee.",
    },
    {
      icon: "🎨",
      title: "Custom Short URLs",
      description: "Create memorable branded links that represent your brand.",
    },
    {
      icon: "🌐",
      title: "Global CDN",
      description: "Fast redirects worldwide with our distributed network.",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access and manage your links from any device, anywhere.",
    },
  ];

  const benefits = [
    {
      title: "Boost Your Brand",
      description:
        "Create memorable short links that reinforce your brand identity and increase click-through rates.",
    },
    {
      title: "Track Performance",
      description:
        "Get detailed analytics on link clicks, geographic data, and user engagement to optimize your campaigns.",
    },
    {
      title: "Save Time",
      description:
        "Shorten URLs in seconds and manage all your links from one centralized dashboard.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">⚡</span>
            <span className="text-2xl font-bold text-gray-800">SnapLink</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-blue-600 font-semibold text-sm">
              🎉 Trusted by 50,000+ users worldwide
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Shorten URLs,
            <br />
            <span className="text-blue-600">Amplify Results</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create powerful short links with advanced analytics. Track, manage,
            and optimize your URLs all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button variant="primary" className="text-lg px-8 py-3">
                Start Free Today
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and track your short links
              effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose SnapLink?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of businesses and individuals who trust SnapLink
              for their URL shortening needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users and start shortening your URLs today.
            It&apos;s free to get started!
          </p>
          <Link href="/register">
            <Button variant="primary" className="text-lg px-8 py-3">
              Create Your Free Account
            </Button>
          </Link>
          <p className="text-gray-400 mt-4 text-sm">
            No credit card required • Start in seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 SnapLink. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
