import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#fcfcfc] border-t border-slate-200 mt-auto">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-[1.35rem] font-extrabold text-[#111827] tracking-tight flex items-center gap-2 group mb-6">
              <span>
                RemoteIn
              </span>
            </Link>
            <p className="text-sm text-slate-500 font-medium">
              &copy; 2024 RemoteIn. Premium Career<br />Transitions.
            </p>
          </div>

          {/* About */}
          <div>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/recruiters" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  For Recruiters
                </Link>
              </li>
            </ul>
          </div>

          {/* Jobs */}
          <div>
            <ul className="space-y-4">
              <li>
                <Link to="/jobs" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Job Board
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <ul className="space-y-4">
              <li>
                <Link to="/privacy" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
