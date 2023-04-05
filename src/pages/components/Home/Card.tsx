/* eslint-disable @next/next/no-img-element */
interface CardProps {
  title: string;
  image: string;
  reverse?: boolean;
  text: string;
}

const Card: React.FC<CardProps> = ({ title, image, reverse = false, text }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="card static h-full w-full max-w-5xl bg-base-100 md:h-80 md:shadow-xl">
        <div
          className={`card-body flex-col items-center overflow-hidden p-0 md:items-start ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <img
            src={image}
            alt="image"
            className="h-80 w-96 object-cover md:h-max md:w-1/2"
          />
          <span className="flex w-full flex-col items-center justify-center">
            <h2 className="text-lg font-bold">{title}</h2>
            <p>{text}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
