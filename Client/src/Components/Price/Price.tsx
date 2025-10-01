import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for individuals starting their journey.",
    features: ["Basic features", "Email support", "Access to community"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "Best for professionals who need more power.",
    features: ["All Starter features", "Priority support", "Advanced analytics"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For teams and organizations at scale.",
    features: [
      "All Pro features",
      "Dedicated support",
      "Custom integrations",
    ],
    highlight: false,
  },
];

const Pricing: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div id="pricing" className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Plan
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Find the right plan that fits your needs. Upgrade anytime as your
          journey grows.
        </motion.p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`rounded-2xl p-8 shadow-md border transition-all duration-300 ${
                plan.highlight
                  ? "bg-indigo-600 text-white scale-105 shadow-lg border-indigo-700"
                  : "bg-white text-gray-900 border-gray-200 hover:shadow-lg"
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  plan.highlight ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mb-6 ${
                  plan.highlight ? "text-indigo-100" : "text-gray-600"
                }`}
              >
                {plan.description}
              </p>
              <p className="text-4xl font-extrabold mb-6">{plan.price}</p>

              <ul className="text-left space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check
                      className={`w-5 h-5 ${
                        plan.highlight ? "text-white" : "text-indigo-500"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full rounded-xl ${
                  plan.highlight
                    ? "bg-white text-indigo-600 hover:bg-gray-100"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
