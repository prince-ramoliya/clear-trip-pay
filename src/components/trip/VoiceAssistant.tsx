import { useState, useCallback, useEffect } from 'react';
import { useScribe, CommitStrategy } from '@elevenlabs/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, X, Loader2, Check, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  expenseData?: {
    title: string;
    amount: number;
    paidBy: string;
    category: string;
  };
}

interface VoiceAssistantProps {
  members: { id: string; name: string }[];
  tripName: string;
  onAddExpense: (data: {
    title: string;
    amount: number;
    paidBy: string;
    category: string;
  }) => Promise<void>;
}

export function VoiceAssistant({ members, tripName, onAddExpense }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [pendingExpense, setPendingExpense] = useState<Message['expenseData'] | null>(null);

  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    commitStrategy: CommitStrategy.VAD,
    onCommittedTranscript: (data) => {
      console.log('Committed transcript:', data.text);
      if (data.text.trim()) {
        handleUserMessage(data.text);
      }
    },
    onPartialTranscript: (data) => {
      console.log('Partial:', data.text);
    },
  });

  const startListening = useCallback(async () => {
    try {
      console.log('Starting voice recognition...');
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-scribe-token');
      
      if (error || !data?.token) {
        console.error('Failed to get token:', error);
        throw new Error('Could not get speech recognition token');
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setIsListening(true);
      console.log('Voice recognition started');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  }, [scribe]);

  const stopListening = useCallback(() => {
    scribe.disconnect();
    setIsListening(false);
    console.log('Voice recognition stopped');
  }, [scribe]);

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-parse-expense', {
        body: {
          message: text,
          members: members.map(m => ({ name: m.name })),
          tripName,
        },
      });

      if (error) throw error;

      console.log('AI response:', data);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message || 'I understood your request.',
        expenseData: data.type === 'expense' ? data.data : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.type === 'expense' && data.data) {
        setPendingExpense(data.data);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I had trouble understanding that. Could you try again?',
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserMessage(textInput.trim());
      setTextInput('');
    }
  };

  const confirmExpense = async () => {
    if (!pendingExpense) return;
    
    try {
      const member = members.find(m => 
        m.name.toLowerCase() === pendingExpense.paidBy.toLowerCase()
      );
      
      if (!member) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Could not find member "${pendingExpense.paidBy}". Please try again.`,
        }]);
        setPendingExpense(null);
        return;
      }

      await onAddExpense({
        title: pendingExpense.title,
        amount: pendingExpense.amount,
        paidBy: member.id,
        category: pendingExpense.category,
      });

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `✅ Added expense: ${pendingExpense.title} - $${pendingExpense.amount} paid by ${pendingExpense.paidBy}`,
      }]);
      setPendingExpense(null);
    } catch (error) {
      console.error('Error adding expense:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Failed to add the expense. Please try again.',
      }]);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, [scribe]);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 w-[calc(100vw-32px)] max-w-md"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    🎙️
                  </div>
                  AI Expense Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-64 pr-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p className="text-sm mb-2">👋 Hi! I can help you add expenses.</p>
                      <p className="text-xs">Try saying: "John paid $50 for dinner"</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-2xl px-4 py-2.5">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Pending Expense Confirmation */}
                {pendingExpense && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-accent/50 rounded-xl p-3 border border-primary/20"
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-2">Confirm expense:</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{pendingExpense.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ${pendingExpense.amount} • {pendingExpense.paidBy} • {pendingExpense.category}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setPendingExpense(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={confirmExpense}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Voice & Text Input */}
                <div className="flex gap-2">
                  <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type or use voice..."
                      className="flex-1 h-12 text-base"
                      disabled={isProcessing}
                    />
                    <Button type="submit" size="icon" className="h-12 w-12" disabled={!textInput.trim() || isProcessing}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                  
                  <Button
                    size="icon"
                    variant={isListening ? 'destructive' : 'secondary'}
                    className="h-12 w-12 shrink-0"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <MicOff className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {isListening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-muted-foreground"
                  >
                    🎤 Listening... Speak now
                    {scribe.partialTranscript && (
                      <span className="block mt-1 text-foreground italic">
                        "{scribe.partialTranscript}"
                      </span>
                    )}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
