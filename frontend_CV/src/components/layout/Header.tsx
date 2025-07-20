import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast is available

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to check login status by looking for a token in localStorage
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
  };

  // Effect hook to run once on component mount and listen for storage changes
  useEffect(() => {
    checkLoginStatus(); // Initial check

    // Add event listener to react to changes in localStorage (e.g., from the LoginPage after successful login)
    window.addEventListener('storage', checkLoginStatus);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handler for the logout action
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the authentication token
    setIsLoggedIn(false); // Update local state
    toast({ // Display a toast notification
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    navigate("/"); // Redirect the user to the home page
    // Dispatch a custom storage event to ensure other components (like Header itself) react immediately
    window.dispatchEvent(new Event('storage'));
  };

  // Base navigation items that are always visible to all users
  const baseNavItems = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Me", path: "/contact" },
  ];

  // Dynamically build the navigation items based on the login status
  const dynamicNavItems = [...baseNavItems];
  if (isLoggedIn) {
    // If logged in, show the "Admin" link
    dynamicNavItems.push({ name: "Admin", path: "/admin" });
  } else {
    // If not logged in, show the "Login" link
    dynamicNavItems.push({ name: "Login", path: "/login" });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Site Title */}
          <NavLink to="/" className="text-2xl font-bold text-primary hover:text-primary-glow transition-smooth">
            Akarshan Ghosh
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {dynamicNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `animated-underline transition-smooth ${
                    isActive ? "text-primary" : "text-foreground hover:text-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {/* Logout button visible only when logged in */}
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover-scale text-red-500 hover:text-red-600"
              >
                <LogOut className="mr-2 w-4 h-4" /> Logout
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation (conditionally rendered when menu is open) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              {dynamicNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-smooth ${
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)} // Close menu on item click
                >
                  {item.name}
                </NavLink>
              ))}
              {/* Mobile Logout button visible only when logged in */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }} // Close menu and logout
                  className="hover-scale text-red-500 hover:text-red-600 justify-start"
                >
                  <LogOut className="mr-2 w-4 h-4" /> Logout
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;