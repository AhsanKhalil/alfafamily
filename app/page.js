// app/page.js
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="container mx-auto px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE - TEXT */}
        <div className="space-y-6 md:pr-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400">
            Welcome to Alfamily
          </h1>
          <p className="text-lg leading-relaxed text-gray-300">
            The internal ride-sharing platform for Bank Alfalah employees. 
            Seamlessly connect with colleagues, offer or request rides, and 
            make your daily commute smarter.
          </p>

          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✅</span> Secure Login with official email + OTP
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✅</span> Smart matching of drivers & riders
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✅</span> Eco-friendly & cost saving
            </li>
          </ul>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
            {/* Use Link to navigate to register driver page */}
            <Link
              href="/register/driver"
              className="inline-block px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg transition-all text-center"
            >
              Register as Driver
            </Link>

            <Link
              href="/register/rider"
              className="inline-block px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg transition-all text-center"
            >
              Register as Passenger
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="https://img.freepik.com/premium-psd/network-people-connection-front-view-isolated-transparent-background_996812-36574.jpg"
            alt="Connecting people carpool"
            width={500}
            height={500}
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>
    </main>
  );
}
