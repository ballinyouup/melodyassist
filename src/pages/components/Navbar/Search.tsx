import { useState } from "react";

const Search = () => {
	const [searchBar, setSearchBar] = useState(false);

	return (
		<>
			<div className="flex flex-row overflow-clip">
				<input
					type="text"
					placeholder="Search"
					style={{
						visibility: searchBar ? "visible" : "hidden",
						transition: "1s",
					}}
					className={`input input-bordered w-80 outline-none rounded-md ${
						searchBar ? "animate-slideLeft" : "animate-slideRight"
					}`}
				/>
			</div>
			<button
				className="btn btn-ghost btn-square"
				onClick={() => {
					setSearchBar(!searchBar);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
		</>
	);
};

export default Search;
