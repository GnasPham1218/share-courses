export default function Footer() {
  return (
    <footer className="py-4 px-6 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} Drive Management System. Built with FastAPI & React.
    </footer>
  );
}