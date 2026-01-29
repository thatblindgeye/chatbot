// ============================================================================
// Chatbot Sidebar
// ============================================================================
import type { FunctionComponent } from 'react';

export interface ChatbotSidebarProps {
  /** Content to be displayed in the sidebar */
  children: React.ReactNode;
  /** Custom classname for the ChatbotSidebar component */
  className?: string;
}

export const ChatbotSidebar: FunctionComponent<ChatbotSidebarProps> = ({ children, className, ...props }) => (
  <div className={`pf-chatbot__sidebar ${className ?? ''}`} {...props}>
    {children}
  </div>
);

export default ChatbotSidebar;
