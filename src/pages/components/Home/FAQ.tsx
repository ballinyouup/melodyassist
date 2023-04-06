import Question from "./Question";

const FAQ = () => {
  const questionsAndAnswers = [
    {
      question: "Are the samples royalty free?",
      answer: "Yes. You never have to worry about using them in your project.",
    },
    {
      question: "What BPM are the samples generated in?",
      answer: "Every drum loop is generated at around 128 BPM.",
    },
    {
      question: "Can I choose my seed?",
      answer:
        "Seed selection will be coming soon. You will be able to generate a random seed from 1 to 2.7 billion",
    },
    {
      question: "What is the current pricing?",
      answer:
        "Currently drum loop generation is free, but is likely to change as we roll into beta",
    },
    {
      question: "How much does it cost per drum loop generation?",
      answer: "It costs about $0.02 per drum loop generation.",
    },
    {
      question: "What is a cold start and how long does it last?",
      answer:
        "To make good use of resources, we only run the model at request time. When a model hasn't been used for around 10 minutes, it gets shut off. Machine learning models are often very large and resource intensive, and we have to fetch and load several gigabytes of code. In some cases this process can take several minutes to start. As we grow in demand, cold boots are likely to become less frequent.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      {questionsAndAnswers.map((item, index) => (
        <div key={index} className="w-full sm:max-w-5xl">
          <Question question={item.question} answer={item.answer} />
        </div>
      ))}
    </div>
  );
};

export default FAQ;
