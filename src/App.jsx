import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import containerRoom from "./assets/container-room.jpg";
import dormitoryRoom from "./assets/dormitory.jpg";
import pondicherryBg from "./assets/pondicherry-bg.png";
import jasperCafe from "./assets/jasper-cafe.png";
import communityNight from "./assets/community-night.png";
import cafeVibes from "./assets/cafe-vibes.jpg";
import pizzaEmpty from "./assets/pizza-empty.jpg";
import herbalTea from "./assets/herbal-tea.jpg";
import workshopBg from "./assets/workshop-bg.jpg";

import HeroScene from "./components/HeroScene.jsx";
import PizzaSlice from "./components/PizzaSlice.jsx";
import TeaCard from "./components/TeaCard.jsx";
import TiltCard from "./components/TiltCard.jsx";
import Reveal from "./components/Reveal.jsx";
import AmbientAudio from "./components/AmbientAudio.jsx";

export default function App() {
  const workshops = [
    "Tote Bag Painting Workshops",
    "Air Dry Clay Art Sessions",
    "Brownie Workshops",
    "Creative Meetups",
    "Bonfire Nights",
    "IPL & Movie Screenings",
    "Art & Community Events",
  ];

  const amenities = [
    "Free WiFi",
    "Free Parking",
    "Pet Friendly Stay",
    "24/7 Power Backup",
    "HDTV with Netflix, Prime Video, Disney+, Chromecast & Fire TV",
    "Peaceful Natural Environment",
    "Creative & Community Atmosphere",
  ];

  /* Hero scroll parallax */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="bg-[#f7f5ef] text-gray-800 overflow-hidden">
      <AmbientAudio />

      {/* HERO SECTION */}
      <section ref={heroRef} className="h-screen relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${pondicherryBg})`, scale: bgScale }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-75"></div>

        {/* 3D SCENE — fireflies & floating leaves */}
        <HeroScene />

        {/* NAVBAR */}
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full z-20 px-8 py-6 flex justify-between items-center text-white"
        >
          <h1 className="text-2xl md:text-3xl font-semibold">
            Peaceful Abode x Jasper’s Cafe
          </h1>

          <div className="hidden md:flex gap-8 uppercase tracking-wide text-sm">
            <a href="#about" className="hover:text-yellow-300 transition">
              About
            </a>

            <a href="#stay" className="hover:text-yellow-300 transition">
              Stay
            </a>

            <a href="#cafe" className="hover:text-yellow-300 transition">
              Cafe
            </a>

            <a href="#workshops" className="hover:text-yellow-300 transition">
              Workshops
            </a>

            <a href="#contact" className="hover:text-yellow-300 transition">
              Contact
            </a>
          </div>
        </motion.nav>

        {/* HERO CONTENT */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex items-center justify-center h-full text-center px-6"
        >
          <motion.div
            className="max-w-4xl text-white"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } } }}
          >
            <motion.p
              variants={heroItem}
              className="uppercase tracking-[6px] text-yellow-300 mb-6"
            >
              Eco Stay • Creative Cafe • Community Space • Auroville,
              Pondicherry
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="text-5xl md:text-7xl font-light leading-tight mb-8"
            >
              Stay Peacefully.
              <br />
              Create Freely.
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10"
            >
              A unique eco-friendly container homestay and creative cafe
              experience nestled amidst the serene cashew tree forests of
              Auroville, Pondicherry.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="flex flex-col md:flex-row gap-4 justify-center"
            >
              <a
                href="https://wa.me/918639102483?text=Hi%20"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition inline-block"
              >
                Book Your Stay
              </a>

              <a
                href="#cafe"
                className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition"
              >
                Explore Jasper’s Cafe
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <TiltCard max={5}>
              <img
                src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop"
                alt=""
                className="rounded-3xl shadow-2xl h-[550px] object-cover w-full"
              />
            </TiltCard>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="uppercase tracking-[5px] text-yellow-600 text-sm mb-4">
              Welcome Home
            </p>

            <h2 className="text-5xl font-light mb-8 leading-tight">
              More than just a stay.
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Peaceful Abode x Jasper’s Cafe is designed for travelers,
              backpackers, creators, artists, digital nomads, and nature
              lovers.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our space blends peaceful living, soulful food, creativity, and
              community into one unforgettable experience.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you’re here for beach mornings, homemade food, bonfire
              nights, art workshops, or peaceful days surrounded by nature —
              this is your escape from the noise of everyday life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STAY EXPERIENCE */}
      <section id="stay" className="py-24 px-6 md:px-16 bg-[#f5f1e8]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
              Stay Experience
            </p>

            <h2 className="text-5xl font-light mb-6">
              Eco Conscious Living
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our eco-conscious stay is built using a recycled shipping
              container designed for comfort, simplicity, and peaceful living.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10">
            {/* PRIVATE STAY */}
            <Reveal>
              <TiltCard
                max={6}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={containerRoom}
                  className="rounded-3xl shadow-2xl h-[650px] object-cover w-full"
                />

                <div className="p-10">
                  <h3 className="text-3xl mb-6">
                    Private Container Stay
                  </h3>

                  <ul className="space-y-4 text-gray-600 text-lg">
                    <li>• Entire private container stay</li>
                    <li>• Nature & forest atmosphere</li>
                    <li>• Smart TV entertainment</li>
                    <li>• Free WiFi</li>
                    <li>• Free parking</li>
                    <li>• Access to common spaces</li>
                  </ul>
                </div>
              </TiltCard>
            </Reveal>

            {/* DORMITORY */}
            <Reveal delay={0.15}>
              <TiltCard
                max={6}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={dormitoryRoom}
                  className="rounded-3xl shadow-2xl h-[650px] object-cover w-full"
                />

                <div className="p-10">
                  <h3 className="text-3xl mb-6">
                    Backpacker Dormitory
                  </h3>

                  <ul className="space-y-4 text-gray-600 text-lg">
                    <li>• Shared comfortable bed spaces</li>
                    <li>• Perfect for solo travelers</li>
                    <li>• Community atmosphere</li>
                    <li>• WiFi access</li>
                    <li>• Workshop & activity access</li>
                    <li>• 10 Bed Spaces Available</li>
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CAFE */}
      <section id="cafe" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
              Jasper’s Cafe
            </p>

            <h2 className="text-5xl font-light mb-8 leading-tight">
              Soulful food, warm conversations & cozy vibes.
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At the heart of Peaceful Abode is Jasper’s Cafe — our cozy
              community cafe serving soulful homemade food, comforting drinks,
              and warm conversations.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <TiltCard className="bg-[#f7f5ef] p-6 rounded-2xl">
                Homemade Food
              </TiltCard>

              <TiltCard className="bg-[#f7f5ef] p-6 rounded-2xl">
                Fresh Beverages
              </TiltCard>

              <TiltCard className="bg-[#f7f5ef] p-6 rounded-2xl">
                Community Dining
              </TiltCard>

              <TiltCard className="bg-[#f7f5ef] p-6 rounded-2xl">
                Creative Gatherings
              </TiltCard>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <PizzaSlice src={jasperCafe} emptySrc={pizzaEmpty} />
            </Reveal>

            <Reveal delay={0.2}>
              <TiltCard max={5}>
                <img
                  src={cafeVibes}
                  className="rounded-3xl shadow-xl h-[250px] object-cover w-full"
                />
              </TiltCard>
            </Reveal>
          </div>
        </div>

        {/* HERBAL TEAS */}
        <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <TeaCard src={herbalTea} className="h-[340px] w-full" />
          </Reveal>

          <Reveal delay={0.15}>
            <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
              Herbal Teas
            </p>

            <h2 className="text-5xl font-light mb-8 leading-tight">
              Steeped slow, served warm.
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Rose petals, mint, and hand-picked herbs steeped into a warm,
              fragrant cup — a quiet moment between conversations, best
              enjoyed slow.
            </p>

            <div className="flex gap-4 flex-wrap">
              <span className="bg-[#f7f5ef] px-5 py-3 rounded-full shadow-sm">
                🌹 Rose & Mint
              </span>

              <span className="bg-[#f7f5ef] px-5 py-3 rounded-full shadow-sm">
                🍃 Herbal Blends
              </span>

              <span className="bg-[#f7f5ef] px-5 py-3 rounded-full shadow-sm">
                ☕ Served Hot
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WORKSHOPS */}
      <section
        id="workshops"
        className="py-24 px-6 md:px-16 text-white relative overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${workshopBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <Reveal>
            <p className="uppercase tracking-[5px] text-yellow-400 text-sm mb-4">
              Creative Experiences
            </p>

            <h2 className="text-5xl font-light mb-8">
              Workshops & Community
            </h2>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
              A space designed for creativity, connection, and meaningful
              experiences.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {workshops.map((item, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <TiltCard
                  max={10}
                  className="bg-white/10 hover:bg-yellow-500/20 border border-white/10 rounded-3xl p-10 backdrop-blur-md transition-colors h-full"
                >
                  <h3 className="text-2xl">{item}</h3>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-24 px-6 md:px-16 bg-[#f5f1e8]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
              Amenities
            </p>

            <h2 className="text-5xl font-light">
              Everything You Need
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {amenities.map((item, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <TiltCard
                  max={8}
                  className="bg-white rounded-3xl p-8 shadow-lg text-lg h-full"
                >
                  {item}
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PICKUP */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <Reveal className="max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
            Complimentary Pick-Up & Drop
          </p>

          <h2 className="text-5xl font-light mb-8">
            Travel Hassle-Free
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            Free pick-up and drop available for guests arriving by bus,
            train, or flight with prior coordination.
          </p>
        </Reveal>
      </section>

      {/* LOCATION */}
      <section
        id="contact"
        className="py-24 px-6 md:px-16 bg-[#111111] text-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <p className="uppercase tracking-[5px] text-yellow-400 text-sm mb-4">
              Location
            </p>

            <h2 className="text-5xl font-light mb-8">
              Auroville, Pondicherry
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 flex flex-col md:flex-row justify-center gap-6">
            <a
              href="tel:8220574649"
              className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full transition backdrop-blur-md"
            >
              📞 8220574649
            </a>

            <a
              href="tel:7032408238"
              className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full transition backdrop-blur-md"
            >
              📞 7032408238
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto my-12">
              Located just 1 km from the beach amidst peaceful cashew tree
              forests — blending nature, creativity, cafe culture, and
              community living into one unforgettable stay experience.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6">
            {["🌿 Nature", "☕ Cafe Culture", "🎨 Creativity", "🔥 Community Living"].map(
              (item, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <TiltCard max={10} className="bg-white/5 p-8 rounded-3xl h-full">
                    {item}
                  </TiltCard>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* COMMUNITY MOMENTS */}
      <section className="py-24 px-6 md:px-16 bg-[#f7f5ef]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <TiltCard max={5}>
              <img
                src={communityNight}
                alt="Community Moments"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </TiltCard>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
              Community Moments
            </p>

            <h2 className="text-5xl font-light mb-8 leading-tight">
              Meet travelers, creators & beautiful souls.
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Peaceful Abode x Jasper’s Cafe is more than a stay — it’s a place
              where strangers become friends through conversations, food,
              creativity, and shared experiences.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              From late-night cafe talks to bonfire gatherings and community
              dinners, every evening creates unforgettable memories.
            </p>

            <div className="flex gap-4 flex-wrap">
              <span className="bg-white px-5 py-3 rounded-full shadow-sm">
                ☕ Cafe Conversations
              </span>

              <span className="bg-white px-5 py-3 rounded-full shadow-sm">
                🔥 Bonfire Nights
              </span>

              <span className="bg-white px-5 py-3 rounded-full shadow-sm">
                🎨 Creative Meetups
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-10 text-center">
        <h3 className="text-3xl mb-4">
          Peaceful Abode x Jasper’s Cafe
        </h3>

        <p className="text-gray-400">
          Eco Stay • Creative Cafe • Community Space
        </p>
      </footer>
    </div>
  );
}
