import { useEffect, useRef, useState, FunctionComponent } from 'react';
import {
  Button,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerActions,
  DrawerPanelBody,
  Icon,
  InputGroup,
  InputGroupItem,
  Label,
  SearchInput,
  Title,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  MenuGroup,
  Tabs,
  Tab,
  TabTitleText,
  EmptyState,
  EmptyStateBody,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  Nav,
  NavList,
  NavItem,
  Checkbox,
  Tooltip
} from '@patternfly/react-core';

import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import ChatbotPopover from '@patternfly/chatbot/dist/dynamic/ChatbotPopover';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';

import { PlusIcon } from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { AngleDoubleRightIcon } from '@patternfly/react-icons/dist/esm/icons/angle-double-right-icon';
import { AngleDoubleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import { OutlinedCommentsIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-comments-icon';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';

import userAvatar from '../Messages/user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const footnoteProps = {
  label: 'Lightspeed uses AI. Check for mistakes.',
  popover: {
    title: 'Verify information',
    description: `While Lightspeed strives for accuracy, AI is experimental and can make mistakes. We cannot guarantee that all information provided is up to date or without error.`,
    cta: {
      label: 'Got it',
      onClick: () => {
        alert('Dismissed');
      }
    }
  }
};

interface Source {
  title: string;
  link: string;
  url: string;
  body: string;
}

const sources: Source[] = [
  {
    title: 'Red Hat',
    link: 'onboard_doc.pdf',
    url: 'www.docs.redhat.com',
    body: 'Chapter 1. Understanding internal developer platforms. An internal developer platform (IDP) is a self-service layer that enables developers to independently access tools and resources, promoting autonomy and accelerating the development lifecycle without waiting for operations teams.'
  },
  {
    title: 'Red Hat',
    link: 'onboard_doc.md',
    url: 'www.docs.redhat.com',
    body: 'A Red Hat Knowledgebase article that provides a step-by-step guide for diagnosing and resolving common issues in OpenShift environments.'
  },
  {
    title: 'Red Hat',
    link: 'example.pdf',
    url: 'www.docs.redhat.com',
    body: 'An official Red Hat blog post explaining how to build, deploy, and trigger event-driven applications using OpenShift Serverless.'
  }
];

const welcomePrompts = [
  {
    title: 'Document',
    message: 'Help me document my code'
  },
  {
    title: 'Debug',
    message: 'Help me find a bug in my code'
  },
  {
    title: 'Troubleshoot',
    message: 'Fix a problem with my application'
  }
];

const initialConversations = [
  { id: '1', text: 'Red Hat products and services', isPinned: true },
  { id: '2', text: 'Enterprise Linux installation and setup', isPinned: true },
  { id: '3', text: 'Troubleshoot system crash' },
  { id: '4', text: 'Ansible security and updates' },
  { id: '5', text: 'Red Hat certification' },
  { id: '6', text: 'Crashing pod assistance' }
];

const initialDate = new Date();

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, what is Red Hat Developer Hub?',
    name: 'User',
    avatar: userAvatar,
    timestamp: initialDate.toLocaleString(),
    avatarProps: { isBordered: true }
  },
  {
    id: '2',
    role: 'bot',
    content: `Red Hat Developer Hub serves as an enterprise-grade, internal developer platform built on Backstage, designed to streamline the developer experience. It provides:

• Help developers create applications through a unified interface.
• Provide software templates which are pre-built configurations that enhances developer productivity.
• Offer a plugin ecosystem which allows teams to customize their IDP that enhances developer productivity.

In short — it's your command center for everything development.`,
    name: 'Bot',
    avatar: patternflyAvatar,
    timestamp: initialDate.toLocaleString()
  }
];

