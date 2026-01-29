// ============================================================================
// Chatbot Popover
// ============================================================================
import type { FunctionComponent } from 'react';

// Import PatternFly components
import { Popover, PopoverProps } from '@patternfly/react-core';

export const ChatbotPopover: FunctionComponent<PopoverProps> = ({
  children,
  className,
  showClose = false,
  ...props
}) => (
  <Popover className={`pf-chatbot__popover ${className ?? ''}`} showClose={showClose} {...props}>
    {children}
  </Popover>
);

export default ChatbotPopover;
