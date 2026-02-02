import { useState, useCallback, useEffect, useRef } from 'react';
import { useScribe, CommitStrategy } from '@elevenlabs/react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Mic, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface VoiceExpenseButtonProps {
  members: { id: string; name: string }[];
  tripName: string;
  onAddExpense: (data: {
    title: string;
    amount: number;
    paidBy: string;
    category: string;
  }) => Promise<void>;
}

// Check if browser SpeechRecognition is available
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export function VoiceExpenseButton({ members, tripName, onAddExpense }: VoiceExpenseButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [partialText, setPartialText] = useState('');
  const [useBrowserSTT, setUseBrowserSTT] = useState(false);
  const browserRecognitionRef = useRef<any>(null);

  const processExpense = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    toast.info('Processing: "' + text + '"');

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

      if (data.type === 'expense' && data.data) {
        const expenseData = data.data;
        
        // Find matching member
        const member = members.find(m => 
          m.name.toLowerCase() === expenseData.paidBy.toLowerCase()
        );
        
        if (!member) {
          toast.error(`Could not find member "${expenseData.paidBy}". Available members: ${members.map(m => m.name).join(', ')}`);
          return;
        }

        // Add the expense automatically
        await onAddExpense({
          title: expenseData.title,
          amount: expenseData.amount,
          paidBy: member.id,
          category: expenseData.category,
        });

        toast.success(`Added: ${expenseData.title} - ₹${expenseData.amount} paid by ${expenseData.paidBy}`);
      } else if (data.type === 'clarification') {
        toast.warning(data.message || 'Could not understand. Please try again.');
      } else {
        toast.error(data.message || 'Could not parse expense. Please try again.');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Failed to process voice command. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [members, tripName, onAddExpense]);

  // ElevenLabs Scribe hook
  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    commitStrategy: CommitStrategy.VAD,
    onCommittedTranscript: (data) => {
      console.log('Committed transcript:', data.text);
      if (data.text.trim()) {
        setPartialText('');
        processExpense(data.text);
      }
    },
    onPartialTranscript: (data) => {
      console.log('Partial:', data.text);
      setPartialText(data.text);
    },
  });

  // Browser SpeechRecognition fallback
  const startBrowserSTT = useCallback(() => {
    if (!SpeechRecognition) {
      toast.error('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Indian English for rupee context

    recognition.onstart = () => {
      setIsListening(true);
      setPartialText('');
      toast.info('🎤 Listening... Speak your expense now');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setPartialText(interim || final);
      if (final) {
        processExpense(final);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Browser STT error:', event.error);
      if (event.error !== 'no-speech') {
        toast.error('Voice recognition error. Please try again.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setPartialText('');
    };

    browserRecognitionRef.current = recognition;
    recognition.start();
  }, [processExpense]);

  const stopBrowserSTT = useCallback(() => {
    if (browserRecognitionRef.current) {
      browserRecognitionRef.current.stop();
      browserRecognitionRef.current = null;
    }
    setIsListening(false);
    setPartialText('');
  }, []);

  const startListening = useCallback(async () => {
    // If already using browser fallback, use it directly
    if (useBrowserSTT) {
      startBrowserSTT();
      return;
    }

    try {
      console.log('Starting voice recognition...');
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-scribe-token');
      
      if (error || !data?.token) {
        console.warn('ElevenLabs token failed, falling back to browser STT:', error);
        setUseBrowserSTT(true);
        startBrowserSTT();
        return;
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setIsListening(true);
      setPartialText('');
      toast.info('🎤 Listening... Speak your expense now');
    } catch (error) {
      console.warn('ElevenLabs failed, falling back to browser STT:', error);
      setUseBrowserSTT(true);
      startBrowserSTT();
    }
  }, [scribe, useBrowserSTT, startBrowserSTT]);

  const stopListening = useCallback(() => {
    if (useBrowserSTT) {
      stopBrowserSTT();
    } else {
      scribe.disconnect();
      setIsListening(false);
      setPartialText('');
    }
    console.log('Voice recognition stopped');
  }, [scribe, useBrowserSTT, stopBrowserSTT]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
      if (browserRecognitionRef.current) {
        browserRecognitionRef.current.stop();
      }
    };
  }, [scribe]);

  const isDisabled = isProcessing;

  return (
    <div className="relative">
      {/* Listening indicator */}
      <AnimatePresence>
        {(isListening || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-background border rounded-xl px-4 py-2 shadow-lg min-w-[200px] max-w-[280px]"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">🎤 Listening...</p>
                {partialText && (
                  <p className="text-sm text-foreground italic">"{partialText}"</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <Button
          size="lg"
          variant={isListening ? 'destructive' : 'default'}
          onClick={isListening ? stopListening : startListening}
          disabled={isDisabled}
          className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all"
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Mic className="h-6 w-6" />
            </motion.div>
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
