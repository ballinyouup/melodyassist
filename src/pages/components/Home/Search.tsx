const Search: React.FC = () => {
  return (
    <div>
      <div className="flex h-40 flex-row items-center justify-center overflow-clip">
        <input
          type="text"
          placeholder="Search"
          className="input-bordered input w-full rounded-full outline-none sm:w-1/2"
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex h-fit w-full justify-center text-2xl font-bold">
          <span>Trending Tags</span>
        </div>
        <div className="flex w-full justify-center gap-4">
          <button className="btn rounded-2xl">Hip Hop</button>
          <button className="btn rounded-2xl">Dance</button>
          <button className="btn rounded-2xl">Electronic</button>
          <button className="btn rounded-2xl">Lofi</button>
          <button className="btn rounded-2xl">Drums</button>
        </div>
      </div>
    </div>
  );
};

export default Search;
