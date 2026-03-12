import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-[0.3em] uppercase mb-4">
          VASEU
        </h1>
        <p className="text-sm md:text-base tracking-[0.5em] uppercase opacity-80 mb-12">
          Streetwear Company
        </p>
        <Link
          to="/produtos"
          className="border border-white px-10 py-4 text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300"
        >
          Linha Basic
        </Link>
      </div>
    </div>
  );
};

export default Index;
