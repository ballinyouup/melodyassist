interface IQuestion {
  question: string;
  answer: string;
}

const Question: React.FC<IQuestion> = ({ question, answer }) => {
  return (
    <div className="collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
        {question}
      </div>
      <span className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
        <p>{answer}</p>
      </span>
    </div>
  );
};

export default Question;
