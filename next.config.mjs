

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      
      {
        protocol: "https",
        hostname: "alfamily.vercel.app",
      },
       {
        protocol: "https",
        hostname: "img.freepik.com",
      },
    ],
    
  },
};

export default nextConfig;
