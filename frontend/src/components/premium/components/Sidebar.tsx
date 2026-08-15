import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  FileText, 
  MessageSquare, 
  FileCheck, 
  Mail,
  Share2,
  Send,
  Settings as SettingsIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/premium' },
  { id: 'excel', label: 'Excel Genius Suite', icon: FileSpreadsheet, path: '/premium/excel' },
  { id: 'pdf', label: 'PDF Intelligence Hub', icon: FileText, path: '/premium/pdfhub' },
  { id: 'ai-chat', label: 'AI Workmate', icon: MessageSquare, path: '/premium/aiworkmate' },
  { id: 'mailcraft', label: 'MailCraft AI', icon: Mail, path: '/premium/mailcraft' },
  { id: 'socialpro', label: 'Social Pro Toolkit', icon: Share2, path: '/premium/socialpro' },
  { id: 'smartdocs', label: 'SmartDocs Suite', icon: FileCheck, path: '/premium/smartdocs' },
  { id: 'bulkmailer', label: 'BulkMailer Pro', icon: Send, path: '/premium/bulkmailer' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/premium/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-20 w-64 backdrop-blur-xl border-r h-[calc(100vh-5rem)] overflow-y-auto z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isDarkMode 
          ? 'bg-[#050505]/95 border-r border-[#262626]' 
          : 'bg-white/95 border-r border-gray-200/50'
      }`}>
        <div className="p-6">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/premium' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center px-5 py-3 rounded-full transition-all duration-200 group ${
                    isActive
                      ? isDarkMode 
                        ? 'bg-[#2640D9] text-white shadow-lg shadow-[#2640D9]/20 font-semibold scale-[1.02]' 
                        : 'bg-[#2640D9] text-white shadow-md font-semibold'
                      : isDarkMode
                        ? 'text-[#737373] hover:text-[#E5E5E5] hover:bg-[#0b0b0f] border border-transparent hover:border-[#2640D9]/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full min-w-0">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
