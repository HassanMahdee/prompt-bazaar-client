import { FaRocket, FaShieldAlt, FaUsers, FaLightbulb } from "react-icons/fa";

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: <FaRocket className="text-indigo-600 text-3xl" />,
      title: "Boost Productivity",
      desc: "Streamline tasks with AI-powered automation and save valuable time.",
    },
    {
      icon: <FaLightbulb className="text-yellow-500 text-3xl" />,
      title: "Unlock Creativity",
      desc: "Generate fresh ideas, prompts, and content that inspire innovation.",
    },
    {
      icon: <FaShieldAlt className="text-green-600 text-3xl" />,
      title: "Secure & Reliable",
      desc: "Your data is protected with enterprise-grade security and privacy.",
    },
    {
      icon: <FaUsers className="text-pink-600 text-3xl" />,
      title: "Community Driven",
      desc: "Join a growing network of creators, developers, and innovators.",
    },
  ];

  return (
    <section className="container-xy">
      <h2 className="section-title">Why Choose Us</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="card bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition"
          >
            <div className="flex justify-center mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
