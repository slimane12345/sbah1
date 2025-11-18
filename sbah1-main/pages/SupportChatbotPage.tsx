import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import ChatMessageBubble from '../components/chatbot/ChatMessage';
import QuickReplies from '../components/chatbot/QuickReplies';

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        sender: 'bot',
        text: 'مرحباً بك في مركز الدعم! كيف يمكنني مساعدتك اليوم؟',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['تتبع طلبي', 'مشكلة في الدفع', 'الإبلاغ عن مشكلة', 'أتحدث مع وكيل'],
    },
];

const botResponses: { [key: string]: string } = {
    'تتبع طلبي': 'بالتأكيد، الرجاء تزويدي برقم الطلب الخاص بك.',
    'مشكلة في الدفع': 'أنا آسف لسماع ذلك. هل يمكنك وصف المشكلة التي تواجهها؟',
    'الإبلاغ عن مشكلة': 'يرجى تقديم تفاصيل المشكلة وسأقوم بتوجيهها للفريق المختص.',
    'أتحدث مع وكيل': 'بالتأكيد، جاري تحويلك إلى أحد وكلاء الدعم الفني.',
    default: 'شكرًا لتواصلك معنا. كيف يمكنني مساعدتك أيضًا؟',
};

const SupportChatbotPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setTimeout(() => {
            const botResponseText = botResponses[text] || botResponses.default;
            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResponseText,
                timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                quickReplies: botResponseText.includes('وكيل') ? [] : ['شكراً لك', 'لدي سؤال آخر'],
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const lastMessage = messages[messages.length - 1];

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)]">
            {/* Chat Interface */}
            <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">محادثة مع العميل #5214</h3>
                    <p className="text-sm text-green-600">نشط الآن</p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <ChatMessageBubble key={msg.id} message={msg} />
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t bg-gray-50">
                    {lastMessage.sender === 'bot' && lastMessage.quickReplies && lastMessage.quickReplies.length > 0 && (
                         <QuickReplies replies={lastMessage.quickReplies} onReplyClick={handleSendMessage} />
                    )}
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendMessage(inputValue)}
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={() => handleSendMessage(inputValue)}
                            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Sidebar */}
            <div className="lg:w-1/3 xl:w-1/4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">أداء الشات بوت</h3>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">المحادثات النشطة</span>
                            <span className="font-bold text-lg text-blue-600">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">المشاكل المحلولة اليوم</span>
                            <span className="font-bold text-lg text-green-600">45</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">متوسط وقت الحل</span>
                            <span className="font-bold text-lg text-gray-800">3.5 دقائق</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">معدل الرضا</span>
                            <span className="font-bold text-lg text-yellow-500">92%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-600">تم التصعيد لوكيل</span>
                            <span className="font-bold text-lg text-red-500">8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportChatbotPage;
