"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Question {
  question_id: number;
  question_text: string;
  correct_answer: string;
  option1: string;
  option2: string;
  option3: string;
  category_id: number;
  difficulty: string;
}

interface Category {
  category_id: number;
  name: string;
}

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    correct_answer: "",
    option1: "",
    option2: "",
    option3: "",
    category_id: 1,
    difficulty: "easy"
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Question | null>(null);

  const fetchQuestions = async () => {

    const curr_user = localStorage.getItem("username")
    const ressy = await fetch(`http://localhost:8080/get-user?username=${curr_user}`);
    const userData = await ressy.json();
    const userId = userData.user_id;

    const res = await fetch(`http://localhost:8080/user-questions?user_id=${userId}`);
    const data = await res.json();
    setQuestions(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/get-categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, []);

  const handleAddQuestion = async () => {
    const curr_user = localStorage.getItem("username")
    const res = await fetch(`http://localhost:8080/get-user?username=${curr_user}`);
    const userData = await res.json();
    const userId = userData.user_id;

    await fetch("http://localhost:8080/add-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newQuestion,
        user_id: userId //pranav vhange this to current user id
      })
    });
    setNewQuestion({
      question_text: "",
      correct_answer: "",
      option1: "",
      option2: "",
      option3: "",
      category_id: 1,
      difficulty: "easy"
    });
    fetchQuestions();
  };

  const handleDeleteQuestion = async (id: number) => {
    await fetch(`http://localhost:8080/delete-question?question_id=${id}`, {
      method: "DELETE"
    });
    fetchQuestions();
  };

  const handleSaveEdit = async () => {
    if (editingData) {
      await fetch("http://localhost:8080/edit-question", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingData)
      });
      setEditingId(null);
      setEditingData(null);
      fetchQuestions();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Questions</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
        <div className="grid gap-2">
          <Input
            placeholder="Question Text"
            value={newQuestion.question_text}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
          />
          <Input
            placeholder="Correct Answer"
            value={newQuestion.correct_answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
          />
          <Input
            placeholder="Option 1"
            value={newQuestion.option1}
            onChange={(e) => setNewQuestion({ ...newQuestion, option1: e.target.value })}
          />
          <Input
            placeholder="Option 2"
            value={newQuestion.option2}
            onChange={(e) => setNewQuestion({ ...newQuestion, option2: e.target.value })}
          />
          <Input
            placeholder="Option 3"
            value={newQuestion.option3}
            onChange={(e) => setNewQuestion({ ...newQuestion, option3: e.target.value })}
          />
          <Select value={String(newQuestion.category_id)} onValueChange={(value) => setNewQuestion({ ...newQuestion, category_id: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Questions</h2>
        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.question_id} className="border p-4 rounded">
                {editingId === q.question_id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingData?.question_text || ""}
                      onChange={(e) => setEditingData({ ...(editingData as Question), question_text: e.target.value })}
                    />
                    <Input
                      value={editingData?.correct_answer || ""}
                      onChange={(e) => setEditingData({ ...(editingData as Question), correct_answer: e.target.value })}
                    />
                    <Input
                      value={editingData?.option1 || ""}
                      onChange={(e) => setEditingData({ ...(editingData as Question), option1: e.target.value })}
                    />
                    <Input
                      value={editingData?.option2 || ""}
                      onChange={(e) => setEditingData({ ...(editingData as Question), option2: e.target.value })}
                    />
                    <Input
                      value={editingData?.option3 || ""}
                      onChange={(e) => setEditingData({ ...(editingData as Question), option3: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setEditingData(null); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold">{q.question_text}</h3>
                    <p>Correct: {q.correct_answer}</p>
                    <p>Option 1: {q.option1}</p>
                    <p>Option 2: {q.option2}</p>
                    <p>Option 3: {q.option3}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(q.question_id)}>
                        Delete
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingId(q.question_id);
                        setEditingData(q);
                      }}>
                        Edit
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}