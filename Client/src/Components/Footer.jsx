export default function Footer() {
    return (
      <footer className="bg-black w-screen text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Company</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-gray-400">About</a></li>
                <li><a href="#" className="hover:text-gray-400">Careers</a></li>
                <li><a href="#" className="hover:text-gray-400">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Support</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-400">Contact</a></li>
                <li><a href="#" className="hover:text-gray-400">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-400">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-gray-400">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-400">Instagram</a></li>
                <li><a href="#" className="hover:text-gray-400">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  