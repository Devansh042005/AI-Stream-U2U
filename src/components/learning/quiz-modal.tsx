import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Trophy, Star, Coins, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AchievementBadge from '@/components/ui/achievement-badge';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  questions: QuizQuestion[];
  xpReward: number;
  onComplete: (score: number, earnedStars: number) => void;
}

const QuizModal = ({ isOpen, onClose, lessonTitle, questions, xpReward, onComplete }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setShowResults(true);
    
    // Calculate score
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const earnedStars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
    
    // Show completion toast
    toast({
      title: "🎉 Quiz Completed!",
      description: `You scored ${score}% and earned ${earnedStars} stars!`,
      duration: 5000,
    });

    // Show XP reward toast
    setTimeout(() => {
      toast({
        title: "💎 XP Earned!",
        description: `+${xpReward} XP added to your progress!`,
        duration: 4000,
      });
    }, 1000);

    // Show achievement if perfect score
    if (score === 100) {
      setTimeout(() => {
        toast({
          title: "🏆 Perfect Score Achievement!",
          description: "You've unlocked the 'Perfectionist' badge!",
          duration: 5000,
        });
      }, 2000);
    }

    setQuizCompleted(true);
    onComplete(score, earnedStars);
  };

  const calculateFinalScore = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    if (score >= 50) return 'text-accent';
    return 'text-destructive';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {showResults ? 'Quiz Results' : `Quiz: ${lessonTitle}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          {!showResults && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {!showResults ? (
            // Quiz Questions
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold leading-relaxed">
                  {currentQ.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={cn(
                        'w-full p-4 text-left rounded-lg border-2 transition-all duration-200',
                        selectedAnswers[currentQuestion] === index
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                          selectedAnswers[currentQuestion] === index
                            ? 'border-primary bg-primary text-white'
                            : 'border-muted-foreground'
                        )}>
                          {selectedAnswers[currentQuestion] === index && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
                </Button>
              </div>
            </div>
          ) : (
            // Quiz Results
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-achievement rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                  <p className="text-muted-foreground">Great job completing the quiz</p>
                </div>

                <div className="bg-gradient-card rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={cn('text-3xl font-bold', getScoreColor(calculateFinalScore()))}>
                        {calculateFinalScore()}%
                      </div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">+{xpReward}</div>
                      <div className="text-sm text-muted-foreground">XP Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center space-x-1 mb-1">
                        {[...Array(3)].map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              'w-6 h-6',
                              i < (calculateFinalScore() >= 90 ? 3 : calculateFinalScore() >= 70 ? 2 : calculateFinalScore() >= 50 ? 1 : 0)
                                ? 'text-accent fill-accent' 
                                : 'text-muted'
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">Stars</div>
                    </div>
                  </div>
                </div>

                {calculateFinalScore() === 100 && (
                  <div className="bg-gradient-success rounded-lg p-4">
                    <AchievementBadge
                      type="gold"
                      icon="trophy"
                      title="Perfect Score!"
                      description="Flawless completion"
                      size="sm"
                    />
                  </div>
                )}
              </div>

              <Button onClick={onClose} size="lg" className="w-full">
                Continue Learning
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizModal;