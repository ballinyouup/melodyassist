const Search: React.FC = () => {
  return (
    <div className="flex h-40 flex-row items-center justify-center overflow-clip">
      <input
        type="text"
        placeholder="Search"
        className="input-bordered input w-full rounded-full outline-none sm:w-1/2"
      />
    </div>
  );
};

export default Search;
