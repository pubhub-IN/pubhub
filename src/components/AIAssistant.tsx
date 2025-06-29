import React, { useState, useRef, useEffect, useCallback } from "react";
import { authService, AuthUser } from "../lib/auth-jwt";
import { Send, MessageCircle, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id?: string;
  user_id?: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

// For API requests to the AI endpoint
interface ApiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const DEFAULT_SYSTEM_MESSAGE: ApiMessage = {
  role: "system",
  content:
    "You are an Expert in all programming languages. You Know everything from planning to designining to developing to deploying and shipping. You're an expert CTO of PubHub (PubHub is a all-in-one developer platform built specially for techies and founders to manage their coding journey, share their progress, and grow in public. From their first commit to their next big launch, PubHub helps users showcase their work, connect with other developers, and advance their career through continuous learning). Features -> Dashboard & Analytics : 1. Comprehensive GitHub activity tracking with commit history and language distribution. 2.Real-time statistics on active days, repositories, and technologies. 3. Modern, responsive UI with light/dark mode support. \n Social Features : 1.Connect with other developers through friend requests. 2. Real-time notifications and updates. 3.Share repository updates directly to social media platforms. 4.Customizable profile with technology preferences and profession. \n Learning & Growth : 1. Interactive courses across multiple programming languages and frameworks. 2. Personalized learning paths based on your profession. 3. Hands-on coding exercises and projects. 4.Progress tracking and course completion certificates. \n Developer Opportunities : Discover and participate in hackathons : 1. Explore curated open-source projects to solve organizations issues as your proof of knowledge. 2. Access recorded tech lectures and tutorials. 3. Track your contributions and achievements . When users asks where can they learn a language tell them to visit start learning page and recorded lectures page. When users asks where can they find open source projects tell them to visit open source projects page. When users asks where can they find their progress tell them to visit dashboard page. when users asks how can they connect with other developers tell them to visit people page and When users asks how can they share their progress tell them to visit share on socials page.",
};

// Basic Markdown Renderer for Assistant Messages
function renderMarkdown(content: string) {
  // Split by code blocks first
  const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
  // let lastIndex = 0;
  let match;
  const elements: React.ReactNode[] = [];
  let key = 0;

  // Helper to render markdown for non-code text
  function renderInlineMarkdown(text: string) {
    const lines = text.split(/\n/);
    const rendered: React.ReactNode[] = [];
    let inList = false;
    let inNumList = false;
    let listItems: React.ReactNode[] = [];
    let numListItems: React.ReactNode[] = [];
    lines.forEach((line) => {
      // Headings
      if (/^### (.*)/.test(line)) {
        if (inList) {
          rendered.push(
            <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumList) {
          rendered.push(
            <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
              {numListItems}
            </ol>
          );
          numListItems = [];
          inNumList = false;
        }
        rendered.push(
          <div className="text-lg font-bold mt-4 mb-2" key={`h3-${key++}`}>
            {line.replace(/^### /, "")}
          </div>
        );
      } else if (/^## (.*)/.test(line)) {
        if (inList) {
          rendered.push(
            <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumList) {
          rendered.push(
            <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
              {numListItems}
            </ol>
          );
          numListItems = [];
          inNumList = false;
        }
        rendered.push(
          <div className="text-xl font-bold mt-5 mb-2" key={`h2-${key++}`}>
            {line.replace(/^## /, "")}
          </div>
        );
      } else if (/^# (.*)/.test(line)) {
        if (inList) {
          rendered.push(
            <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumList) {
          rendered.push(
            <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
              {numListItems}
            </ol>
          );
          numListItems = [];
          inNumList = false;
        }
        rendered.push(
          <div className="text-2xl font-bold mt-6 mb-3" key={`h1-${key++}`}>
            {line.replace(/^# /, "")}
          </div>
        );
      }
      // Numbered List
      else if (/^\d+\. (.*)/.test(line)) {
        if (inList) {
          rendered.push(
            <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        inNumList = true;
        numListItems.push(
          <li key={`numli-${key++}`}>
            {renderBoldItalics(line.replace(/^\d+\. /, ""))}
          </li>
        );
      }
      // Bulleted List
      else if (/^[-*] (.*)/.test(line)) {
        if (inNumList) {
          rendered.push(
            <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
              {numListItems}
            </ol>
          );
          numListItems = [];
          inNumList = false;
        }
        inList = true;
        listItems.push(
          <li key={`li-${key++}`}>
            {renderBoldItalics(line.replace(/^[-*] /, ""))}
          </li>
        );
      }
      // Empty line
      else if (/^\s*$/.test(line)) {
        if (inList) {
          rendered.push(
            <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumList) {
          rendered.push(
            <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
              {numListItems}
            </ol>
          );
          numListItems = [];
          inNumList = false;
        }
        rendered.push(<div className="my-2" key={`br-${key++}`}></div>);
      }
      // Paragraph
      else {
        if (inList) {
          rendered.push(
            <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumList) {
          rendered.push(
            <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
              {numListItems}
            </ol>
          );
          numListItems = [];
          inNumList = false;
        }
        rendered.push(
          <div className="mb-2" key={`p-${key++}`}>
            {renderBoldItalics(line)}
          </div>
        );
      }
    });
    // Flush any remaining lists
    if (inList)
      rendered.push(
        <ul className="list-disc ml-6 mb-2" key={`ulist-${key++}`}>
          {listItems}
        </ul>
      );
    if (inNumList)
      rendered.push(
        <ol className="list-decimal ml-6 mb-2" key={`olist-${key++}`}>
          {numListItems}
        </ol>
      );
    return rendered;
  }

  // Inline bold/italic
  function renderBoldItalics(text: string) {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Inline code
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  let lastIdx = 0;
  let codeIdx = 0;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIdx) {
      elements.push(
        <div key={`md-${key++}`}>
          {renderInlineMarkdown(content.slice(lastIdx, match.index))}
        </div>
      );
    }
    const language = match[1] || "javascript";
    const code = match[2];
    elements.push(
      <div key={`codeblock-${codeIdx++}`} className="my-4">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ borderRadius: "0.5rem", margin: 0, fontSize: 15 }}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < content.length) {
    elements.push(
      <div key={`md-last`}>{renderInlineMarkdown(content.slice(lastIdx))}</div>
    );
  }
  return (
    <div className="prose prose-invert max-w-none text-base">{elements}</div>
  );
}

export function AIAssistant({ user }: { user?: AuthUser }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSessionId] = useState<string>(() => generateSessionId());
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initializeChat = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat-messages/${currentSessionId}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (!response.ok)
        throw new Error(`Failed to fetch chat messages: ${response.status}`);
      const existingMessages = await response.json();
      if (existingMessages.length > 0) {
        setMessages(existingMessages);
      }
      setIsInitialized(true);
    } catch {
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentSessionId]);

  useEffect(() => {
    if (user && !isInitialized) {
      initializeChat();
    }
  }, [user, isInitialized, initializeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function generateSessionId() {
    return `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const userMessage: Message = {
      session_id: currentSessionId,
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      await fetch("/api/chat-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          session_id: userMessage.session_id,
          role: userMessage.role,
          content: userMessage.content,
        }),
      });
      const contextMessages = [
        DEFAULT_SYSTEM_MESSAGE,
        ...messages
          .slice(-9)
          .map((msg) => ({ role: msg.role, content: msg.content })),
        { role: userMessage.role, content: userMessage.content },
      ];
      const aiResponse = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          messages: contextMessages,
          sessionId: currentSessionId,
        }),
      });
      if (!aiResponse.ok) throw new Error("Failed to get AI response");
      const responseData = await aiResponse.json();
      const updatedMessagesResponse = await fetch(
        `/api/chat-messages/${currentSessionId}`,
        { headers: { Authorization: `Bearer ${authService.getToken()}` } }
      );
      if (updatedMessagesResponse.ok) {
        const updatedMessages = await updatedMessagesResponse.json();
        setMessages(updatedMessages);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            session_id: currentSessionId,
            role: "assistant",
            content: responseData.response,
            id: `assistant-${Date.now()}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          session_id: currentSessionId,
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
          id: `error-${Date.now()}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show chat after first message is sent
  const hasChatStarted = messages.length > 0;
  const displayMessages = messages.filter((msg) => msg.role !== "system");
  const userName = user?.name || "there";

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-[#39D353] hover:bg-green-500 transition-all duration-300"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      )}
      {/* Assistant Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#18181A] flex flex-col items-center justify-center text-white font-sans">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-[#232324] hover:bg-[#232324]/80 border border-[#232324] text-gray-300"
            aria-label="Close AI Assistant"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-[50%] mx-auto flex flex-col items-center justify-center min-h-[80vh] h-[80vh]">
            {/* Welcome Section */}
            {!hasChatStarted && (
              <>
                <div className="flex flex-col items-center mb-8 mt-8">
                  <h1 className="text-4xl md:text-5xl font-poppins font-semibold text-center mb-2">
                    How can I help you, {userName}?
                  </h1>
                </div>
                <div className="w-full flex flex-col items-center">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col items-center"
                  >
                    <div className="relative w-full max-w-xl">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="How can I help you today?"
                        className="w-full rounded-xl bg-[#232324] border border-[#232324] text-lg px-6 py-5 pr-44 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all shadow-md placeholder-gray-400"
                        disabled={isLoading || !user}
                      />
                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={isLoading || !input.trim() || !user}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#18181A] hover:bg-black disabled:bg-black-300 text-white cursor-pointer rounded-lg p-2 transition-colors"
                        aria-label="Send message"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
            {/* Chat Section */}
            {hasChatStarted && (
              <div className="w-full flex flex-col items-center h-full relative">
                {/* Scrollable chat messages area */}
                <div
                  className="w-full flex-1 overflow-y-auto mx-auto flex flex-col gap-6 mt-8 mb-4 px-1 h-[calc(80vh-100px)] pb-32"
                  style={{ maxHeight: "calc(80vh - 100px)" }}
                >
                  {displayMessages.map((msg, idx) => (
                    <div
                      key={msg.id || `${msg.role}-${idx}`}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-md text-base whitespace-pre-line ${
                          msg.role === "user"
                            ? "bg-green-400 text-white rounded-tr-none"
                            : "bg-[#232324] text-gray-100 border border-[#232324] rounded-tl-none"
                        }`}
                      >
                        <div>
                          {msg.role === "assistant"
                            ? renderMarkdown(msg.content)
                            : msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl px-5 py-4 shadow-md bg-[#232324] text-gray-100 border border-[#232324] rounded-tl-none">
                        <span className="animate-pulse">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Fixed input at bottom */}
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-xl mx-auto flex flex-col items-center fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                  <div className="relative w-full">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="How can I help you today?"
                      className="w-full rounded-xl bg-[#232324] border border-[#232324] text-lg px-6 py-5 pr-44 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all shadow-md placeholder-gray-400"
                      disabled={isLoading || !user}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim() || !user}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#18181A] hover:bg-black disabled:bg-black-300 text-white cursor-pointer rounded-lg p-2 transition-colors"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
