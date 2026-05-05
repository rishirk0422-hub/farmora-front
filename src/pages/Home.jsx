import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SiStartrek } from "react-icons/si";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { GiFarmer } from "react-icons/gi";




const Home = () => {
  return (
    <div className="space-y-24">
      {/* 🌟 HERO SECTION */}
      <section className="text-center space-y-6 py-10 mt-4">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Farm Fresh Products <br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Directly From Farmers 🌱
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg opacity-80"
        >
          Farmora connects farmers and consumers directly — eliminating
          middlemen, ensuring fair pricing, and delivering fresh produce.
        </motion.p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/products" className="btn-primary px-6 py-2">
            Explore Products
          </Link>

          <Link to="/signup" className="btn-accent px-6 py-2">
            Join Now
          </Link>
        </div>
      </section>

      {/* 🚀 FEATURES */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Why Farmora ?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "No Middlemen",
            "Fair Pricing",
            "Real-Time Orders",
            "Secure Platform",
            "Fresh Produce",
            "Smart Dashboard",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="glass p-6 rounded-2xl text-center"
            >
              <p className="font-semibold">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌾 FARMER vs BUYER */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex gap-2 items-center">{<GiFarmer className="h-8 w-8 text-purple-500" />} For Farmers</h3>
          <ul className="space-y-2 opacity-80">
            <li>Sell directly to buyers</li>
            <li>Get better profit margins</li>
            <li>Manage products easily</li>
          </ul>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex gap-2 items-center">
            {<RiShoppingBasket2Line className="text-blue-500 h-8 w-8" />} For Buyers
          </h3>
          <ul className="space-y-2 opacity-80">
            <li>Buy fresh products</li>
            <li>Track orders easily</li>
            <li>Support local farmers</li>
          </ul>
        </div>
      </section>

      {/* 📊 STATS */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">Trusted by Thousands</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Farmers", value: "1000+" },
            { label: "Customers", value: "5000+" },
            { label: "Orders", value: "20K+" },
            { label: "Cities", value: "50+" },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl">
              <p className="text-2xl font-bold text-green-400">{stat.value}</p>
              <p className="opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 CTA */}
      <section className="text-center space-y-4">
        <div className="flex gap-2 items-center justify-center">
          <span className="text-3xl font-bold">Start Your Journey Today</span>
          <span> {<SiStartrek className="h-9 w-9 text-blue-500" />}</span>
        </div>

        <p className="opacity-80">
          Join and be part of the agricultural revolution.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/signup" className="btn-primary px-6 py-2">
            Get Started
          </Link>

          <Link to="/products" className="btn-info px-6 py-2">
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;