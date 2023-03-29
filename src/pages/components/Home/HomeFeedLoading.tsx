const HomeFeedLoading: React.FC = () => {
  return (
    <div className="flex w-full flex-row items-start justify-center">
      <div className="relative h-[520px] w-full max-w-2xl gap-1 overflow-y-auto rounded-xl bg-base-300 p-1">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-neutral-content">
          <i>Empty</i>
        </div>
      </div>
    </div>
  );
};

export default HomeFeedLoading;
