import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const sampleQuestions = [
  "How much can I save this month?",
  "Give me a summary of my expenses",
  "Suggest investment options",
  "What's my spending pattern?",
  "Help me create a budget plan",
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your personal finance assistant. I can help you track expenses, plan budgets, suggest investments, and answer financial questions. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response (replace with actual API call later)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("save") || input.includes("saving")) {
      return "Based on your current income of ₹75,000 and expenses of ₹45,000, you can save ₹30,000 this month. That's a 40% savings rate - excellent work! Consider investing some of this in mutual funds or SIPs for long-term growth.";
    }
    
    if (input.includes("expense") || input.includes("spending")) {
      return "Your monthly expenses breakdown:\n• Rent: ₹20,000 (44.4%)\n• Food: ₹12,000 (26.7%)\n• Transport: ₹8,000 (17.8%)\n• Entertainment: ₹3,000 (6.7%)\n• Others: ₹2,000 (4.4%)\n\nYour largest expense category is rent. Consider if there are ways to optimize your food and transport costs.";
    }
    
    if (input.includes("invest") || input.includes("investment")) {
      return "Here are some investment suggestions based on your profile:\n\n🔹 **Emergency Fund**: Build 6 months of expenses (₹2.7L) in a high-yield savings account\n🔹 **SIP in Equity Mutual Funds**: ₹15,000/month for long-term wealth building\n🔹 **ELSS Funds**: ₹12,500/month for tax saving under 80C\n🔹 **Gold ETF**: 5-10% allocation for diversification\n\nStart with index funds if you're a beginner. Would you like specific fund recommendations?";
    }
    
    if (input.includes("budget") || input.includes("plan")) {
      return "Let me create a budget plan for you:\n\n**Income**: ₹75,000\n**Fixed Expenses**: ₹35,000 (Rent, utilities, insurance)\n**Variable Expenses**: ₹20,000 (Food, transport, entertainment)\n**Savings**: ₹20,000 (27% savings rate)\n\n**Recommendations**:\n• Try to reduce variable expenses by ₹5,000\n• Increase savings rate to 35-40%\n• Set up automatic transfers to savings\n\nWould you like help setting specific spending limits for each category?";
    }
    
    return "I understand you're asking about your finances. I can help with budgeting, expense tracking, investment advice, and financial planning. Could you be more specific about what you'd like to know? For example, you could ask about your savings potential, expense breakdown, or investment options.";
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.sender === "bot" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            )}
            
            <div
              className={cn(
                "max-w-md p-3 rounded-lg text-sm",
                message.sender === "user"
                  ? "bg-emerald-600 text-white rounded-br-sm"
                  : "bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-bl-sm shadow-sm text-gray-900 dark:text-white"
              )}
            >
              <div className="whitespace-pre-line">{message.content}</div>
              <div
                className={cn(
                  "text-xs mt-1",
                  message.sender === "user" ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"
                )}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.sender === "user" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="bg-white border rounded-lg rounded-bl-sm shadow-sm p-3 max-w-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Questions */}
      {messages.length === 1 && (
        <Card className="m-4 p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Try asking:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto p-2 text-xs"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your finances..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
