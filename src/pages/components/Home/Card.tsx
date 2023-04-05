const Card = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Card title!</h2>
        <p>Card Text</p>
        <div className="card-actions justify-end">
          <button className="btn-primary btn">Button Click</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
