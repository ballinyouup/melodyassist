const Card = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="card w-full h-96 max-w-5xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>Card Text</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
