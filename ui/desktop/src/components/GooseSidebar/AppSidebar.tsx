import React, { useEffect, useState } from 'react';
import { FileText, Clock, Home, Puzzle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from '../ui/sidebar';
import { ChatSmart, Gear } from '../icons';
import { ViewOptions, View } from '../../utils/navigationUtils';
import { useChatContext } from '../../contexts/ChatContext';
import { DEFAULT_CHAT_TITLE } from '../../contexts/ChatContext';

interface SidebarProps {
  onSelectSession: (sessionId: string) => void;
  refreshTrigger?: number;
  children?: React.ReactNode;
  setIsGoosehintsModalOpen?: (isOpen: boolean) => void;
  setView?: (view: View, viewOptions?: ViewOptions) => void;
  currentPath?: string;
}

interface NavigationItem {
  type: 'item';
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

interface NavigationSeparator {
  type: 'separator';
}

type NavigationEntry = NavigationItem | NavigationSeparator;

const menuItems: NavigationEntry[] = [
  {
    type: 'item',
    path: '/',
    label: 'Home',
    icon: Home,
    tooltip: 'Go back to the main chat screen',
  },
  { type: 'separator' },
  {
    type: 'item',
    path: '/pair',
    label: 'Chat',
    icon: ChatSmart,
    tooltip: 'Start pairing with Goose',
  },
  {
    type: 'item',
    path: '/sessions',
    label: 'History',
    icon: History,
    tooltip: 'View your session history',
  },
  { type: 'separator' },
  {
    type: 'item',
    path: '/recipes',
    label: 'Recipes',
    icon: FileText,
    tooltip: 'Browse your saved recipes',
  },
  {
    type: 'item',
    path: '/schedules',
    label: 'Scheduler',
    icon: Clock,
    tooltip: 'Manage scheduled runs',
  },
  {
    type: 'item',
    path: '/extensions',
    label: 'Extensions',
    icon: Puzzle,
    tooltip: 'Manage your extensions',
  },
  { type: 'separator' },
  {
    type: 'item',
    path: '/settings',
    label: 'Settings',
    icon: Gear,
    tooltip: 'Configure Goose settings',
  },
];

const AppSidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const chatContext = useChatContext();
  const [showRecipes, setShowRecipes] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Load sidebar visibility settings
  useEffect(() => {
    const loadSidebarSettings = () => {
      const recipesStored = localStorage.getItem('show_recipes_sidebar');
      const schedulerStored = localStorage.getItem('show_scheduler_sidebar');
      setShowRecipes(recipesStored === 'true');
      setShowScheduler(schedulerStored === 'true');
    };

    // Load initial settings
    loadSidebarSettings();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadSidebarSettings();
    };

    window.addEventListener('sidebar-visibility-changed', handleStorageChange);
    return () => window.removeEventListener('sidebar-visibility-changed', handleStorageChange);
  }, []);

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.type === 'item' && item.path === currentPath
    ) as NavigationItem | undefined;

    const titleBits = ['Goose'];

    if (
      currentPath === '/pair' &&
      chatContext?.chat?.title &&
      chatContext.chat.title !== DEFAULT_CHAT_TITLE
    ) {
      titleBits.push(chatContext.chat.title);
    } else if (currentPath !== '/' && currentItem) {
      titleBits.push(currentItem.label);
    }

    document.title = titleBits.join(' - ');
  }, [currentPath, chatContext?.chat?.title]);

  const isActivePath = (path: string) => {
    return currentPath === path;
  };

  // Filter menu items based on visibility settings
  const getVisibleMenuItems = (): NavigationEntry[] => {
    return menuItems.filter((item) => {
      if (item.type === 'separator') return true;
      if (item.path === '/recipes' && !showRecipes) return false;
      if (item.path === '/schedules' && !showScheduler) return false;
      return true;
    });
  };

  const renderMenuItem = (entry: NavigationEntry, index: number) => {
    if (entry.type === 'separator') {
      return <SidebarSeparator key={index} />;
    }

    const IconComponent = entry.icon;

    return (
      <SidebarGroup key={entry.path}>
        <SidebarGroupContent className="space-y-1">
          <div className="sidebar-item">
            <SidebarMenuItem>
              <SidebarMenuButton
                data-testid={`sidebar-${entry.label.toLowerCase()}-button`}
                onClick={() => navigate(entry.path)}
                isActive={isActivePath(entry.path)}
                tooltip={entry.tooltip}
                className="w-full justify-start px-3 rounded-lg h-fit hover:bg-background-medium/50 transition-all duration-200 data-[active=true]:bg-background-medium"
              >
                <IconComponent className="w-4 h-4" />
                <span>{entry.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  const visibleMenuItems = getVisibleMenuItems();

  return (
    <>
      <SidebarContent className="pt-16">
        <SidebarMenu>
          {visibleMenuItems.map((entry, index) => renderMenuItem(entry, index))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter />
    </>
  );
};

export default AppSidebar;
