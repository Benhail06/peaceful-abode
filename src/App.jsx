

import containerRoom from "./assets/container-room.jpg";
import dormitoryRoom from "./assets/dormitory.jpg";
import pondicherryBg from "./assets/pondicherry-bg.png";
import jasperCafe from "./assets/jasper-cafe.png";
import communityNight from "./assets/community-night.png";
import cafeVibes from "./assets/cafe-vibes.jpg";
import workshopBg from "./assets/workshop-bg.jpg";
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

  return (
    <div className="bg-[#f7f5ef] text-gray-800 overflow-hidden">
      {/* HERO SECTION */}
      <section
        className="h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
             backgroundImage: `url(${pondicherryBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-75"></div>

        {/* NAVBAR */}
        <nav className="absolute top-0 left-0 w-full z-20 px-8 py-6 flex justify-between items-center text-white">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Peaceful Abode x Jasper’s Cafe
          </h1>

          <div className="hidden md:flex gap-8 uppercase tracking-wide text-sm">
            <a href="#about" className="hover:text-yellow-300">
              About
            </a>

            <a href="#stay" className="hover:text-yellow-300">
              Stay
            </a>

            <a href="#cafe" className="hover:text-yellow-300">
              Cafe
            </a>

            <a href="#workshops" className="hover:text-yellow-300">
              Workshops
            </a>

            <a href="#contact" className="hover:text-yellow-300">
              Contact
            </a>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
          <div className="max-w-4xl text-white">
            <p className="uppercase tracking-[6px] text-yellow-300 mb-6">
              Eco Stay • Creative Cafe • Community Space • Auroville,
              Pondicherry
            </p>

            <h1 className="text-5xl md:text-7xl font-light leading-tight mb-8">
              Stay Peacefully.
              <br />
              Create Freely.
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10">
              A unique eco-friendly container homestay and creative cafe
              experience nestled amidst the serene cashew tree forests of
              Auroville, Pondicherry.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918639102483?text=Hi%20"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition inline-block"
              >
                Book Your Stay
              </a>

              <button className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition">
                Explore Jasper’s Cafe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-24 px-6 md:px-16 bg-white"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop"
              alt=""
              className="rounded-3xl shadow-2xl h-[550px] object-cover w-full"
            />
          </div>

          <div>
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
          </div>
        </div>
      </section>

      {/* STAY EXPERIENCE */}
      <section
        id="stay"
        className="py-24 px-6 md:px-16 bg-[#f5f1e8]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
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
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* PRIVATE STAY */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <img
               src={containerRoom}
                className="rounded-3xl shadow-2xl h-[650px] object-cover hover:scale-105 transition duration-700 w-full"
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
            </div>

            {/* DORMITORY */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <img
                src={dormitoryRoom}
                className="rounded-3xl shadow-2xl h-[650px] object-cover hover:scale-105 transition duration-700 w-full"
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
            </div>
          </div>
        </div>
      </section>

      {/* CAFE */}
      <section
        id="cafe"
        className="py-24 px-6 md:px-16 bg-white"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
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
              <div className="bg-[#f7f5ef] p-6 rounded-2xl">
                Homemade Food
              </div>

              <div className="bg-[#f7f5ef] p-6 rounded-2xl">
                Fresh Beverages
              </div>

              <div className="bg-[#f7f5ef] p-6 rounded-2xl">
                Community Dining
              </div>

              <div className="bg-[#f7f5ef] p-6 rounded-2xl">
                Creative Gatherings
              </div>
            </div>
          </div>

          <div className="space-y-6">

  <img
    src={jasperCafe}
    className="rounded-3xl shadow-2xl h-[500px] object-cover hover:scale-105 transition duration-700 w-full"
  />

  <img
    src={cafeVibes}
    className="rounded-3xl shadow-xl h-[250px] object-cover hover:scale-105 transition duration-700 w-full"
  />

</div>
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

          <div className="grid md:grid-cols-3 gap-8">
            {workshops.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 hover:bg-yellow-500/20 border border-white/10 rounded-3xl p-10 backdrop-blur-md hover:scale-105 transition"
              >
                <h3 className="text-2xl">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-24 px-6 md:px-16 bg-[#f5f1e8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[5px] text-yellow-700 text-sm mb-4">
              Amenities
            </p>

            <h2 className="text-5xl font-light">
              Everything You Need
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {amenities.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg text-lg"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PICKUP */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
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
        </div>
      </section>

      {/* LOCATION */}
      <section
        id="contact"
        className="py-24 px-6 md:px-16 bg-[#111111] text-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[5px] text-yellow-400 text-sm mb-4">
            Location
          </p>

          <h2 className="text-5xl font-light mb-8">
            Auroville, Pondicherry
          </h2>
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
  
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

</div>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
            Located just 1 km from the beach amidst peaceful cashew tree
            forests — blending nature, creativity, cafe culture, and
            community living into one unforgettable stay experience.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-8 rounded-3xl">
              🌿 Nature
            </div>

            <div className="bg-white/5 p-8 rounded-3xl">
              ☕ Cafe Culture
            </div>

            <div className="bg-white/5 p-8 rounded-3xl">
              🎨 Creativity
            </div>

            <div className="bg-white/5 p-8 rounded-3xl">
              🔥 Community Living
            </div>
          </div>
        </div>
      </section>

{/* COMMUNITY MOMENTS */}
<section className="py-24 px-6 md:px-16 bg-[#f7f5ef]">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
    
    <div>
      <img
        src={communityNight}
        alt="Community Moments"
        className="rounded-3xl shadow-2xl w-full h-[500px] object-cover hover:scale-[1.02] transition duration-700"
      />
    </div>

    <div>
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
    </div>
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