// app/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto text-center p-6">
        &copy; {new Date().getFullYear()} Alfamily. All rights reserved.
      </div>
    </footer>
  );
}
