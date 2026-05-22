import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { GoGoal } from "react-icons/go";
import { MdOutlineSyncProblem } from "react-icons/md";
import { RiReplyAllLine } from "react-icons/ri";




const About = () => {
  return (
    <div className="px-4 md:px-10 py-12 space-y-16">
      <section className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-4xl md:text-5xl font-bold mt-4"
        >
          Connecting Farmers to the Future 🌱
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="max-w-2xl mx-auto text-lg opacity-80"
        >
          Farmora is redefining how agricultural products reach consumers —
          eliminating middlemen, ensuring fair prices, and building a
          transparent ecosystem.
        </motion.p>
      </section>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl">
          <Typography
            className="flex gap-2 items-center"
            variant="h5"
            fontWeight="bold"
            mb={2}
          >
            {<GoGoal className="h-8 w-8 text-pink-600" />} Our Mission
          </Typography>
          <p className="opacity-80">
            To empower farmers by giving them direct access to consumers,
            increasing their profit margins while ensuring fresh and affordable
            produce for buyers.
          </p>
        </div>

        <div className="glass p-6 rounded-2xl">
          <Typography variant="h5" fontWeight="bold" mb={2}>
            🌍 Our Vision
          </Typography>
          <p className="opacity-80">
            To build India's largest farmer-to-consumer digital marketplace,
            driven by trust, transparency, and technology.
          </p>
        </div>
      </section>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl">
          <Typography variant="h5" className="flex gap-2 items-center" fontWeight="bold" mb={2}>
            <span>
              <MdOutlineSyncProblem className="text-red-500" />
            </span>{" "}
            The Problem
          </Typography>
          <ul className="list-disc ml-5 space-y-2 opacity-80">
            <li>Farmers earn very low profit margins</li>
            <li>Multiple middlemen increase costs</li>
            <li>Lack of transparency in pricing</li>
            <li>Consumers get overpriced produce</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-2xl">
          <Typography variant="h5" fontWeight="bold" mb={2} className="flex gap-2 items-center">
            <span>
              <RiReplyAllLine className="text-green-400" />
              </span> Our Solution
          </Typography>
          <ul className="list-disc ml-5 space-y-2 opacity-80">
            <li>Direct farmer-to-buyer connection</li>
            <li>Real-time marketplace</li>
            <li>Fair pricing system</li>
            <li>Digital empowerment for farmers</li>
          </ul>
        </div>
      </section>
      <section>
        <Typography variant="h4" textAlign="center" mb={6}>
          What Makes Farmora Powerful ⚡
        </Typography>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Direct Marketplace",
            "Real-Time Notifications",
            "Secure Payments",
            "Advanced Dashboard",
            "Location-Based Filtering",
            "Transparent Pricing",
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass p-5 rounded-2xl text-center"
            >
              <p className="font-semibold">{feature}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl">
          <Typography variant="h5" fontWeight="bold" mb={2}>
            👨‍🌾 For Farmers
          </Typography>
          <ul className="list-disc ml-5 space-y-2 opacity-80">
            <li>List products easily</li>
            <li>Get better pricing</li>
            <li>Manage orders digitally</li>
          </ul>
        </div>

        <div className="glass p-6 rounded-2xl">
          <Typography variant="h5" fontWeight="bold" mb={2}>
            🛒 For Buyers
          </Typography>
          <ul className="list-disc ml-5 space-y-2 opacity-80">
            <li>Buy fresh directly</li>
            <li>Track orders</li>
            <li>Support local farmers</li>
          </ul>
        </div>
      </section>
      <section className="text-center space-y-4">
        <Typography variant="h4">
          Join the Agricultural Revolution 🌱
        </Typography>

        <p className="opacity-80">
          Be part of a smarter, fairer, and more transparent food system.
        </p>

        <div className="flex justify-center gap-4">
          <a href="/signup" className="btn-primary">
            Get Started
          </a>

          <a href="/products" className="btn-accent">
            Explore Products
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;