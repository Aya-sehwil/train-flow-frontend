 import React from 'react';
import { Search, Send } from 'lucide-react';

export default function CommunicationTab({
  myStudents,
  studentsLoading,
  activeChatStudent,
  setActiveChatStudent,
  chatMessages,
  chatLoading,
  newMessage,
  setNewMessage,
  chatSearchQuery,
  setChatSearchQuery,
  handleSendMessage,
}) {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="space-y-0.5 shrink-0 text-right">
        <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800 font-cairo">التواصل مع الطلاب</h1>
        <p className="text-gray-400 text-xs font-semibold">مراسلة مباشرة مع الطلاب الخاضعين لإشرافك الأكاديمي.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm items-stretch">

        {/* 1. Students List Sidebar */}
        <div className="border-l border-gray-100 flex flex-col bg-gray-50/20">
          <div className="p-4 border-b border-gray-50 shrink-0 space-y-3">
            <h3 className="text-xs font-extrabold text-gray-800">الطلاب ({myStudents.length})</h3>
            <div className="relative">
              <input
                type="text"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder="البحث عن طالب..."
                className="w-full py-2.5 pl-3 pr-9 border border-gray-200 bg-white rounded-xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
              />
              <Search className="absolute inset-y-0 right-3.5 h-4 w-4 my-auto text-gray-400" />
            </div>
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto min-h-[400px]">
            {studentsLoading && (
              <p className="text-xs text-gray-400 text-center py-6">جاري تحميل الطلاب...</p>
            )}

            {!studentsLoading && myStudents.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">لا يوجد طلاب مرتبطون بك حالياً</p>
            )}

            {!studentsLoading && myStudents
              .filter(s => s.full_name.toLowerCase().includes(chatSearchQuery.toLowerCase()))
              .map(student => (
              <div
                key={student.student_id}
                onClick={() => setActiveChatStudent(student)}
                className={`p-3.5 rounded-2xl cursor-pointer text-right transition flex justify-between items-center gap-3 ${
                  activeChatStudent?.student_id === student.student_id
                    ? 'bg-purple-50/70 border border-purple-100/50'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="text-right space-y-0.5 overflow-hidden flex-1">
                  <h4 className="text-xs font-extrabold text-gray-800 truncate">{student.full_name}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{student.major}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-100 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0">
                  {student.full_name.charAt(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Chat Window */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white h-[600px]">
          {!activeChatStudent ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-bold">
              اختاري طالباً من القائمة لبدء المحادثة
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                <div />
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-800">{activeChatStudent.full_name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">{activeChatStudent.major}</p>
                  </div>
                  <div className="h-10 w-10 bg-purple-50 text-brand-purple rounded-2xl flex items-center justify-center font-bold text-sm shrink-0">
                    {activeChatStudent.full_name.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Messages Log */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50/10">
                {chatLoading && (
                  <p className="text-xs text-gray-400 text-center py-6">جاري تحميل المحادثة...</p>
                )}

                {!chatLoading && chatMessages.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">لا توجد رسائل بعد، ابدئي المحادثة!</p>
                )}

                {!chatLoading && chatMessages.map((msg) => {
                  const isOwn = msg.sender_role === 'supervisor';
                  return (
                    <div key={msg.message_id} className={`flex items-start gap-2 max-w-sm lg:max-w-md ${isOwn ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        isOwn ? 'bg-purple-100 text-brand-purple' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isOwn ? 'م' : activeChatStudent.full_name.charAt(0)}
                      </div>
                      <div className="space-y-0.5 text-right w-full">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                          isOwn ? 'bg-brand-purple text-white rounded-tl-none shadow-sm' : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-tr-none'
                        }`}>
                          <p>{msg.message_body}</p>
                          <span className={`text-[8px] mt-1 block text-left ${isOwn ? 'text-purple-200' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-50 flex items-center gap-2.5 shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالة..."
                  className="flex-1 py-2 px-4 border border-gray-200 bg-[#fbfbfd] rounded-2xl text-right text-xs focus:outline-none focus:border-brand-purple/40"
                />
                <button type="submit" className="p-2.5 bg-brand-purple text-white rounded-xl hover:bg-brand-purpleDark transition shrink-0">
                  <Send className="h-4.5 w-4.5 transform rotate-180" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}