export const ChatbotCustomDrawerSourcesDemo: FunctionComponent = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [searchValue, setSearchValue] = useState('');
  const [announcement, setAnnouncement] = useState<string>();
  const [activeHeaderTabKey, setActiveHeaderTabKey] = useState<string | number>(0);
  const [activeDrawerTabKey, setActiveDrawerTabKey] = useState<string | number>(0);
  const [useCustomDrawer, setUseCustomDrawer] = useState(true);
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prevDrawerExpandedRef = useRef(isDrawerExpanded);

  const displayMode = ChatbotDisplayMode.embedded;

  useEffect(() => {
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // When drawer transitions from closed to open, focus the close button
    if (prevDrawerExpandedRef.current === false && isDrawerExpanded === true) {
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    }
    // When drawer transitions from open to closed, return focus to expand button
    if (prevDrawerExpandedRef.current === true && isDrawerExpanded === false) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          expandButtonRef.current?.focus();
        });
      }, 300);
    }
    prevDrawerExpandedRef.current = isDrawerExpanded;
  }, [isDrawerExpanded]);

  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message: string | number) => {
    const messageText = message.toString();
    setIsSendButtonDisabled(true);

    const newMessages: MessageProps[] = [];
    messages.forEach((message) => newMessages.push(message));

    const date = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: messageText,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true }
    });
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true,
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    setAnnouncement(`Message from User: ${messageText}. Message from Bot is loading.`);

    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      newMessages.forEach((message) => loadedMessages.push(message));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'This is a simulated API response with source citations.',
        name: 'Bot',
        avatar: patternflyAvatar,
        isLoading: false,
        timestamp: date.toLocaleString()
      });
      setMessages(loadedMessages);
      setAnnouncement(`Message from Bot: This is a simulated API response with source citations.`);
      setIsSendButtonDisabled(false);
    }, 2000);
  };

  const handleSearchChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setSearchValue(value);
    if (value === '') {
      setConversations(initialConversations);
    } else {
      const filtered = initialConversations.filter((conv) => conv.text.toLowerCase().includes(value.toLowerCase()));
      setConversations(filtered);
    }
  };

  const sourcesPopoverContent = (
    <div style={{ padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
      <p style={{ marginBottom: '1rem' }}>
        The following sources were used to generate this AI response and provide supporting information:
      </p>
      {sources.map((source, index) => (
        <div key={index} style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{source.title}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>{source.url}</div>
          <a
            href="#"
            style={{ color: 'var(--pf-t--global--color--brand--default)', display: 'block', margin: '0.25rem 0' }}
          >
            {source.link}
          </a>
          <div style={{ fontSize: '0.875rem' }}>{source.body}</div>
        </div>
      ))}
    </div>
  );

  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const recentConversations = conversations.filter((c) => !c.isPinned);

  const drawerPanel = (
    <DrawerPanelContent defaultSize="300px" minSize="200px" focusTrap={{ enabled: true }}>
      <DrawerHead>
        <DrawerActions className="pf-v6-c-drawer__actions--reversed">
          <div className="pf-v6-c-drawer__close">
            <Button
              ref={closeButtonRef}
              variant="plain"
              aria-label="Collapse drawer"
              onClick={() => setIsDrawerExpanded(false)}
            >
              <AngleDoubleLeftIcon />
            </Button>
          </div>
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={() => {
              setMessages([]);
              setIsDrawerExpanded(false);
            }}
          >
            New chat
          </Button>
        </DrawerActions>
      </DrawerHead>
      <Tabs
        activeKey={activeDrawerTabKey}
        onSelect={(_event, tabIndex) => setActiveDrawerTabKey(tabIndex)}
        aria-label="Drawer tabs"
      >
        <Tab eventKey={0} title={<TabTitleText>History</TabTitleText>} />
        <Tab eventKey={1} title={<TabTitleText>Settings</TabTitleText>} />
      </Tabs>
      <DrawerPanelBody>
        {activeDrawerTabKey === 0 ? (
          <>
            <InputGroup>
              <InputGroupItem isFill>
                <SearchInput
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onClear={() => {
                    setSearchValue('');
                    setConversations(initialConversations);
                  }}
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button variant="plain" aria-label="Sort">
                  <BarsIcon />
                </Button>
              </InputGroupItem>
            </InputGroup>

            <Menu>
              <MenuContent>
                {pinnedConversations.length > 0 && (
                  <MenuGroup label="Pinned">
                    <MenuList>
                      {pinnedConversations.map((conv) => (
                        <MenuItem
                          key={conv.id}
                          itemId={conv.id}
                          icon={
                            <Icon status="custom">
                              <OutlinedCommentsIcon />
                            </Icon>
                          }
                          actions={
                            <Button variant="plain" aria-label="Options">
                              <EllipsisVIcon />
                            </Button>
                          }
                        >
                          {conv.text}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuGroup>
                )}
                {recentConversations.length > 0 && (
                  <MenuGroup label="Recent">
                    <MenuList>
                      {recentConversations.map((conv) => (
                        <MenuItem
                          key={conv.id}
                          itemId={conv.id}
                          icon={
                            <Icon status="custom">
                              <OutlinedCommentsIcon />
                            </Icon>
                          }
                          actions={
                            <Button variant="plain" aria-label="Options">
                              <EllipsisVIcon />
                            </Button>
                          }
                        >
                          {conv.text}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </MenuGroup>
                )}
              </MenuContent>
            </Menu>
          </>
        ) : (
          <div>Settings content</div>
        )}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  const pageSidebar = (
    <PageSidebar>
      <PageSidebarBody>
        <Nav>
          <NavList>
            <NavItem>Home</NavItem>
            <NavItem>Catalog</NavItem>
            <NavItem>APIs</NavItem>
            <NavItem>Docs</NavItem>
            <NavItem>Learning Paths</NavItem>
            <NavItem>Clusters</NavItem>
            <NavItem>Tech Radar</NavItem>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>Developer Lightspeed</MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  return (
    <Page masthead={masthead} sidebar={pageSidebar}>
      <PageSection style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--pf-t--global--spacer--md)', flexShrink: 0 }}>
          <Title headingLevel="h1" size="2xl">
            Developer Lightspeed
          </Title>
          <Checkbox
            label="Use custom drawer"
            isChecked={useCustomDrawer}
            onChange={(_event, checked) => setUseCustomDrawer(checked)}
            id="custom-drawer-toggle"
            style={{ marginBottom: '1rem' }}
          />
          <Tabs
            activeKey={activeHeaderTabKey}
            onSelect={(_event, tabIndex) => setActiveHeaderTabKey(tabIndex)}
            aria-label="Chatbot tabs"
          >
            <Tab eventKey={0} title={<TabTitleText>Chat</TabTitleText>} />
            <Tab eventKey={1} title={<TabTitleText>Notebooks</TabTitleText>} />
          </Tabs>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {!isDrawerExpanded && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRight:
                  'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)',
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                minWidth: '48px',
                width: '48px',
                gap: '0.5rem',
                padding: '0.5rem 0'
              }}
            >
              <Tooltip content="New chat" position="right">
                <Button
                  variant="plain"
                  aria-label="New chat"
                  onClick={() => {
                    setMessages([]);
                    setIsDrawerExpanded(false);
                  }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <PlusIcon />
                </Button>
              </Tooltip>

              <Tooltip content="Expand drawer" position="right">
                <Button
                  ref={expandButtonRef}
                  variant="plain"
                  aria-label="Expand drawer"
                  onClick={() => setIsDrawerExpanded(true)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <AngleDoubleRightIcon />
                </Button>
              </Tooltip>
            </div>
          )}
          <div style={{ flex: 1, minHeight: 0 }}>
            <Chatbot displayMode={displayMode}>
              {useCustomDrawer ? (
                <Drawer className="pf-chatbot__history" isExpanded={isDrawerExpanded} isInline position="left">
                  <DrawerContent panelContent={drawerPanel}>
                    <DrawerContentBody style={{ padding: 0 }}>
                      {activeHeaderTabKey === 0 ? (
                        <>
                          <ChatbotContent>
                            <MessageBox announcement={announcement}>
                              {messages.length === 0 ? (
                                <ChatbotWelcomePrompt
                                  title="Hello, Rachael"
                                  description="How can I help you today?"
                                  prompts={welcomePrompts}
                                />
                              ) : (
                                messages.map((message, index) => {
                                  if (index === messages.length - 1) {
                                    return (
                                      <div key={message.id}>
                                        <div ref={scrollToBottomRef}></div>
                                        <Message {...message} />
                                        {message.role === 'bot' && !message.isLoading && (
                                          <div style={{ padding: '0 1rem 1rem 3.5rem' }}>
                                            <ChatbotPopover
                                              headerContent="Sources"
                                              bodyContent={sourcesPopoverContent}
                                              position="top"
                                              maxWidth="400px"
                                              showClose={true}
                                            >
                                              <Button variant="link" isInline style={{ padding: 0 }}>
                                                <Label color="blue" style={{ cursor: 'pointer' }}>
                                                  3 Sources
                                                </Label>
                                              </Button>
                                            </ChatbotPopover>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div key={message.id}>
                                      <Message {...message} />
                                      {message.role === 'bot' && !message.isLoading && (
                                        <div style={{ padding: '0 1rem 1rem 3.5rem' }}>
                                          <ChatbotPopover
                                            headerContent="Sources"
                                            bodyContent={sourcesPopoverContent}
                                            position="top"
                                            maxWidth="400px"
                                          >
                                            <Button variant="link" isInline style={{ padding: 0 }}>
                                              <Label color="blue" style={{ cursor: 'pointer' }}>
                                                3 Sources
                                              </Label>
                                            </Button>
                                          </ChatbotPopover>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </MessageBox>
                          </ChatbotContent>
                          <ChatbotFooter>
                            <MessageBar onSendMessage={handleSend} isSendButtonDisabled={isSendButtonDisabled} />
                            <ChatbotFootnote {...footnoteProps} />
                          </ChatbotFooter>
                        </>
                      ) : (
                        <div
                          style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <EmptyState titleText="Notebooks" icon={CubesIcon} headingLevel="h4">
                            <EmptyStateBody>This is the Notebooks tab content.</EmptyStateBody>
                          </EmptyState>
                        </div>
                      )}
                    </DrawerContentBody>
                  </DrawerContent>
                </Drawer>
              ) : (
                <ChatbotConversationHistoryNav
                  displayMode={displayMode}
                  onDrawerToggle={() => setIsDrawerExpanded(!isDrawerExpanded)}
                  isDrawerOpen={isDrawerExpanded}
                  setIsDrawerOpen={setIsDrawerExpanded}
                  activeItemId={undefined}
                  onSelectActiveItem={() => {}}
                  conversations={conversations}
                  onNewChat={() => {
                    setMessages([]);
                    setIsDrawerExpanded(false);
                  }}
                  handleTextInputChange={(value) => {
                    setSearchValue(value);
                    if (value === '') {
                      setConversations(initialConversations);
                    } else {
                      const filtered = initialConversations.filter((conv) =>
                        conv.text.toLowerCase().includes(value.toLowerCase())
                      );
                      setConversations(filtered);
                    }
                  }}
                  drawerContent={
                    activeHeaderTabKey === 0 ? (
                      <>
                        <ChatbotContent>
                          <MessageBox announcement={announcement}>
                            {messages.length === 0 ? (
                              <ChatbotWelcomePrompt
                                title="Hello, Rachael"
                                description="How can I help you today?"
                                prompts={welcomePrompts}
                              />
                            ) : (
                              messages.map((message, index) => {
                                if (index === messages.length - 1) {
                                  return (
                                    <div key={message.id}>
                                      <div ref={scrollToBottomRef}></div>
                                      <Message {...message} />
                                      {message.role === 'bot' && !message.isLoading && (
                                        <div style={{ padding: '0 1rem 1rem 3.5rem' }}>
                                          <ChatbotPopover
                                            headerContent="Sources"
                                            bodyContent={sourcesPopoverContent}
                                            position="top"
                                            maxWidth="400px"
                                            showClose={true}
                                          >
                                            <Button variant="link" isInline style={{ padding: 0 }}>
                                              <Label color="blue" style={{ cursor: 'pointer' }}>
                                                3 Sources
                                              </Label>
                                            </Button>
                                          </ChatbotPopover>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                                return (
                                  <div key={message.id}>
                                    <Message {...message} />
                                    {message.role === 'bot' && !message.isLoading && (
                                      <div style={{ padding: '0 1rem 1rem 3.5rem' }}>
                                        <ChatbotPopover
                                          headerContent="Sources"
                                          bodyContent={sourcesPopoverContent}
                                          position="top"
                                          maxWidth="400px"
                                        >
                                          <Button variant="link" isInline style={{ padding: 0 }}>
                                            <Label color="blue" style={{ cursor: 'pointer' }}>
                                              3 Sources
                                            </Label>
                                          </Button>
                                        </ChatbotPopover>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </MessageBox>
                        </ChatbotContent>
                        <ChatbotFooter>
                          <MessageBar onSendMessage={handleSend} isSendButtonDisabled={isSendButtonDisabled} />
                          <ChatbotFootnote {...footnoteProps} />
                        </ChatbotFooter>
                      </>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EmptyState titleText="Notebooks" icon={CubesIcon} headingLevel="h4">
                          <EmptyStateBody>This is the Notebooks tab content.</EmptyStateBody>
                        </EmptyState>
                      </div>
                    )
                  }
                />
              )}
            </Chatbot>
          </div>
        </div>
      </PageSection>
    </Page>
  );
};
