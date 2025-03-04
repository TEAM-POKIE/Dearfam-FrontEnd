import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "홈" },
    { path: "/daily", label: "일상" },
    { path: "/bookshelf", label: "책장" },
    { path: "/write", label: "작성" },
    { path: "/goods", label: "굿즈" },
    { path: "/family", label: "가족" },
  ];

  return (
    <nav className="bg-main-1 text-gray-7">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              DearFam
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-main-2 text-gray-7"
                      : "text-gray-7 hover:bg-main-2/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      <div className="md:hidden">
        <div className="flex justify-center space-x-1 px-2 pb-3 pt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                location.pathname === item.path
                  ? "bg-main-2 text-gray-7"
                  : "text-gray-7 hover:bg-main-2/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
