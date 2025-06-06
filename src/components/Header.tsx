
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">&lt;/&gt; Instanti8.dev</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Examples</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Templates</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
