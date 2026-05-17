"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Chào Sếp! Em là trợ lý AI của VimSolar. Sếp cần tư vấn lắp đặt hay tính toán ROI cho dự án nào ạ?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Bot automatic response logic
    setTimeout(() => {
      let botReply = "Dạ chuyên gia của VimSolar đã nhận được thông tin. Sếp vui lòng để lại SĐT hoặc gọi Hotline 0974 516 670 để được báo giá chính xác nhất ạ!";
      
      if (text.includes("Chi phí")) botReply = "Dạ chi phí lắp đặt tùy thuộc vào công suất hệ thống (kWp). Thông thường từ 12-15tr/kWp trọn gói. Sếp cho em biết diện tích mái hoặc hóa đơn tiền điện nhé?";
      if (text.includes("hoàn vốn")) botReply = "Dạ thời gian hoàn vốn trung bình từ 3.5 - 5 năm tùy thuộc vào mức độ sử dụng điện ban ngày của Sếp ạ.";
      if (text.includes("Hybrid")) botReply = "Hệ Hybrid là giải pháp vừa dùng điện mặt trời vừa có pin lưu trữ, giúp Sếp có điện dùng ngay cả khi mất điện lưới. Rất tối ưu cho biệt thự và nhà xưởng!";

      const botMsg: Message = { id: (Date.now() + 1).toString(), text: botReply, sender: "bot" };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const suggestions = [
    { q: "Chi phí lắp đặt?", a: "Chi phí" },
    { q: "Bao lâu hoàn vốn?", a: "hoàn vốn" },
    { q: "Hệ Hybrid là gì?", a: "Hybrid" },
    { q: "Chính sách bảo hành?", a: "bảo hành" }
  ];

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">V</div>
                <div>
                  <h3 className="font-bold text-sm">VimSolar Assistant</h3>
                  <p className="text-[10px] text-white/80">⚡ Đang trực tuyến</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg"><X size={20} /></button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-amber-500 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-gray-100"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Suggested Questions */}
              {messages.length < 4 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((s) => (
                    <button 
                      key={s.q}
                      className="bg-white border border-amber-500/30 text-amber-600 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                      onClick={() => handleSend(s.q)}
                    >
                      {s.q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white space-y-3">
              <a href="tel:0974516670" className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">
                <Phone size={16} /> Gọi chuyên gia: 0974 516 670
              </a>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập tin nhắn..." 
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500" 
                />
                <button type="submit" className="bg-amber-500 text-white p-2 rounded-xl hover:bg-amber-600 transition-transform active:scale-90">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-500 text-white p-3 md:p-4 rounded-full shadow-lg shadow-amber-500/40 flex items-center justify-center relative"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
      </motion.button>
    </div>
  );
}
